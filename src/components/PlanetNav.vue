<template>
  <span class="planetnav">
    <span v-if="!searchUser && (loginUser !== null || gameUser !== null)" v-tooltip="$t('User')">
      <span @click="activateSearch()">{{ gameUser }} |</span>
    </span>
    <span v-show="searchUser || gameUser === null" v-tooltip="$t('User')">
      <input
        ref="search"
        v-model="displayUser"
        @keyup.enter="setUser(displayUser)"
        :placeholder="placeholder"
      >
      |
    </span>

    <router-link :to="'/planets'" v-tooltip="$t('Planets')">
      <earth-icon :title="$t('Planets')"/>
    </router-link>|
    <span @click="lastPlanet()" class="pointer">
      <arrow-left-circle-icon :title="$t('Last')"/>
    </span>
    |
    <select @change="setPlanet(planet)" v-model="planet">
      <option v-for="planet in sortedPlanets" :value="planet" :key="planet.id">{{ planet.name }}</option>
    </select>
    |
    <span @click="nextPlanet()" class="pointer">
      <arrow-right-circle-icon :title="$t('Next')"/>
    </span>
  </span>
</template>

<script>
import PlanetsService from "@/services/planets";
import UserService from "@/services/user";
import { mapState } from "vuex";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import * as types from "@/store/mutation-types";
import ArrowLeftCircleIcon from "vue-material-design-icons/ArrowLeftCircle.vue";
import ArrowRightCircleIcon from "vue-material-design-icons/ArrowRightCircle.vue";

export default {
  name: "planetnav",
  components: {
    EarthIcon,
    ArrowLeftCircleIcon,
    ArrowRightCircleIcon
  },
  data: function() {
    return {
      planets: null,
      displayUser: null,
      searchUser: false,
      placeholder: "Enter User",
      planet: null
    };
  },
  async mounted() {
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "game/" + types.SET_GAME_USER:
          this.prepareComponent();
      }
    });
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.prepareComponent();
      }
    });
    await this.prepareComponent();
  },
  filters: {
    shorten(name) {
      return name.substring(0, 2);
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id
    }),
    sortedPlanets() {
      if (this.planets != null) {
        var sortedPlanets = this.planets;
        var currentSortDir = "asc";
        var currentSort = "name";
        if (sortedPlanets !== null) {
          return sortedPlanets.sort((a, b) => {
            let modifier = 1;
            if (currentSortDir === "desc") modifier = -1;
            if (a[currentSort] === null) return -1 * modifier;
            if (b[currentSort] === null) return 1 * modifier;
            if (a[currentSort] < b[currentSort]) return -1 * modifier;
            if (a[currentSort] > b[currentSort]) return 1 * modifier;
            return 0;
          });
        } else {
          return sortedPlanets;
        }
      } else {
        return null;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getPlanets();
      if (this.planets != null) {
        this.$store.dispatch("planet/setList", this.planets);
      }
    },
    async getPlanets() {
      if (this.gameUser != null) {
        const response = await PlanetsService.byUser(this.gameUser);
        this.planets = response.planets;
      }
      if (this.planets != null) {
        this.planets.forEach(planet => {
          if (planet.id === this.planetId) {
            this.planet = planet;
          }
        });
      }
    },
    setPlanet(planet) {
      if (planet.id !== this.planetId) {
        this.$store.dispatch("planet/setId", planet.id);
        this.$store.dispatch("planet/setName", planet.name);
        this.$store.dispatch("planet/setPosX", planet.posx);
        this.$store.dispatch("planet/setPosY", planet.posy);
        this.planet = planet;
      }
    },
    resetPlanet() {
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
    },
    nextPlanet() {
      let newPlanet = null;
      if (this.planets != null) {
        for (let i = 0; i < this.planets.length; i++) {
          if (i !== 0 && this.planets[i - 1].id === this.planetId) {
            newPlanet = this.planets[i];
          }
        }
        if (newPlanet !== null) {
          this.setPlanet(newPlanet);
        }
      }
    },
    lastPlanet() {
      let newPlanet = null;
      if (this.planets != null) {
        for (let i = 0; i < this.planets.length; i++) {
          if (
            i < this.planets.length - 1 &&
            this.planets[i + 1].id === this.planetId
          ) {
            newPlanet = this.planets[i];
          }
        }
        if (newPlanet !== null) {
          this.setPlanet(newPlanet);
        }
      }
    },
    setUser(newUser) {
      this.fetchUser(newUser).then(searchedUser => {
        if (searchedUser !== null && searchedUser === newUser) {
          this.$store.dispatch("game/setUser", newUser);
          this.searchUser = false;
          this.fetchStarterPlanet(newUser).then(planet => {
            if (planet !== undefined && planet !== null) {
              this.$store.dispatch("planet/setId", planet.id);
              this.$store.dispatch("planet/setName", planet.name);
              this.$store.dispatch("planet/setPosX", planet.posx);
              this.$store.dispatch("planet/setPosY", planet.posy);
            }
          });
        } else {
          this.displayUser = this.loginUser;
        }
      });
    },
    activateSearch() {
      this.displayUser = null;
      this.searchUser = true;
      this.$nextTick(() => {
        this.$refs.search.focus();
      });
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response;
    }
  }
};
</script>
