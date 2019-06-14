<template>
  <div class="production">
    <div v-if="production !== null">
    <h1>{{ $t("Production") }}</h1>
    <template
      v-if="gameUser !== 'null' && planetId !== 'null' && production !== null"
    >
      <table>
        <thead>
          <th></th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t("Daily Production") }}</td>
            <td>{{ production.coal.production }}</td>
            <td>{{ production.ore.production }}</td>
            <td>{{ production.copper.production }}</td>
            <td>{{ production.uranium.production }}</td>
          </tr>
          <tr>
            <td>{{ $t("Depot Size") }}</td>
            <td>{{ production.coal.depot }}</td>
            <td>{{ production.ore.depot }}</td>
            <td>{{ production.copper.depot }}</td>
            <td>{{ production.uranium.depot }}</td>
          </tr>
          <tr>
            <td>{{ $t("Safe") }}</td>
            <td>{{ production.coal.safe.toFixed(0) }}</td>
            <td>{{ production.ore.safe.toFixed(0) }}</td>
            <td>{{ production.copper.safe.toFixed(0) }}</td>
            <td>{{ production.uranium.safe.toFixed(0) }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="gameUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="planetId == 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/planets'">{{ $t("planet") }}</router-link>
        </p>
      </template>
    </template>
        </div>
    <div v-else>
      <Loading />
    </div>
  </div>
</template>

<script>
import ProductionService from "@/services/production";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import Loading from "@/components/Loading.vue";

export default {
  name: "production",
  components: {
    Loading
  },
  data: function() {
    return {
      production: null
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
      await this.getProduction();
      this.$store.subscribe(mutation => {
        switch (mutation.type) {
          case "planet/" + types.SET_PLANET_ID:
            this.prepareComponent();
        }
      });
    },
    async getProduction() {
      const response = await ProductionService.all(
        this.gameUser,
        this.planetId
      );
      this.production = response;
    }
  }
};
</script>
