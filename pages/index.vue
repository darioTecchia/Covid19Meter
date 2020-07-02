<template>
  <div>
    <b-card v-if="nationalData.docs.length">
      <b-row>
        <b-col sm="5">
          <h4 id="traffic" class="card-title mb-0">Andamento nazionale</h4>
          <div
            class="small text-muted"
          >Dal {{nationalData.docs[0].data | formatDate('LL')}} al {{nationalData.docs[nationalData.docs.length-1].data | formatDate('LL')}}</div>
        </b-col>
        <b-col sm="7" class="d-none d-md-block">
          <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
            <b-button @click="getNationalData(1)" variant="primary" class="m-1">Ultimi dati</b-button>
            <b-button
              :disabled="!nationalData.hasPrevPage"
              @click="getNationalData(nationalData.prevPage)"
              variant="primary"
              class="m-1"
            >Date precedenti</b-button>
            <b-button
              :disabled="!nationalData.hasNextPage"
              @click="getNationalData(nationalData.nextPage)"
              variant="primary"
              class="m-1"
            >Date successive</b-button>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <main-chart-example
        :labels="labels"
        :datasets="[totalPositives]"
        class="chart-wrapper"
        style="height:300px;margin-top:40px;"
        height="300"
      ></main-chart-example>
      <div slot="footer">
        <b-col class="text-center mb-2" sm="12">
          <h4 id="traffic" class="card-title mb-0">Ultimi dati</h4>
          <div class="small text-muted">Aggiornati al: {{lastStats.data | formatDate('ll')}}</div>
        </b-col>
        <ul>
          <li>
            <div class="text-muted">Totale positivi</div>
            <strong>{{lastStats.totale_positivi}}</strong>
          </li>
          <li>
            <div class="text-muted">Tamponi</div>
            <strong>{{lastStats.tamponi}}</strong>
          </li>
          <li>
            <div class="text-muted">Casi testati</div>
            <strong>{{lastStats.casi_testati}}</strong>
          </li>
          <li>
            <div class="text-muted">Deceduti</div>
            <strong>{{lastStats.deceduti}}</strong>
          </li>
          <li>
            <div class="text-muted">Totale casi</div>
            <strong>{{lastStats.totale_casi}}</strong>
          </li>
        </ul>
      </div>
    </b-card>

    <b-card title="Tabella andamento" v-if="nationalData.docs.length">
      <b-col>
        <b-row>
          <b-button-toolbar class="float-right" aria-label="Toolbar with buttons group">
            <b-button @click="getNationalData(1)" variant="primary" class="m-1">Ultimi dati</b-button>
            <b-button
              :disabled="!nationalData.hasPrevPage"
              @click="getNationalData(nationalData.prevPage)"
              variant="primary"
              class="m-1"
            >Date precedenti</b-button>
            <b-button
              :disabled="!nationalData.hasNextPage"
              @click="getNationalData(nationalData.nextPage)"
              variant="primary"
              class="m-1"
            >Date successive</b-button>
          </b-button-toolbar>
        </b-row>
        <b-row>
          <b-table
            class
            hover
            :items="nationalData.docs"
            :fields="tableFields"
            head-variant="light"
          >
            <template v-slot:cell(data)="item">{{item.value | formatDate('ll')}}</template>
            <template v-slot:cell(variazione_totale_positivi)="item">
              <span :class="item.value > 0 ? 'text-danger' : 'text-success'">
                {{item.value}}
                <i v-if="item.value > 0" class="fa fa-angle-double-up"></i>
                <i v-else class="fa fa-angle-double-down"></i>
              </span>
            </template>
          </b-table>
        </b-row>
      </b-col>
    </b-card>
  </div>
</template>

<script>
import MainChartExample from "~/components/dashboard/MainChartExample";
import RadarExample from "~/components/charts/RadarExample";

const moment = require("moment-timezone");

const brandSuccess = "#4dbd74";
const brandInfo = "#63c2de";
const brandDanger = "#f86c6b";

export default {
  name: "dashboard",
  async asyncData({ $axios }) {
    const lastStats = await $axios.$get(`/api/national_data?page=1`);
    const average = await $axios.$get("/api/national_data/avg");
    return { average, lastStats: lastStats.docs[0] };
  },
  components: {
    MainChartExample,
    RadarExample
  },
  mounted() {
    this.getNationalData(1);
  },
  data() {
    return {
      nationalData: { docs: [] },
      page: 1,
      lastStats: {},
      tableFields: [
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
  computed: {
    labels() {
      return this.nationalData.docs.map(e => {
        return moment(e.data).format("LL");
      });
    },
    totalBuffers() {
      return {
        label: "Tamponi",
        data: this.nationalData.docs.map(e => {
          return e.tamponi;
        }),
        pointHoverBackgroundColor: "#fff",
        borderColor: brandSuccess,
        borderWidth: 2
      };
    },
    totalPositives() {
      return {
        label: "Totale Positivi",
        data: this.nationalData.docs.map(e => {
          return e.totale_positivi;
        }),
        backgroundColor: this.convertHex(brandInfo, 10),
        pointHoverBackgroundColor: "#fff",
        borderColor: brandInfo,
        borderWidth: 2
      };
    }
  },
  methods: {
    async getNationalData(page) {
      this.nationalData = await this.$axios.$get(
        `/api/national_data?page=${page}`
      );
    },
    convertHex(hex, opacity) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const result =
        "rgba(" + r + "," + g + "," + b + "," + opacity / 100 + ")";
      return result;
    }
  }
};
</script>