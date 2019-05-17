<template>
  <div class="user">
    <h1>{{ $t("User") }}</h1>
    <p>User: {{ gameUser }}</p>
    <p>
      {{ $t("Change User") }}:
      <input
        v-model="user"
        @keyup.enter="setUser"
        :placeholder="placeholder"
      /><button @click="setUser">
        Set
      </button>
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

export default {
  data: function() {
    return {
      user: null,
      userSearch: null,
      placeholder: "Search",
      planetSearch: null
    };
  },
  computed: {
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
    setUser() {
      this.getUser().then(() => {
        if (
          this.userSearch !== null &&
          this.userSearch.username === this.user
        ) {
          this.gameUser = this.user;
          this.placeholder = "Search";
          this.getStarterPlanet(this.gameUser).then(() => {
            this.$store.dispatch("planet/setId", this.planetSearch.id);
            this.$store.dispatch("planet/setName", this.planetSearch.name);
          });
        } else {
          this.placeholder = "not found";
          this.user = null;
        }
      });
    },
    async getUser() {
      const response = await UserService.get(this.user);
      this.userSearch = response;
    },
    async getStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      this.planetSearch = response.planets[0];
    }
  }
};
</script>

<style>
input {
  width: 20ch;
}
</style>
