<template>
  <div class="user">
    <h1>{{ $t("User") }}</h1>
    <p>{{ $t("Current user") }}: {{ gameUser }}</p>
    <p>
      {{ $t("User") }}:
      <input
        v-model="user"
        @keyup.enter="setUser(user)"
        :placeholder="placeholder"
      >
      <button @click="setUser(user)">{{ $t("Set") }}</button>
    </p>
    <p>
      <button @click="setUser(loginUser)">Set myself</button>
    </p>
    <p>
      {{ $t("Language") }}:
      <select v-model="gameLanguage">
        <option value="en">{{ $t("English") }}</option>
        <option value="ko">{{ $t("Korean") }}</option>
      </select>
    </p>
  </div>
</template>

<script>
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import moment from "moment";
import { mapState } from "vuex";

export default {
  data: function() {
    return {
      user: null,
      placeholder: "Search",
      planetSearch: null
    };
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      planetId: state => state.planet.id
    }),
    gameUser: {
      get() {
        return this.$store.state.game.user;
      },
      set(value) {
        if (value === "") {
          value = null;
        }
        this.$store.dispatch("game/setUser", value);
      }
    },
    gameLanguage: {
      get() {
        return this.$store.state.game.language;
      },
      set(language) {
        this.$store.dispatch("game/setLanguage", language);
        this.$i18n.locale = language;

        this.$store.dispatch("ui/setLocale", language);
        moment.locale(language);

        //Refresh everything be calling page again
        window.location.href = "/user";
      }
    }
  },
  methods: {
    setUser(newUser) {
      this.fetchUser(newUser).then(searchedUser => {
        if (searchedUser !== null && searchedUser === newUser) {
          this.gameUser = newUser;
          this.placeholder = "Search";
          this.fetchStarterPlanet(newUser).then(planet => {
            this.$store.dispatch("planet/setId", planet.id);
            this.$store.dispatch("planet/setName", planet.name);
          });
        } else {
          this.placeholder = "not found";
          this.user = null;
        }
      });
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response.planets[0];
    }
  }
};
</script>

<style>
input {
  width: 20ch;
}
</style>
