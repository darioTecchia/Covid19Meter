<template>
  <div>
    <b-card title="Riepilogo generale regioni" v-if="regionalData.docs.length">
      <div>
        <label for="example-datepicker">Filtra per data</label>
        <b-form-datepicker
          @input="getRegionalData(1, data, data)"
          min="2020-02-24"
          max="2020-05-22"
          id="example-datepicker"
          v-model="data"
          class="mb-2"
        ></b-form-datepicker>
      </div>
      <b-table class hover :items="regionalData.docs" :fields="tableFields" head-variant="light">
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
        :title="'Grafici Regione ' + singleRegionData[0].denominazione_regione"
        v-if="singleRegionData.length"
      >
        <main-chart-example
          :labels="labels"
          :datasets="[totalPositives]"
          class="chart-wrapper"
          style="height:300px;margin-top:40px;"
          height="300"
        ></main-chart-example>
      </b-card>

      <b-card
        :title="'Tabella Regione ' + singleRegionData[0].denominazione_regione"
        v-if="singleRegionData.length"
      >
        <b-table class hover :items="singleRegionData" :fields="regionTableFields" head-variant="light">
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

      <b-card
        :title="'Medie Regione ' + singleRegionData[0].denominazione_regione + '/Nazionale'"
        v-if="regionalAverage && singleRegionData.length"
      >
        <h5>
          Media giornaliera totale positivi:
          <code>{{parseInt(this.regionalAverage.regionalAverages[0].media_totale_positivi)}}</code>
          /
          <code>{{parseInt(this.regionalAverage.nationalAverage.media_totale_positivi)}}</code>
          ({{parseInt((this.regionalAverage.regionalAverages[0].media_totale_positivi) / (this.regionalAverage.nationalAverage.media_totale_positivi)*100)}}% del valore nazionale)
        </h5>
        <h5>
          Media giornaliera totale guariti:
          <code>{{parseInt(this.regionalAverage.regionalAverages[0].media_dimessi_guariti)}}</code>
          /
          <code>{{parseInt(this.regionalAverage.nationalAverage.media_dimessi_guariti)}}</code>
          ({{parseInt((this.regionalAverage.regionalAverages[0].media_dimessi_guariti) / (this.regionalAverage.nationalAverage.media_dimessi_guariti)*100)}}% del valore nazionale)
        </h5>
        <h5>
          Media giornaliera totale deceduti:
          <code>{{parseInt(this.regionalAverage.regionalAverages[0].media_deceduti)}}</code>
          /
          <code>{{parseInt(this.regionalAverage.nationalAverage.media_deceduti)}}</code>
          ({{parseInt((this.regionalAverage.regionalAverages[0].media_deceduti) / (this.regionalAverage.nationalAverage.media_deceduti)*100)}}% del valore nazionale)
        </h5>
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
      regionalData: { docs: [] },
      singleRegionData: [],
      regionalAverage: null,
      page: 1,
      selectedRegion: null,
      data: "2020-05-22",
      from: "2020-05-22",
      to: "2020-05-22",
      tableFields: [
        {
          key: "denominazione_regione",
          sortable: true
        },
        {
          key: "data",
          sortable: true
        },
        {
          key: "isolamento_domiciliare",
          sortable: true
        },
        {
          key: "totale_positivi",
          sortable: true
        },
        {
          key: "variazione_totale_positivi",
          sortable: true
        },
        {
          key: "dimessi_guariti",
          sortable: true
        },
        {
          key: "deceduti",
          sortable: true
        },
        {
          key: "totale_casi",
          sortable: true
        },
        {
          key: "tamponi",
          sortable: true
        },
        {
          key: "casi_testati",
          sortable: true
        }
      ],
      regionTableFields: [
        { key: "data", sortable: true },
        { key: "isolamento_domiciliare", sortable: true },
        { key: "totale_positivi", sortable: true },
        { key: "variazione_totale_positivi", sortable: true },
        { key: "dimessi_guariti", sortable: true },
        { key: "deceduti", sortable: true },
        { key: "totale_casi", sortable: true },
        { key: "tamponi", sortable: true },
        { key: "casi_testati", sortable: true }
      ]
    };
  },
  components: {
    MainChartExample,
    RadarExample
  },
  mounted() {
    this.getRegionalData(1, this.data, this.data);
    this.drawMap();
  },
  computed: {
    labels() {
      return this.singleRegionData.map(e => {
        return moment(e.data).format("LL");
      });
      sin;
    },
    totalPositives() {
      return {
        label: "Totale Positivi",
        data: this.singleRegionData.map(e => {
          return e.totale_positivi;
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
        data: this.singleRegionData.map(e => {
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
        map: "it_regions_merc",
        onRegionClick: (element, code, region) => {
          console.log(element, code, region);
          this.getSingleRegionData(0, moment().format("YYYY-MM-DD"), code);
          this.getSingleRegionAvg(code);
          this.selectedRegion = code;
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
    async getRegionalData(page, from, to, regionCode, regionName) {
      this.regionalData = await this.$axios.$get(
        `/api/regional_data?page=${page}&from=${from}&to=${to}&codice_regione=${regionCode ||
          ""}`
      );
    },
    async getSingleRegionData(from, to, regionCode) {
      this.singleRegionData = await this.$axios.$get(
        `/api/regional_data/region/${regionCode}?from=${from}&to=${to}`
      );
    },
    async getSingleRegionAvg(regionCode) {
      this.regionalAverage = await this.$axios.$get(
        `/api/regional_data/avg?codice_regione=${regionCode}`
      );
    }
  }
};
</script>

<style>
</style>