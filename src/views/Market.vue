<template>
  <div class="market">
    <h1>{{ $t("Market") }}</h1>
    <p>
      <span @click="setFilterDisplay('stacked')" class="pointer">
        <font v-if="filterDisplay === 'stacked'" color="green">
          {{ $t("Stacked") }}
        </font>
        <font v-else>{{ $t("Stacked") }}</font>
      </span>
      |
      <span @click="setFilterDisplay('all')" class="pointer">
        <font v-if="filterDisplay === 'all'" color="green">
          {{ $t("All") }}
        </font>
        <font v-else>{{ $t("All") }}</font>
      </span>
      |
      <span @click="setFilterDisplay('ship')" class="pointer">
        <font v-if="filterDisplay === 'ship'" color="green">
          {{ $t("Ship") }}
        </font>
        <font v-else>{{ $t("Ship") }}</font>
      </span>
      |
      <span @click="setFilterDisplay('item')" class="pointer">
        <font v-if="filterDisplay === 'item'" color="green">
          {{ $t("Item") }}
        </font>
        <font v-else>{{ $t("Item") }}</font>
      </span>
      |
      <span @click="setFilterDisplay('planet')" class="pointer">
        <font v-if="filterDisplay === 'planet'" color="green">
          {{ $t("Planet") }}
        </font>
        <font v-else>{{ $t("Planet") }}</font>
      </span>
      |
      <span @click="setFilterDisplay('history')" class="pointer">
        <font v-if="filterDisplay === 'history'" color="green">
          {{ $t("History") }}
        </font>
        <font v-else>{{ $t("History") }}</font>
      </span>
    </p>
    <p>
      <select
        @change="setCategoryFilter(categoryFilter)"
        v-model="categoryFilter"
      >
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
          >{{ $t("Blueprint") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="booster"
          >{{ $t("Rune") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="chest"
          >{{ $t("Chest") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="1"
          >{{ $t("Common") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="2"
          >{{ $t("Uncommon") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="3"
          >{{ $t("Rare") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="4"
          >{{ $t("Legendary") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Scout"
          >{{ $t("Scout") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Patrol"
          >{{ $t("Patrol") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Cutter"
          >{{ $t("Cutter") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Corvette"
          >{{ $t("Corvette") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Frigate"
          >{{ $t("Frigate") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Destroyer"
          >{{ $t("Destroyer") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Cruiser"
          >{{ $t("Cruiser") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Battlecruiser"
          >{{ $t("Battlecruiser") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Carrier"
          >{{ $t("Carrier") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Dreadnought"
          >{{ $t("Dreadnought") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Yamato"
          >{{ $t("Yamato") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Transporter"
          >{{ $t("Transporter") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="Explorer"
          >{{ $t("Explorer") }}</option
        >
      </select>
      &nbsp;
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
      <input
        v-model="userFilter"
        @blur="setUserFilter(userFilter)"
        @keyup.enter="setUserFilter(userFilter)"
        :placeholder="$t('Filter User')"
      />
      &nbsp;
      <button @click="setUserFilter(gameUser)">{{ $t("Me") }}</button>
      &nbsp;
      <button @click="setUserFilter('all')">{{ $t("All") }}</button>
      &nbsp;
      <button @click="reloadMarket()" :disabled="clickedReload">
        <reload-icon :title="$t('Reload')" />
      </button>
    </p>
    <table>
      <thead>
        <span v-if="filterDisplay == 'history'">
          <th>{{ $t("Sold") }}</th>
        </span>
        <th>{{ $t("Category") }}</th>
        <th>{{ $t("Subcategory") }}</th>
        <th>{{ $t("Type") }}</th>
        <th>{{ $t("Location") }}</th>
        <th>{{ $t("Seller") }}</th>
        <th>{{ $t("Stardust") }}</th>
        <span v-if="filterDisplay != 'history'">
          <th>{{ $t("Buy") }}</th>
          <th>{{ $t("Cancel") }}</th>
        </span>
      </thead>
      <tbody>
        <tr v-for="ask in asks" :key="ask.id">
          <td v-if="filterDisplay == 'history'">
            {{ moment.unix(ask.sold, "seconds").format("MMM D HH:mm") }}
          </td>
          <td>
            <span
              class="pointer-only"
              @click="setCategoryFilter(ask.category)"
              >{{ $t(ask.category) }}</span
            >
          </td>
          <td>
            <span
              class="pointer-only"
              @click="setSubcategoryFilter(ask.subcategory)"
            >
              {{
                $t(
                  ask.category == "item" || ask.category == "ship"
                    ? ask.subcategory
                    : "planet-bonus-" + ask.subcategory
                )
              }}
            </span>
          </td>
          <td>
            <span class="pointer-only" @click="setTypeFilter(ask.type)">
              {{
                $t(
                  ask.category == "item" || ask.category == "ship"
                    ? ask.type
                    : "planet-type-" + ask.type
                )
              }}
            </span>
          </td>
          <td>
            <span v-if="ask.category == 'planet'">
              <router-link :to="`/maps?x=${ask.cords_hor}&y=${ask.cords_ver}`"
                >{{ ask.cords_hor }}/{{ ask.cords_ver }}</router-link
              >
            </span>
            <span v-else>-</span>
          </td>
          <td>
            <span class="pointer-only" @click="setUserFilter(ask.user)">{{
              ask.user
            }}</span>
          </td>
          <td :style="{ color: '#72bcd4' }">
            {{
              Number(ask.price / 1e8).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
          <span v-if="filterDisplay != 'history'">
            <td>
              <span v-if="loginUser != ask.user && showBuyButton(ask)">
                <button :disabled="clicked.includes(ask.id)" @click="buy(ask)">
                  {{ $t("Buy") }}
                </button>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="loginUser == ask.user">
                <button
                  :disabled="clicked.includes(ask.id)"
                  @click="cancel(ask)"
                >
                  <cancel-icon :title="$t('Cancel')" />
                </button>
              </span>
              <span v-else>-</span>
            </td>
          </span>
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
import ReloadIcon from "vue-material-design-icons/Reload.vue";
import moment from "moment";

export default {
  name: "market",
  components: {
    CancelIcon,
    ReloadIcon
  },
  data: function() {
    return {
      marketFilter: marketFilter,
      asks: null,
      clicked: [],
      stardust: null,
      userFilter: "all",
      categoryFilter: "all",
      subcategoryFilter: "all",
      typeFilter: "all",
      filterDisplay: "all",
      clickedReload: false,
      nextReload: null,
      internval: null
    };
  },
  async mounted() {
    this.clicked = [];
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.now = moment.utc();
      if (this.nextReload != null && this.now.isAfter(this.nextReload)) {
        this.clickedReload = false;
      }
    }, 1000);
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
      this.userFilter = "all";
      await this.getMarketByFilter(this.categoryFilter, this.userFilter);
    },
    async getAsks() {
      const response = await MarketService.lowest();
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
    async reloadMarket() {
      this.clickedReload = true;
      this.nextReload = this.now.add(3, "seconds");
      if (this.filterDisplay == "stacked") {
        await this.getLowest();
      } else if (this.filterDisplay == "history") {
        await this.getHistory(
          this.categoryFilter,
          this.subcategoryFilter,
          this.typeFilter,
          this.userFilter
        );
      } else {
        await this.getMarketByFilter(
          this.categoryFilter,
          this.subcategoryFilter,
          this.typeFilter,
          this.userFilter
        );
      }
    },
    showBuyButton(ask) {
      if (ask.price <= this.stardust) {
        return true;
      } else {
        return false;
      }
    },
    async fetchFromApi() {
      if (this.filterDisplay == "stacked") {
        await this.getLowest();
      }
      if (
        this.filterDisplay == "all" ||
        this.filterDisplay == "ship" ||
        this.filterDisplay == "item" ||
        this.filterDisplay == "planet"
      ) {
        await this.getMarketByFilter(
          this.categoryFilter,
          this.subcategoryFilter,
          this.typeFilter,
          this.userFilter
        );
      }
      if (this.filterDisplay == "history") {
        await this.getHistory(
          this.categoryFilter,
          this.subcategoryFilter,
          this.typeFilter,
          this.userFilter
        );
      }
    },
    async getLowest() {
      let response = await MarketService.lowest();
      this.asks = response;
    },
    async getHistory(
      categoryFilter = null,
      subcategoryFilter = null,
      typeFilter = null,
      userFilter = null
    ) {
      let category = null;
      let subcategory = null;
      let type = null;
      let user = null;
      if (categoryFilter != "all") {
        category = categoryFilter;
      }
      if (subcategoryFilter != "all") {
        subcategory = subcategoryFilter;
      }
      if (typeFilter != "all") {
        type = typeFilter;
      }
      if (userFilter != "all") {
        user = userFilter;
      }
      let response = await MarketService.sold(
        category,
        subcategory,
        type,
        user
      );
      this.asks = response;
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
      let user = null;
      if (categoryFilter != "all") {
        category = categoryFilter;
      }
      if (subcategoryFilter != "all") {
        subcategory = subcategoryFilter;
      }
      if (typeFilter != "all") {
        type = typeFilter;
      }
      if (userFilter != "all") {
        user = userFilter;
      }

      let response = await MarketService.byFilter(
        category,
        subcategory,
        type,
        user
      );
      this.asks = response;
    },
    async setUserFilter(userFilter) {
      if (this.filterDisplay == "stacked") {
        this.filterDisplay = "all";
      }
      this.userFilter = userFilter;
      await this.fetchFromApi();
    },
    async setCategoryFilter(categoryFilter) {
      if (this.filterDisplay == "stacked") {
        this.filterDisplay = "all";
      }
      this.categoryFilter = categoryFilter;
      this.subcategoryFilter = "all";
      this.typeFilter = "all";
      await this.fetchFromApi();
    },
    async setSubcategoryFilter(subcategoryFilter) {
      if (this.filterDisplay == "stacked") {
        this.filterDisplay = "all";
      }
      this.subcategoryFilter = subcategoryFilter;
      this.typeFilter = "all";
      // Reset type filter only for non planet bonus values
      if (
        subcategoryFilter != "1" &&
        subcategoryFilter != "2" &&
        subcategoryFilter != "3" &&
        subcategoryFilter != "4"
      ) {
        this.typeFilter = "all";
      }
      await this.fetchFromApi();
    },
    async setTypeFilter(typeFilter) {
      if (this.filterDisplay == "stacked") {
        this.filterDisplay = "all";
      }
      this.typeFilter = typeFilter;
      await this.fetchFromApi();
    },
    async setFilterDisplay(filterDisplay) {
      this.filterDisplay = filterDisplay;
      // Defaults
      if (filterDisplay == "stacked") {
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = "all";
      }
      if (filterDisplay == "history") {
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = this.gameUser;
      }
      if (filterDisplay == "all") {
        this.categoryFilter = "all";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = "all";
      }
      if (filterDisplay == "ship") {
        this.categoryFilter = "ship";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = "all";
      }
      if (filterDisplay == "item") {
        this.categoryFilter = "item";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = "all";
      }
      if (filterDisplay == "planet") {
        this.categoryFilter = "planet";
        this.subcategoryFilter = "all";
        this.typeFilter = "all";
        this.userFilter = "all";
      }
      this.fetchFromApi();
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.activity .material-design-icon > .material-design-icon__svg {
  height: 1.5em;
  width: 1.5em;
}
</style>
