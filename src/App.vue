<template>
  <div id="app">
    <span id="navtop">
      <span>
        <router-link to="/season" v-tooltip="$t('Season')">
          <timer-icon :title="$t('Season')" />
        </router-link>
        |
        <router-link to="/ranking" v-tooltip="$t('Ranking')">
          <chevron-triple-up-icon :title="$t('Ranking')" />
        </router-link>
        |
        <router-link to="/activity" v-tooltip="$t('Activity')">
          <newspaper-icon :title="$t('Activity')" />
        </router-link>
        |
        <router-link to="/battlefeed" v-tooltip="$t('Recent Battles')">
          <sword-cross-icon :title="$t('Recent Battles')" />
        </router-link>
        |
        <router-link :to="'/simulator'" v-tooltip="$t('Simulator')">
          <animation-play-icon :title="$t('Simulator')" />
        </router-link>
        |
        <router-link to="/shop" v-tooltip="$t('Shop')">
          <cart-icon :title="$t('Shop')" />
        </router-link>
        |
        <router-link :to="'/market'" v-tooltip="$t('Market')">
          <store-icon :title="$t('Market')" />
        </router-link>
        |
        <router-link :to="'/items'" v-tooltip="$t('Items')">
          <package-variant-closed-icon :title="$t('Items')" />
        </router-link>
        |
        <router-link :to="'/wallet'" v-tooltip="$t('Wallet')">
          <wallet-icon :title="$t('Wallet')" />
        </router-link>
        |
        <router-link :to="'/planets'" v-tooltip="$t('Planets')">
          <earth-icon :title="$t('Planets')" />
        </router-link>
        |
        <router-link to="/" v-tooltip="$t('Login')">
          <font v-if="loginUser == null" color="red">
            <login-icon :title="$t('Login')" />
          </font>
          <font v-else>
            <router-link to="/">
              <account-icon :title="$t('Login')" />
            </router-link>
          </font>
        </router-link>
        |
        <span
          v-if="!searchUser && (loginUser !== null || gameUser !== null)"
          v-tooltip="gameUser"
        >
          <span @click="activateSearch()">{{ gameUser.substring(0, 7) }}</span>
        </span>
        <span v-show="searchUser || gameUser === null" v-tooltip="gameUser">
          <input
            ref="search"
            v-model="displayUser"
            @keyup.enter="setUser(displayUser)"
            @blur="searchUser = false"
            :placeholder="placeholder"
          />
        </span>
      </span>
    </span>
    <div id="middle">
      <router-view />
    </div>
    <span id="navbottom">
      <router-link :to="'/production'" v-tooltip="$t('Production')">
        <cogs-icon :title="$t('Production')" />
      </router-link>
      |
      <router-link :to="'/skills'" v-tooltip="$t('Skills')">
        <school-icon :title="$t('Skills')" />
      </router-link>
      |
      <router-link :to="'/buildings'" v-tooltip="$t('Buildings')">
        <home-city-icon :title="$t('Buildings')" />
      </router-link>
      |
      <router-link :to="'/shipyard'" v-tooltip="$t('Shipyard')">
        <factory-icon :title="$t('Shipyard')" />
      </router-link>
      |
      <router-link :to="'/galaxy'" v-tooltip="$t('Galaxy')">
        <map-icon :title="$t('Galaxy')" />
      </router-link>
      |
      <router-link :to="'/fleet'" v-tooltip="$t('Fleet')">
        <ship-wheel-icon :title="$t('Fleet')" />
      </router-link>
      |
      <router-link :to="'/missions'" v-tooltip="$t('Missions')">
        <calendar-icon :title="$t('Mission')" />
      </router-link>
      |
      <PlanetNav :routeUser="gameUser" />
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
import PlanetNav from "@/components/PlanetNav.vue";
import PlanetsService from "@/services/planets";
import HomeCityIcon from "vue-material-design-icons/HomeCity.vue";
import SchoolIcon from "vue-material-design-icons/School.vue";
import CartIcon from "vue-material-design-icons/Cart.vue";
import PackageVariantClosedIcon from "vue-material-design-icons/PackageVariantClosed.vue";
import ChevronTripleUpIcon from "vue-material-design-icons/ChevronTripleUp.vue";
import ShipWheelIcon from "vue-material-design-icons/ShipWheel.vue";
import FactoryIcon from "vue-material-design-icons/Factory.vue";
import MapIcon from "vue-material-design-icons/Map.vue";
import CalendarIcon from "vue-material-design-icons/Calendar.vue";
import AccountIcon from "vue-material-design-icons/Account.vue";
import AnimationPlayIcon from "vue-material-design-icons/AnimationPlay.vue";
import SwordCrossIcon from "vue-material-design-icons/SwordCross.vue";
import NewspaperIcon from "vue-material-design-icons/Newspaper.vue";
import LoginIcon from "vue-material-design-icons/Login.vue";
import TimerIcon from "vue-material-design-icons/Timer.vue";
import StoreIcon from "vue-material-design-icons/Store.vue";
import CogsIcon from "vue-material-design-icons/Cogs.vue";
import WalletIcon from "vue-material-design-icons/Wallet.vue";
import UserService from "@/services/user";
import EarthIcon from "vue-material-design-icons/Earth.vue";

export default {
  name: "App",
  data: function() {
    return {
      displayUser: null,
      searchUser: false,
      placeholder: "Enter User"
    };
  },
  components: {
    PlanetNav,
    HomeCityIcon,
    SchoolIcon,
    CartIcon,
    PackageVariantClosedIcon,
    ChevronTripleUpIcon,
    ShipWheelIcon,
    FactoryIcon,
    MapIcon,
    CalendarIcon,
    AccountIcon,
    AnimationPlayIcon,
    SwordCrossIcon,
    NewspaperIcon,
    LoginIcon,
    TimerIcon,
    StoreIcon,
    CogsIcon,
    WalletIcon,
    EarthIcon
  },
  computed: {
    // Needed to set i18n.locale to change language
    ...mapGetters("game", ["language", "locale"]),
    loginUser: {
      get() {
        return this.$store.state.game.loginUser;
      },
      set(value) {
        this.$store.dispatch("game/setLoginUser", value);
      }
    },
    gameUser: {
      get() {
        return this.$store.state.game.user;
      },
      set(value) {
        this.$store.dispatch("game/setUser", value);
      }
    },
    planetName: {
      get() {
        return this.$store.state.planet.name;
      }
    },
    planetId: {
      get() {
        return this.$store.state.planet.id;
      }
    },
    planetPosX: {
      get() {
        return this.$store.state.planet.posX;
      }
    },
    planetPosY: {
      get() {
        return this.$store.state.planet.posY;
      }
    },
    mapsPlanets: {
      get() {
        return this.$store.state.maps.planets;
      }
    }
  },
  mounted() {
    // Check token expiry to automaticall logout
    var expiry = moment(
      JSON.parse(localStorage.getItem("gameExpiryDate")),
      moment.ISO_8601
    );
    if (moment.utc().isAfter(expiry) && this.loginUser !== null) {
      this.$store.dispatch("game/setLoginUser", null);
      this.$store.dispatch("game/setAccessToken", null);
      this.$store.dispatch("game/setExpiresIn", null);
      this.$store.dispatch("game/setExpiryDate", null);
      // Reset Defaults
      this.$store.dispatch("game/setUser", null);
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
      window.location.href = "/";
    }
  },
  methods: {
    setUser(newUser) {
      if (newUser != null && newUser != this.gameUser) {
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
          }
        });
      }
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
  },
  created() {
    // Initialize the store from local storage of browser
    var gameUser = localStorage.getItem("gameUser");
    if (gameUser !== "undefined") {
      this.$store.dispatch("game/setUser", JSON.parse(gameUser));
    }

    var gameLoginUser = localStorage.getItem("gameLoginUser");
    if (gameLoginUser !== "undefined") {
      this.$store.dispatch("game/setLoginUser", JSON.parse(gameLoginUser));
    }

    var gameAccessToken = localStorage.getItem("gameAccessToken");
    if (gameAccessToken !== "undefined") {
      this.$store.dispatch("game/setAccessToken", JSON.parse(gameAccessToken));
    }

    var gameExpiresIn = localStorage.getItem("gameExpiresIn");
    if (gameExpiresIn !== "undefined") {
      this.$store.dispatch("game/setExpiresIn", JSON.parse(gameExpiresIn));
    }

    var gameExpiryDate = localStorage.getItem("gameExpiryDate");
    if (gameExpiryDate !== "undefined") {
      this.$store.dispatch("game/setExpiryDate", JSON.parse(gameExpiryDate));
    }

    var planetId = localStorage.getItem("planetId");
    if (planetId !== "undefined") {
      this.$store.dispatch("planet/setId", JSON.parse(planetId));
    }

    var planetName = localStorage.getItem("planetName");
    if (planetName !== "undefined") {
      this.$store.dispatch("planet/setName", JSON.parse(planetName));
    }

    var planetPosX = localStorage.getItem("planetPosX");
    if (planetPosX !== "undefined") {
      this.$store.dispatch("planet/setPosX", JSON.parse(planetPosX));
    }

    var planetPosY = localStorage.getItem("planetPosY");
    if (planetPosY !== "undefined") {
      this.$store.dispatch("planet/setPosY", JSON.parse(planetPosY));
    }

    var planetList = localStorage.getItem("planetList");
    if (planetList !== "undefined") {
      this.$store.dispatch("planet/setList", JSON.parse(planetList));
    }

    var gameLanguage = localStorage.getItem("gameLanguage");
    if (gameLanguage !== "undefined") {
      this.$store.dispatch(
        "game/setLanguage",
        JSON.parse(gameLanguage) || "en"
      );
    }

    var gameLocale = localStorage.getItem("gameLocale");
    if (gameLocale !== "undefined") {
      this.$store.dispatch(
        "game/setLocale",
        JSON.parse(gameLocale) || navigator.language || "en"
      );
    }

    var mapsPlanets = localStorage.getItem("mapsPlanets");
    if (mapsPlanets !== "undefined") {
      this.$store.dispatch("maps/setPlanets", JSON.parse(mapsPlanets));
    }

    var lastUpdate = localStorage.getItem("lastUpdate");
    if (lastUpdate !== "undefined") {
      this.$store.dispatch("maps/setLastUpdate", JSON.parse(lastUpdate));
    }

    var fullUpdate = localStorage.getItem("fullUpdate");
    if (fullUpdate !== "undefined") {
      this.$store.dispatch("maps/setFullUpdate", JSON.parse(fullUpdate));
    }

    this.$i18n.locale = this.language;
    moment.locale(this.locale);
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
#navtop {
  padding: 10px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #100f1c;
  font-size: x-large;
  z-index: 100;
}

#middle {
  padding-top: 40px;
  padding-bottom: 200px;
}

#navbottom {
  padding: 10px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #100f1c;
  font-size: x-large;
  z-index: 100;
}

#navbottom select {
  font-size: large;
}
#navtop input {
  font-size: large;
}
body {
  background-image: url("./assets/background.jpg");
  background-repeat: repeat;
}
html {
  margin-left: calc(100vw - 100%);
}
a {
  color: white;
}
table {
  margin-left: auto;
  margin-right: auto;
}
td {
  padding-left: 4px;
  padding-right: 4px;
}
input {
  width: 15ch;
}

.pointer {
  cursor: pointer;
  text-decoration: underline;
}

.pointer-only {
  cursor: pointer;
}

.router-link-exact-active {
  color: green;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: black;
  color: white;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  border-radius: 16px;
  padding: 5px 10px 4px;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: black;
  z-index: 1;
}

.tooltip[x-placement^="top"] {
  margin-bottom: 5px;
}

.tooltip[x-placement^="top"] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="bottom"] {
  margin-top: 5px;
}

.tooltip[x-placement^="bottom"] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^="right"] {
  margin-left: 5px;
}

.tooltip[x-placement^="right"] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^="left"] {
  margin-right: 5px;
}

.tooltip[x-placement^="left"] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: black;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(black, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden="true"] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden="false"] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
