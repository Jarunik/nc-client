<template>
  <div class="market">
    <h1>{{ $t("Market") }}</h1>

    <table>
      <thead>
        <th>{{ $t("Category") }}</th>
        <th>{{ $t("Subcategory") }}</th>
        <th>{{ $t("Type") }}</th>
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
            {{
              ask.category == "planet"
                ? ask.cords_hor + "/" + ask.cords_ver
                : ""
            }}
          </td>
          <td>{{ ask.user }}</td>
          <td>
            {{ ask.price / 1e8 }}
          </td>
          <td>
            <span v-if="loginUser != ask.user">
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
      clicked: []
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
      planetName: state => state.planet.name
    })
  },
  methods: {
    async prepareComponent() {
      await this.getAsks();
    },
    async getAsks() {
      const response = await MarketService.active();
      this.asks = response;
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
