<template>
  <div class="market">
    <h1>{{ $t("Market") }}</h1>
    <p>
      <select
        @change="setCategoryFilter(categoryFilter)"
        v-model="categoryFilter"
      >
        <option value="all">{{ $t("All") }}</option>
        <option value="ship">{{ $t("Ship") }}</option>
        <option value="item">{{ $t("Item") }}</option>
        <option value="planet">{{ $t("planet") }}</option>
      </select>
      <select
        @change="setSubcategoryFilter(subcategoryFilter)"
        v-model="subcategoryFilter"
      >
        <option value="all">{{ $t("All") }}</option>
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="blueprint"
          >{{ $t("Blueprint") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="rune"
          >{{ $t("Rune") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'item'"
          value="chest"
          >{{ $t("Chest") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="common"
          >{{ $t("Common") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="uncommon"
          >{{ $t("Uncommon") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="rare"
          >{{ $t("Rare") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'planet'"
          value="legendary"
          >{{ $t("Legendary") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="scout"
          >{{ $t("Scout") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="patrol"
          >{{ $t("Patrol") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="cutter"
          >{{ $t("Cutter") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="corvette"
          >{{ $t("Corvette") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="frigate"
          >{{ $t("Frigate") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="destroyer"
          >{{ $t("Destroyer") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="cruiser"
          >{{ $t("Cruiser") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="battlercruiser"
          >{{ $t("Battlecruiser") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="carrier"
          >{{ $t("Carrier") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="dreadnought"
          >{{ $t("Dreadnought") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="yamato"
          >{{ $t("Yamato") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="trasnporter"
          >{{ $t("Transporter") }}</option
        >
        <option
          v-if="categoryFilter == 'all' || categoryFilter == 'ship'"
          value="explorer"
          >{{ $t("Explorer") }}</option
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
      <button @click="setUserFilter(null)">{{ $t("All") }}</button>
    </p>
    <table>
      <thead>
        <th>{{ $t("Category") }}</th>
        <th>{{ $t("Subcategory") }}</th>
        <th>{{ $t("Type") }}</th>
        <th>{{ $t("Location") }}</th>
        <th>{{ $t("Seller") }}</th>
        <th>{{ $t("Price") }}</th>
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
            <span v-if="ask.category !== 'item'"
              ><router-link :to="`/maps?x=${ask.cords_hor}&y=${ask.cords_ver}`"
                >{{ ask.cords_hor }} / {{ ask.cords_ver }}</router-link
              ></span
            >
            <span v-else>-</span>
          </td>
          <td>{{ ask.user }}</td>
          <td>
            {{
              Number(ask.price / 1e8).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
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
              <button :disabled="clicked.includes(ask.id)" @click="cancel(ask)">
                <cancel-icon :title="$t('Cancel')" />
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

export default {
  name: "market",
  components: {
    CancelIcon
  },
  data: function() {
    return {
      asks: null,
      clicked: [],
      stardust: null,
      userFilter: "",
      categoryFilter: "all",
      subcategoryFilter: "all"
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
    })
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
      userFilter = null
    ) {
      let category = null;
      let subcategory = null;
      if (categoryFilter != "all") {
        category = categoryFilter;
      }
      if (subcategoryFilter != "all") {
        subcategory = subcategoryFilter;
      }

      let response = await MarketService.byFilter(
        category,
        subcategory,
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
        this.userFilter
      );
    },
    async setCategoryFilter(categoryFilter) {
      this.categoryFilter = categoryFilter;
      this.subcategoryFilter = "all";
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
        this.userFilter
      );
    },
    async setSubcategoryFilter(subcategoryFilter) {
      this.subcategoryFilter = subcategoryFilter;
      await this.getMarketByFilter(
        this.categoryFilter,
        this.subcategoryFilter,
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
