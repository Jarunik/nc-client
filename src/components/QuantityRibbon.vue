<template>
  <span v-if="planetId !== null">
    {{ coal }} <alpha-c-box-icon :title="$t('Coal')" /> | {{ ore }}
    <alpha-f-box-icon :title="$t('Ore')" /><alpha-e-box-icon
      :title="$t('Ore')"
    />
    | {{ copper }} <alpha-c-box-icon :title="$t('Copper')" /><alpha-u-box-icon
      :title="$t('Copper')"
    />
    | {{ uranium }} <alpha-u-box-icon :title="$t('Uranium')" /> |
  </span>
</template>

<script>
import QuantityService from "@/services/quantity";
import moment from "moment";
import { mapState } from "vuex";
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";

export default {
  name: "quantityribbon",
  components: {
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon
  },
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
    ...mapState({
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      user: state => state.game.user
    })
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
      const response = await QuantityService.get(this.planetId);
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
