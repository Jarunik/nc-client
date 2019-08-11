<template>
  <span class="planetnav">
    <span v-if="!searchUser && loginUser !== null">
      <span @click="activateSearch()">{{ gameUser }} | </span>
    </span>
    <span v-show="searchUser"
      ><input
        ref="search"
        v-model="displayUser"
        @keyup.enter="setUser(displayUser)"
        :placeholder="placeholder"
      />
      |
    </span>

    <router-link :to="'/planets'">
      <earth-icon :title="$t('Planets')" />
    </router-link>
    <span v-for="planet in sortedPlanets" :key="planet.id">
      |
      <span v-if="planet.id === planetId"
        ><font color="green"
          ><span @click="setPlanet(planet)">
            {{ planet.name | shorten }}
          </span></font
        >
      </span>
      <span class="pointer" v-else @click="setPlanet(planet)">
        {{ planet.name | shorten }}
      </span>
    </span>
  </span>
</template>

<script>
import PlanetsService from "@/services/planets";
import UserService from "@/services/user";
import { mapState } from "vuex";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import * as types from "@/store/mutation-types";

export default {
  name: "planetnav",
  components: {
    EarthIcon
  },
  data: function() {
    return {
      planets: null,
      displayUser: null,
      searchUser: false,
      placeholder: "Enter User"
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
    }
  },
  methods: {
    async prepareComponent() {
      await this.getPlanets();
    },
    async getPlanets() {
      const response = await PlanetsService.byUser(this.gameUser);
      this.planets = response.planets;
      this.$store.dispatch("planet/setList", response.planets);
    },
    setPlanet(planet) {
      if (planet.id !== this.planetId) {
        this.$store.dispatch("planet/setId", planet.id);
        this.$store.dispatch("planet/setName", planet.name);
        this.$store.dispatch("planet/setPosX", planet.posx);
        this.$store.dispatch("planet/setPosY", planet.posy);
      }
    },
    resetPlanet() {
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
    },
    setUser(newUser) {
      this.fetchUser(newUser).then(searchedUser => {
        if (searchedUser !== null && searchedUser === newUser) {
          this.$store.dispatch("game/setUser", newUser);
          this.searchUser = false;
          this.fetchStarterPlanet(newUser).then(planet => {
            this.$store.dispatch("planet/setId", planet.id);
            this.$store.dispatch("planet/setName", planet.name);
            this.$store.dispatch("planet/setPosX", planet.posx);
            this.$store.dispatch("planet/setPosY", planet.posy);
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
<style>
.pointer {
  cursor: pointer;
}
</style>
