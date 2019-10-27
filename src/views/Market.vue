<template>
  <div class="market">
    <h1>{{ $t("Market") }}</h1>

    <table>
      <thead>
        <th>{{ $t("Item") }}</th>
        <th>{{ $t("Price") }}</th>
        <th>{{ $t("Buy") }}</th>
      </thead>
      <tbody>
        <tr v-for="ask in asks" :key="ask.id">
          <td>
            {{ ask.uid }}
          </td>
          <td>
            {{ ask.price / 1e8 }}
          </td>
          <td>
            <button @click="buy(ask, index)">
              {{ $t("Buy") }}
            </button>
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

export default {
  name: "market",
  data: function() {
    return {
      asks: null
    };
  },
  async mounted() {
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
      const response = await MarketService.asks();
      this.asks = response;
    },
    buy(ask) {
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.fill_ask(this.loginUser, ask.id, (error, result) => {
        if (error === null && result.success) {
          this.price = null;
          this.placeholderSell = "Success";
        }
      });
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
