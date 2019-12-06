<template>
  <div class="ships">
    <h1>{{ $t("Ships") }} - {{ planetName }}</h1>
    <template v-if="gameUser != null">
      <p>
        <select @change="setTypeFilter(typeFilter)" v-model="typeFilter">
          <option value="all">{{ $t("Type: All") }}</option>
          <option
            v-for="filter in contextMarketFilter"
            :key="filter.name"
            :value="filter.type"
            >{{ $t(filter.name) }}</option
          >
        </select>
        &nbsp;
        {{ $t("Limit") }}:
        <input
          v-model="limit"
          @blur="setLimit(limit)"
          @keyup.enter="setLimit(limit)"
        />
      </p>
      <table>
        <thead>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Sale") }}</th>
          <th>{{ $t("Sell") }}</th>

          <th></th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedShips" :key="ship.id">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.for_sale }}</td>
            <td>
              <span v-if="gameUser === loginUser">
                <template v-if="ship.id !== null && ship.for_sale == 0">
                  <input
                    v-model.number="ship.price"
                    @blur="validatePrice(ship)"
                    :placeholder="$t(placeholderPrice)"
                  />
                  <button
                    :disabled="clicked.includes(ship.id)"
                    @click="sell(ship, ship.price)"
                  >
                    {{ $t("Sell") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="chainResponse.includes(ship.id)">
                <timer-sand-icon :title="$t('Transaction sent')" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>
        {{ $t("Please set the") }}
        {{ $t("user") }}
      </p>
    </template>
  </div>
</template>

<script>
import FleetService from "@/services/fleet";
import SteemConnectService from "@/services/steemconnect";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import marketFilter from "@/data/marketFilter.js";

export default {
  name: "ships",
  components: { TimerSandIcon },
  data: function() {
    return {
      ships: null,
      fleet: null,
      recipient: null,
      clicked: [],
      chainResponse: [],
      placeholderPrice: "enter SD price",
      marketFilter: marketFilter,
      typeFilter: "all",
      limit: 100
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.prepareComponent();
          this.clicked = [];
      }
    });
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name
    }),
    sortedShips() {
      let sortedShips = this.ships;
      sortedShips = this._.sortBy(sortedShips, [
        "for_sale",
        "shipyard_level",
        "type"
      ]);
      return sortedShips;
    },
    contextMarketFilter() {
      let filter = this.marketFilter;
      filter = filter.filter(item => {
        return item.category == "ship";
      });
      if (this.fleet != null) {
        filter = filter.filter(item => {
          let showShip = false;
          this.fleet.forEach(ship => {
            if (ship.type == item.type) {
              showShip = true;
            }
          });
          return showShip;
        });
      }
      return filter;
    }
  },
  methods: {
    async prepareComponent() {
      if (this.$route.name == "ships") {
        await this.getShips();
        await this.getFleet();
      }
    },
    async getShips() {
      const response = await FleetService.ships(this.gameUser, this.planetId);
      this.ships = response;
      this.ships.forEach(ship => {
        ship.price = null;
      });
    },
    async getFleet() {
      const response = await FleetService.grouped(this.gameUser, this.planetId);
      this.fleet = response;
    },
    sell(ship) {
      this.clicked.push(ship.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.ask(
        this.loginUser,
        "ship",
        ship.id,
        ship.price,
        "null",
        (error, result) => {
          if (error === null && result.success) {
            this.price = null;
            this.chainResponse.push(ship.id);
          }
        }
      );
    },
    validatePrice(ship) {
      if (ship.price < 0) {
        ship.price = 0.000001;
      }
      if (ship.price > 90000000000) {
        ship.price = 90000000000;
      }
      this.ships.forEach(s => {
        if (s.type == ship.type && !this.chainResponse.includes(s.id)) {
          s.price = ship.price;
        }
      });
    },
    async setTypeFilter(typeFilter) {
      this.typeFilter = typeFilter;
      await this.fetchFromApi();
    },
    async setLimit(limit) {
      this.limit = limit;
      await this.fetchFromApi();
    },
    async fetchFromApi() {
      let response = null;
      if (this.typeFilter == "all") {
        response = await FleetService.ships(
          this.gameUser,
          this.planetId,
          this.limit
        );
      } else {
        response = await FleetService.shipsByType(
          this.gameUser,
          this.planetId,
          this.typeFilter,
          this.limit
        );
      }
      this.ships = response;
      this.ships.forEach(ship => {
        ship.price = null;
      });
    }
  }
};
</script>
