<template>
  <div class="market">
    <h1>{{ $t("Market") }}</h1>
    <p>
      <select @change="setCategoryFilter(categoryFilter)" v-model="categoryFilter">
        <option value="all">{{ $t("Category: All") }}</option>
        <option value="ship">{{ $t("Ships") }}</option>
        <option value="item">{{ $t("Items") }}</option>
        <option value="planet">{{ $t("Planets") }}</option>
      </select>
      &nbsp;
      <select
        @change="setSubcategoryFilter(subcategoryFilter)"
        v-model="subcategoryFilter"
      >
        <option value="all">{{ $t("Subcategory: All") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="blueprint"
        >{{ $t("Blueprint") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="booster"
        >{{ $t("Rune") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="chest"
        >{{ $t("Chest") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="1"
        >{{ $t("Common") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="2"
        >{{ $t("Uncommon") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="3"
        >{{ $t("Rare") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="4"
        >{{ $t("Legendary") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="scout"
        >{{ $t("Scout") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="patrol"
        >{{ $t("Patrol") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="cutter"
        >{{ $t("Cutter") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="corvette"
        >{{ $t("Corvette") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="frigate"
        >{{ $t("Frigate") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="destroyer"
        >{{ $t("Destroyer") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="cruiser"
        >{{ $t("Cruiser") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="battlercruiser"
        >{{ $t("Battlecruiser") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="carrier"
        >{{ $t("Carrier") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="dreadnought"
        >{{ $t("Dreadnought") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="yamato"
        >{{ $t("Yamato") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="trasnporter"
        >{{ $t("Transporter") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="explorer"
        >{{ $t("Explorer") }}</option>
      </select>
      &nbsp;
      <select @change="setTypeFilter(typeFilter)" v-model="typeFilter">
        <option value="all">{{ $t("Type: All") }}</option>
        <option
          v-for="filter in contextMarketFilter"
          :key="filter.name"
          :value="filter.type"
        >{{ $t(filter.name) }}</option>
      </select>
      &nbsp;
      <input
        v-model="userFilter"
        @blur="setUserFilter(userFilter)"
        @keyup.enter="setUserFilter(userFilter)"
        :placeholder="$t('Filter User')"
      >
      &nbsp;
      <button @click="setUserFilter(gameUser)">{{ $t("Me") }}</button>
      &nbsp;
      <button @click="setUserFilter(null)">{{ $t("All") }}</button>
    </p>
    <table>
      <thead>
        <th>{{ $t("Category") }}</th>
        <th>{{ $t("Subcategory") }}</th>
        <th>{{ $t("Type") }}</th>
        <th>{{ $t("Location") }}</th>
        <th>{{ $t("Seller") }}</th>
        <th>{{ $t("Stardust") }}</th>
        <th>{{ $t("Buy") }}</th>
        <th>{{ $t("Cancel") }}</th>
      </thead>
      <tbody>
        <tr v-for="ask in asks" :key="ask.id">
          <td>{{ $t(ask.category) }}</td>
          <td>
            {{
            $t(
            ask.category == "item" || ask.category == "ship"
            ? ask.subcategory
            : "planet-bonus-" + ask.subcategory
            )
            }}
          </td>
          <td>
            {{
            $t(
            ask.category == "item" || ask.category == "ship"
            ? ask.type
            : "planet-type-" + ask.type
            )
            }}
          </td>
          <td>
            <span v-if="ask.category !== 'item'">
              <router-link
                :to="`/maps?x=${ask.cords_hor}&y=${ask.cords_ver}`"
              >{{ ask.cords_hor }} / {{ ask.cords_ver }}</router-link>
            </span>
            <span v-else>-</span>
          </td>
          <td>{{ ask.user }}</td>
          <td :style="{ color: '#72bcd4' }">
            {{
            Number(ask.price / 1e8).toLocaleString(gameLocale, {
            style: "decimal"
            })
            }}
          </td>
          <td>
            <span v-if="loginUser != ask.user && showBuyButton(ask)">
              <button :disabled="clicked.includes(ask.id)" @click="buy(ask)">{{ $t("Buy") }}</button>
            </span>
            <span v-else>-</span>
          </td>
          <td>
            <span v-if="loginUser == ask.user">
              <button :disabled="clicked.includes(ask.id)" @click="cancel(ask)">
                <cancel-icon :title="$t('Cancel')"/>
              </button>
            </span>
            <span v-else>-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import MarketService from "@/services/market";
import UserService from "@/services/user";
import { mapState } from "vuex";
import SteemConnectService from "@/services/steemconnect";
import CancelIcon from "vue-material-design-icons/Cancel.vue";
import marketFilter from "@/data/marketFilter.js";

export default {
  name: "market",
  components: {
    CancelIcon
  },
  data: function() {
    return {
      marketFilter: marketFilter,
      asks: null,
      clicked: [],
      stardust: null,
      userFilter: "",
      categoryFilter: "all",
      subcategoryFilter: "all",
      typeFilter: "all"
    };
  },
  async mounted() {
    this.clicked = [];
    await this.prepareComponent();
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      gameLocale: state => state.game.gameLocale
    }),
    contextMarketFilter() {
      let filter = this.marketFilter;
      if (this.categoryFilter != "all") {
        filter = filter.filter(item => {
          return item.category == this.categoryFilter;
        });
      }
      if (
        this.subcategoryFilter != "all" &&
        this.subcategoryFilter != "1" &&
        this.subcategoryFilter != "2" &&
        this.subcategoryFilter != "3" &&
        this.subcategoryFilter != "4"
      ) {
        filter = filter.filter(item => {
          return item.subcategory == this.subcategoryFilter;
        });
      }
      if (
        this.subcategoryFilter == "1" ||
        this.subcategoryFilter == "2" ||
        this.subcategoryFilter == "3" ||
        this.subcategoryFilter == "4"
      ) {
        filter = filter.filter(item => {
          return item.category == "planet" && item.subcategory == "all";
        });
      }
      return filter;
    }
  },
  methods: {
    async prepareComponent() {
      await this.getAsks();
      await this.getStardust();
      this.userFilter = null;
      await this.getMarketByFilter(this.categoryFilter, this.userFilter);
    },
    async getAsks() {
      const response = await MarketService.active();
      this.asks = response;
    },
    async getStardust() {
      const response = await UserService.get(this.gameUser);
      this.stardust = response.stardust;
    },
    buy(ask) {
      this.clicked.push(ask.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.fill_ask(this.loginUser, ask.id, (error, result) => {
        if (error === null && result.success) {
          null;
        }
      });
    },
    cancel(ask) {
      this.clicked.push(ask.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.cancel_ask(
        this.loginUser,
        ask.id,
        (error, result) => {
          if (error === null && result.success) {
            null;
          }
        }
      );
    },
    showBuyButton(ask) {
      if (ask.price <= this.stardust) {
        return true;
      } else {
        return false;
      }
    },
    async getMarketByFilter(
      categoryFilter = null,
      subcategoryFilter = null,
      typeFilter = null,
      userFilter = null
    ) {
      let category = null;
      let subcategory = null;
      let type = null;
      if (categoryFilter != "all") {
        category = categoryFilter;
      }
      if (subcategoryFilter != "all") {
        subcategory = subcategoryFilter;
      }
      if (typeFilter != "all") {
        type = typeFilter;
      }

      let response = await MarketService.byFilter(
        category,
        subcategory,
        type,
        userFilter
      );
      this.asks = response;
    },
    async setUserFilter(userFilter) {
      if (userFilter !== "") {
        this.userFilter = userFilter;
      } else {
        this.userFilter = null;
      }
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
        this.typeFilter,
        this.userFilter
      );
    },
    async setCategoryFilter(categoryFilter) {
      this.categoryFilter = categoryFilter;
      this.subcategoryFilter = "all";
      this.typeFilter = "all";
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
        this.typeFilter,
        this.userFilter
      );
    },
    async setSubcategoryFilter(subcategoryFilter) {
      this.subcategoryFilter = subcategoryFilter;
      // Reset type filter only for non planet bonus values
      if (
        subcategoryFilter != "1" &&
        subcategoryFilter != "2" &&
        subcategoryFilter != "3" &&
        subcategoryFilter != "4"
      ) {
        this.typeFilter = "all";
      }
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
        this.typeFilter,
        this.userFilter
      );
    },
    async setTypeFilter(typeFilter) {
      this.typeFilter = typeFilter;
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
        this.typeFilter,
        this.userFilter
      );
    }
  }
};
</script>

<style>
.activity .material-design-icon > .material-design-icon__svg {
  height: 1.5em;
  width: 1.5em;
}
</style>
