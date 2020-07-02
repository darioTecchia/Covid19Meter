<template>
  <div>
    <b-card title="Riepilogo generale province" v-if="provincesData">
      <div>
        <label for="example-datepicker">Seleziona regione</label>
        <b-form-select @change="getProvincesData(data, data, selectedRegion)" v-model="selectedRegion" :options="regions"></b-form-select>
        <label for="example-datepicker">Filtra per data</label>
        <b-form-datepicker
          @input="getProvincesData(data, data, selectedRegion)"
          min="2020-02-24"
          max="2020-05-22"
          id="example-datepicker"
          v-model="data"
          class="mb-2"
        ></b-form-datepicker>
      </div>

      <b-table class hover :items="provincesData" :fields="tableFields" head-variant="light">
        <template v-slot:cell(data)="item">{{item.value | formatDate('ll')}}</template>
        <template v-slot:cell(variazione_totale_positivi)="item">
          <span :class="item.value > 0 ? 'text-danger' : 'text-success'">
            {{item.value}}
            <i v-if="item.value > 0" class="fa fa-angle-double-up"></i>
            <i v-else class="fa fa-angle-double-down"></i>
          </span>
        </template>
      </b-table>
    </b-card>

    <b-card title="Seleziona una regione per visualizzare il riepilogo singola regione">
      <div style="width: 100%; height: 600px" id="regional_map"></div>

      <b-card
        class="mt-4"
        :title="'Grafici Provincia di ' + singleRegionProvinceData[0].denominazione_provincia"
        v-if="singleRegionProvinceData.length"
      >
        <main-chart-example
          :labels="labels"
          :datasets="[totalCases]"
          class="chart-wrapper"
          style="height:300px;margin-top:40px;"
          height="300"
        ></main-chart-example>
      </b-card>

      <b-card
        :title="'Medie Provincia di ' + singleRegionProvinceData[0].denominazione_provincia + '/' + provinceAverage.regionalAverage[0]._id.denominazione_regione"
        v-if="provinceAverage && singleRegionProvinceData.length"
      >
        <h5>
          Media totale casi:
          <code>{{parseInt(this.provinceAverage.provinceAverages[0].media_totale_casi)}}</code>
          /
          <code>{{parseInt(this.provinceAverage.regionalAverage[0].media_totale_positivi)}}</code>
        </h5>
      </b-card>

      <b-card
        :title="'Tabella Provincia di ' + singleRegionProvinceData[0].denominazione_provincia"
        v-if="singleRegionProvinceData.length"
      >
        <b-table
          class
          hover
          :items="singleRegionProvinceData"
          :fields="provinceTableFields"
          head-variant="light"
        >
          <template v-slot:cell(data)="item">{{item.value | formatDate('ll')}}</template>
        </b-table>
      </b-card>
    </b-card>
  </div>
</template>

<script>
import MainChartExample from "~/components/dashboard/MainChartExample";
import RadarExample from "~/components/charts/RadarExample";

const moment = require("moment-timezone");
moment.locale("it");
moment.tz.setDefault("Europe/Rome");

const brandSuccess = "#4dbd74";
const brandInfo = "#63c2de";
const brandDanger = "#f86c6b";

export default {
  data() {
    return {
      provincesData: [],
      singleRegionProvinceData: [],
      provinceAverage: null,
      regions: [
        { value: 1, text: "Piemonte" },
        { value: 14, text: "Molise" },
        { value: 15, text: "Campania" },
        { value: 3, text: "Lombardia" }
      ],
      page: 1,
      selectedRegion: 1,
      selectedProvince: 'NA',
      data: "2020-05-22",
      from: "2020-05-22",
      to: "2020-05-22",
      tableFields: [
        {key: "data", sortable: true },
        {key: "denominazione_provincia", sortable: true },
        {key: "sigla_provincia", sortable: true },
        {key: "totale_casi", sortable: true }
      ],
      provinceTableFields: [
        { key: "data", sortable: true },
        { key: "totale_casi", sortable: true },
      ]
    };
  },
  components: {
    MainChartExample,
    RadarExample
  },
  mounted() {
    this.getProvincesData(this.data, this.data, this.selectedRegion);
    this.drawMap();
  },
  computed: {
    labels() {
      return this.singleRegionProvinceData.map(e => {
        return moment(e.data).format("LL");
      });
      sin;
    },
    totalCases() {
      return {
        label: "Totale Positivi",
        data: this.singleRegionProvinceData.map(e => {
          return e.totale_casi;
        }),
        backgroundColor: this.convertHex(brandInfo, 10),
        pointHoverBackgroundColor: "#fff",
        borderColor: brandInfo,
        borderWidth: 2
      };
    },
    totalBuffers() {
      return {
        label: "Tamponi",
        data: this.singleRegionProvinceData.map(e => {
          return e.tamponi;
        }),
        pointHoverBackgroundColor: "#fff",
        borderColor: brandSuccess,
        borderWidth: 2
      };
    }
  },
  methods: {
    drawMap() {
      $("#regional_map").vectorMap({
        map: "it_merc",
        onRegionClick: (element, code, region) => {
          console.log(element, code, region);
          const province = code.split('-')[1]
          this.getSingleProvinceData(0, moment().format("YYYY-MM-DD"), province);
          this.getSingleProvinceAvg(province);
          this.selectedProvince = province;
        }
      });
    },
    convertHex(hex, opacity) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const result =
        "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
      return result;
    },
    async getProvincesData(from, to, regionCode) {
      this.provincesData = await this.$axios.$get(
        `/api/provincial_data?from=${from}&to=${to}&codice_regione=${regionCode ||
          1}`
      );
    },
    async getSingleProvinceData(from, to, province) {
      this.singleRegionProvinceData = await this.$axios.$get(
        `/api/provincial_data/province/${province}?from=${from}&to=${to}`
      );
    },
    async getSingleProvinceAvg(province) {
      this.provinceAverage = await this.$axios.$get(
        `/api/provincial_data/avg?sigla_provincia=${province}`
      );
    }
  }
};
</script>

<style>
</style>