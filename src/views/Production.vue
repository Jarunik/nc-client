<template>
  <div class="production">
    <h1>{{ $t("Production") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br />{{ $t("Planet: ") + routePlanet }}
        </template>
      </p>
    </template>
    <template
      v-if="
        routeUser !== 'null' && routePlanet !== 'null' && production !== null
      "
    >
      <table>
        <thead>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
        </thead>
        <tbody>
          <tr>
            <td>{{ $t("Depot Size") }}</td>
            <td>{{ production.coal.depot }}</td>
            <td>{{ production.ore.depot }}</td>
            <td>{{ production.copper.depot }}</td>
            <td>{{ production.uranium.depot }}</td>
          </tr>
          <tr>
            <td>{{ $t("Daily Production") }}</td>
            <td>{{ production.coal.production }}</td>
            <td>{{ production.ore.production }}</td>
            <td>{{ production.copper.production }}</td>
            <td>{{ production.uranium.production }}</td>
          </tr>
          <tr>
            <td>{{ $t("Mine Level") }}</td>
            <td>{{ production.coal.level }}</td>
            <td>{{ production.ore.level }}</td>
            <td>{{ production.copper.level }}</td>
            <td>{{ production.uranium.level }}</td>
          </tr>
          <tr>
            <td>{{ $t("Booster Level") }}</td>
            <td>{{ production.coal.booster }}</td>
            <td>{{ production.ore.booster }}</td>
            <td>{{ production.copper.booster }}</td>
            <td>{{ production.uranium.booster }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="routeUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="routePlanet == 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/' + routeUser + '/planets'">{{
            $t("planet")
          }}</router-link>
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import ProductionService from "@/services/production";
import { mapState } from "vuex";

export default {
  name: "production",
  props: ["routeUser", "routePlanet"],
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
    },
    async getProduction() {
      const response = await ProductionService.all(
        this.routeUser,
        this.routePlanet
      );
      this.production = response;
    }
  }
};
</script>
