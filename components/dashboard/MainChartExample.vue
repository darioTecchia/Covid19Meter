<script>
import { Line } from "vue-chartjs";

// const brandPrimary = '#20a8d8'
const brandSuccess = "#4dbd74";
const brandInfo = "#63c2de";
const brandDanger = "#f86c6b";

const chartOptions = {
  maintainAspectRatio: false,
  legend: {
    display: true
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: true
        }
      }
    ],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: 10000
          // max: 250
        },
        gridLines: {
          display: true
        }
      }
    ]
  },
  elements: {
    point: {
      radius: 3,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3
    }
  }
};

export default {
  extends: Line,
  props: ["height", "labels", "datasets"],
  watch: {
    datasets() {
      console.log(this);
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.datasets
        },
        chartOptions
      );
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: this.datasets
      },
      chartOptions
    );
  }
};
</script>
