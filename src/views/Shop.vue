<template>
  <div class="shop">
    <h1>{{ $t("Shop") }}</h1>
    <table>
      <thead>
        <th>{{ $t("Name") }}</th>
        <th>{{ $t("Details") }}</th>
        <th>{{ $t("Available") }}</th>
        <th>{{ $t("Price") }}</th>
      </thead>
      <tbody>
        <tr v-for="item in shop" :key="item.id">
          <td>{{ $t(item.name) }}</td>
          <td>
            <span v-if="item.coal !== null">
              {{ item.coal }} {{ $t("C") }} {{ item.ore }} {{ $t("Fe") }}
              {{ item.copper }} {{ $t("Cu") }} {{ item.uranium }} {{ $t("U") }}
            </span>
            <span v-if="item.booster !== null">
              {{ item.booster }} % {{ $t("Booster") }}</span
            >
            <span v-if="item.id.includes('blueprint')">
              {{ $t("Battleship Blueprint") }}</span
            >
          </td>
          <td>
            <span v-if="item.left < 0"> 0 / 0</span>
            <span v-else>{{ item.left }} / {{ item.total }}</span>
          </td>
          <td>
            <button v-if="item.left > 0" @click="buy(item)">
              {{ item.cost }} {{ $t("Steem") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ShopService from "@/services/shop";
import { mapState } from "vuex";

export default {
  name: "shop",
  data: function() {
    return {
      shop: null
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
      planetId: state => state.planet.id
    })
  },
  methods: {
    async prepareComponent() {
      await this.getShop();
    },
    async getShop() {
      const response = await ShopService.all();
      this.shop = response;
    },
    buy(item) {
      var url =
        "https://app.steemconnect.com/sign/transfer?to=nextcolony&amount=" +
        item.cost +
        "%20STEEM&memo=" +
        "nc" +
        "@{'type':'buy','command':{'user':'" +
        this.loginUser +
        "','itemid':'" +
        item.id +
        "','qty':'1'}}";
      window.open(url);
    }
  }
};
</script>
