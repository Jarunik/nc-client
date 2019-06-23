<template>
  <div class="planets">
    <h1>{{ $t("Planets") }}</h1>
    <template v-if="gameUser !== 'null'">
      <table>
        <thead>
          <th>{{ $t("Planet Identifier") }}</th>
          <th>{{ $t("Location") }}</th>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Rename") }}</th>
          <th>{{ $t("Context") }}</th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Gift Planet") }}</font>
          </th>
          <th>{{ $t("Selected") }}</th>
        </thead>
        <tbody>
          <tr v-for="(planet, index) in planets" :key="planet.id">
            <td>{{ planet.id }}</td>
            <td>({{ planet.posx }}/{{ planet.posy }})</td>
            <td>{{ planet.name }}</td>
            <td>
              <span v-if="gameUser === loginUser">
                <button @click="toggleRename(planet.id)">...</button>
                <template v-if="planet.id !== null && showRename === planet.id">
                  <input
                    v-model="newName"
                    :placeholder="$t(placeholderRename)"
                  />
                  <button
                    :disabled="clicked.includes(planet.id)"
                    @click="renamePlanet(planet.id, newName, index)"
                  >
                    {{ $t("Send") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <button @click="setPlanet(planet)">{{ $t("Set") }}</button>
            </td>
            <td v-if="!giftingLock">
              <span v-if="gameUser === loginUser && planet.starter !== 1">
                <button @click="toggleGifting(planet.id)">...</button>
                <template
                  v-if="planet.id !== null && showGifting === planet.id"
                >
                  <input
                    v-model="giftRecipient"
                    :placeholder="$t(placeholderGifting)"
                  />
                  <button
                    :disabled="clicked.includes(planet.id)"
                    @click="giftPlanet(planet, giftRecipient, index)"
                  >
                    {{ $t("Send") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="planet.id === planetId"
                ><earth-icon :title="$t('Home')"
              /></span>
            </td>
          </tr>
        </tbody>
      </table>
      <font v-if="!giftingLock" color="red">
        <h2>
          <i>{{ $t("Danger Zone") }}</i>
        </h2>
        <p>
          {{
            $t(
              "Warning: You activated actions with potentially severe consequences."
            )
          }}
        </p>
        <p>
          {{
            $t(
              "Gifting will hand over ownership of your planet to someone else and you can't claim it back."
            )
          }}
        </p>
      </font>
      <p>
        <button @click="toggleGiftingLock">{{ $t("Gifting") }}</button>
      </p>
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
import UserService from "@/services/user";
import { mapState } from "vuex";
import EarthIcon from "vue-material-design-icons/Earth.vue";

export default {
  name: "planets",
  components: {
    EarthIcon
  },
  data: function() {
    return {
      planets: null,
      newName: null,
      showRename: null,
      placeholderRename: "enter new name",
      giftingLock: true,
      showGifting: null,
      giftRecipient: null,
      placeholderGifting: "enter recipient",
      clicked: []
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
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
      } else {
        this.resetPlanet();
      }
    },
    resetPlanet() {
      this.$store.dispatch("planet/setId", null);
      this.$store.dispatch("planet/setName", null);
      this.$store.dispatch("planet/setPosX", null);
      this.$store.dispatch("planet/setPosY", null);
    },
    renamePlanet(planetId, newName, index) {
      this.clicked.push(planetId);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.renamePlanet(
        this.loginUser,
        planetId,
        newName,
        (error, result) => {
          if (error === null && result.success) {
            this.planets[index].name = newName;
            this.$store.dispatch("planet/setName", newName);
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
    },
    toggleGiftingLock() {
      if (this.giftingLock) {
        this.giftingLock = false;
      } else {
        this.giftingLock = true;
      }
    },
    toggleGifting(planetId) {
      if (this.showGifting !== planetId) {
        this.showGifting = planetId;
      } else {
        this.showGifting = null;
      }
    },
    giftPlanet(planet, recipient, index) {
      this.fetchhUser(recipient).then(searchedUser => {
        if (searchedUser !== null && searchedUser === recipient) {
          this.clicked.push(planet.id);
          this.placeholder = "Search";
          SteemConnectService.setAccessToken(this.accessToken);
          SteemConnectService.giftPlanet(
            this.loginUser,
            planet.id,
            recipient,
            (error, result) => {
              if (error === null && result.success) {
                this.$store.dispatch("planet/setId", null);
                this.giftRecipient = null;
                this.planets[index].id = null;
                this.placeholderGifting = "Success";
              } else {
                this.placeholderGifting = "Broadcast error";
                this.giftRecipient = null;
              }
            }
          );
        } else {
          this.placeholderGifting = "User not found";
          this.giftRecipient = null;
        }
      });
    },
    async fetchhUser(user) {
      const response = await UserService.get(user);
      return response.username;
    }
  }
};
</script>
