<template>
  <div class="planets">
    <h1>{{ $t("Planets") }}</h1>
    <template v-if="user !== $store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
      </p>
    </template>
    <template v-if="user !== 'null'">
      <table>
        <thead>
          <th>{{ $t("Planet Identifier") }}</th>
          <th>{{ $t("Location") }}</th>
          <th>{{ $t("Name") }}</th>
          <th v-if="user === $store.state.game.loginUser">
            {{ $t("Rename") }}
          </th>
          <th>{{ $t("Context") }}</th>
        </thead>
        <tbody>
          <tr v-for="(planet, index) in planets" :key="planet.id">
            <td>{{ planet.id }}</td>
            <td>({{ planet.posx }}/{{ planet.posy }})</td>
            <td>{{ planet.name }}</td>
            <td v-if="user === $store.state.game.loginUser">
              <button @click="toggleRename(planet.id)">
                ...
              </button>
              <template v-if="showRename === planet.id">
                <input v-model="newName" :placeholder="$t(placeholderRename)" />
                <button @click="renamePlanet(planet.id, index)">
                  {{ $t("Send") }}
                </button>
              </template>
            </td>
            <td>
              <button @click="setPlanet(planet.id, planet.name)">
                {{ $t("Set") }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>
        {{ $t("Please set the") }}
        <router-link to="/user">{{ $t("user") }}</router-link>
      </p>
    </template>
  </div>
</template>

<script>
import PlanetsService from "@/services/planets";
import SteemConnectService from "@/services/steemconnect";

export default {
  name: "planets",
  props: ["user"],
  data: function() {
    return {
      planets: null,
      newName: null,
      showRename: null,
      placeholderRename: "enter new name"
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  methods: {
    async prepareComponent() {
      await this.getPlanets();
    },
    async getPlanets() {
      const response = await PlanetsService.byUser(this.user);
      this.planets = response.planets;
    },
    setPlanet(planetId, planetName) {
      if (planetId !== this.$store.state.planet.id) {
        this.$store.dispatch("planet/setId", planetId);
        this.$store.dispatch("planet/setName", planetName);
      } else {
        this.resetPlanet();
      }
    },
    resetPlanet() {
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
    },
    renamePlanet(planetId, index) {
      SteemConnectService.setAccessToken(this.$store.state.game.accessToken);
      SteemConnectService.renamePlanet(
        this.$store.state.game.loginUser,
        planetId,
        this.newName,
        (error, result) => {
          if (error === null) {
            this.planets[index].name = this.newName;
            this.$store.dispatch("planet/setName", this.newName);
            this.newName = null;
            this.placeholderRename = "Success";
          }
        }
      );
    },
    toggleRename(planetId) {
      if (this.showRename !== planetId) {
        this.showRename = planetId;
      } else {
        this.showRename = null;
      }
    }
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
