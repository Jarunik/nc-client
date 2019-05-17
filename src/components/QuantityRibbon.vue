<template>
  <span v-if="planetId !== null">
    {{ coal }} {{ $t("C") }} | {{ ore }} {{ $t("Fe") }} | {{ copper }}
    {{ $t("Cu") }} | {{ uranium }} {{ $t("U") }} |
  </span>
</template>

<script>
import QuantityService from "@/services/quantity";
import moment from "moment";

export default {
  name: "quantityribbon",
  data: function() {
    return {
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null
    };
  },
  async mounted() {
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    }, 1000);
  },
  computed: {
    planetId: function() {
      return this.$store.state.planet.id;
    },
    planetName: function() {
      return this.$store.state.planet.name;
    },
    user: function() {
      return this.$store.state.game.user;
    }
  },
  watch: {
    async planetId(newValue, oldValue) {
      if (newValue != oldValue) {
        await this.getQuantity();
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getQuantity();
    },
    async getQuantity() {
      const response = await QuantityService.get(this.$store.state.planet.id);
      this.quantity = response;
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    },
    calculateQuantity(quantity, depot, rate, lastUpdate) {
      var startTime = moment.unix(parseInt(lastUpdate));
      var endTime = moment.utc();
      var duration = moment.duration(endTime.diff(startTime));
      var diff = duration.asDays();

      return Math.max(
        Math.min(
          parseFloat(quantity) + parseFloat(rate) * diff, // accumulation
          parseFloat(depot) // below depot
        ),
        parseFloat(quantity) // or overflow above depot
      ).toFixed(1);
    },
    calculateCoal() {
      if (this.quantity !== null && this.planetId !== null) {
        this.coal = this.calculateQuantity(
          this.quantity.coal,
          this.quantity.coaldepot,
          this.quantity.coalrate,
          this.quantity.lastUpdate
        );
      } else {
        this.coal = 0;
      }
    },
    calculateOre() {
      if (this.quantity !== null && this.planetId !== null) {
        this.ore = this.calculateQuantity(
          this.quantity.ore,
          this.quantity.oredepot,
          this.quantity.orerate,
          this.quantity.lastUpdate
        );
      } else {
        this.ore = 0;
      }
    },
    calculateCopper() {
      if (this.quantity !== null && this.planetId !== null) {
        this.copper = this.calculateQuantity(
          this.quantity.copper,
          this.quantity.copperdepot,
          this.quantity.copperrate,
          this.quantity.lastUpdate
        );
      } else {
        this.copper = 0;
      }
    },
    calculateUranium() {
      if (this.quantity !== null && this.planetId !== null) {
        this.uranium = this.calculateQuantity(
          this.quantity.uranium,
          this.quantity.uraniumdepot,
          this.quantity.uraniumrate,
          this.quantity.lastUpdate
        );
      } else {
        this.uranium = 0;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
