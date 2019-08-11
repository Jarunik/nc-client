<template>
  <span>
    <router-link :to="'/production'">
      <span v-if="planetId !== null && quantity != null">
        {{ coal }}
        <font v-if="quantity.coaldepot <= coal" color="red"
          ><alpha-c-box-icon :title="$t('Coal')"
        /></font>
        <font v-else><alpha-c-box-icon :title="$t('Coal')"/></font>

        {{ ore }}
        <font v-if="quantity.oredepot <= ore" color="red"
          ><alpha-f-box-icon :title="$t('Ore')"/><alpha-e-box-icon
            :title="$t('Ore')"/></font
        ><font v-else
          ><alpha-f-box-icon :title="$t('Ore')"/><alpha-e-box-icon
            :title="$t('Ore')"
        /></font>

        {{ copper }}
        <font v-if="quantity.copperdepot <= copper" color="red"
          ><alpha-c-box-icon :title="$t('Copper')"/><alpha-u-box-icon
            :title="$t('Copper')"
        /></font>
        <font v-else>
          <alpha-c-box-icon :title="$t('Copper')"/><alpha-u-box-icon
            :title="$t('Copper')"
        /></font>

        {{ uranium }}
        <font v-if="quantity.uraniumdepot <= uranium" color="red"
          ><alpha-u-box-icon :title="$t('Uranium')"
        /></font>
        <font v-else><alpha-u-box-icon :title="$t('Uranium')"/></font>
      </span>
    </router-link>
    <span v-if="user !== null && stardust !== undefined && stardust !== null">
      |
      <router-link :to="'/wallet'"
        >{{ Number(stardust / 100000000).toFixed(1) }}
        <alpha-s-box-icon :title="$t('Stardust')"/><alpha-d-box-icon
          :title="$t('Stardust')"/></router-link
    ></span>
  </span>
</template>

<script>
import QuantityService from "@/services/quantity";
import UserService from "@/services/user";
import moment from "moment";
import { mapState } from "vuex";
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";
import AlphaSBoxIcon from "vue-material-design-icons/AlphaSBox.vue";
import AlphaDBoxIcon from "vue-material-design-icons/AlphaDBox.vue";
import * as types from "@/store/mutation-types";

export default {
  name: "quantityribbon",
  components: {
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon,
    AlphaSBoxIcon,
    AlphaDBoxIcon
  },
  data: function() {
    return {
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      stardust: null
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
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "game/" + types.SET_GAME_USER:
          this.prepareComponent();
      }
    });
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.prepareComponent();
      }
    });
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
      await this.getStardust();
    },
    async getQuantity() {
      const response = await QuantityService.get(this.planetId);
      this.quantity = response;
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    },
    async getStardust() {
      const response = await UserService.get(this.user);
      this.stardust = response.stardust;
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
