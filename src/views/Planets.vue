<template>
  <div class="planets">
    <h1>{{ $t("Planets") }}</h1>
    <template v-if="gameUser !== null">
      <table>
        <thead>
          <th>{{ $t("Planet Identifier") }}</th>
          <th>{{ $t("Location") }}</th>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Rename") }}</th>
          <th>{{ $t("Context") }}</th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Gift") }}</font>
          </th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Respawn") }}</font>
          </th>
          <th>{{ $t("Selected") }}</th>
        </thead>
        <tbody>
          <tr v-for="(planet, index) in sortedPlanets" :key="planet.id">
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
            <td v-if="!giftingLock">
              <span v-if="gameUser === loginUser && planet.starter == 1">
                <button @click="toggleGifting(planet.id)">...</button>
                <template
                  v-if="planet.id !== null && showGifting === planet.id"
                >
                  {{ $t("Really?") }}
                  <button
                    :disabled="clicked.includes(planet.id)"
                    @click="respawnPlanet(planet, index)"
                  >
                    {{ $t("Respawn") }}
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
              "On respawn you will lose the starter planet with all ships on it. You will get a new empty starter planet in a new location."
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
        <p>
          {{
            $t(
              "A planet transfer costs 1000 Stardust in fees and it is only possible without active outgoing missions."
            )
          }}
        </p>
      </font>
      <p>
        <button @click="toggleGiftingLock">
          {{ $t("Gifting") }}/{{ $t("Respawn") }}
        </button>
      </p>
      <h2>{{ $t("Fleet") }}</h2>
      <table>
        <thead>
          <th>{{ $t("Planet") }}</th>
          <th>{{ $t("Explorer") }}</th>
          <th>{{ $t("Transporter") }}</th>
          <th>{{ $t("Corvette") }}</th>
          <th>{{ $t("Frigate") }}</th>
          <th>{{ $t("Destroyer") }}</th>
          <th>{{ $t("Cruiser") }}</th>
          <th>{{ $t("Battlecruiser") }}</th>
          <th>{{ $t("Carrier") }}</th>
          <th>{{ $t("Dreadnought") }}</th>
          <th>{{ $t("Yamato") }}</th>
        </thead>
        <tbody>
          <tr v-for="pFleet in sortedPlanetFleet" :key="pFleet.id">
            <td>{{ pFleet.name }}</td>
            <td>
              {{
                pFleet.fleet.explorership === 0
                  ? "-"
                  : pFleet.fleet.explorership
              }}
            </td>
            <td>
              {{
                pFleet.fleet.transportship === 0
                  ? "-"
                  : pFleet.fleet.transportship
              }}
            </td>
            <td>
              {{ pFleet.fleet.corvette === 0 ? "-" : pFleet.fleet.corvette }}
            </td>
            <td>
              {{ pFleet.fleet.frigate === 0 ? "-" : pFleet.fleet.frigate }}
            </td>
            <td>
              {{ pFleet.fleet.destroyer === 0 ? "-" : pFleet.fleet.destroyer }}
            </td>
            <td>
              {{ pFleet.fleet.cruiser === 0 ? "-" : pFleet.fleet.cruiser }}
            </td>
            <td>
              {{
                pFleet.fleet.battlecruiser === 0
                  ? "-"
                  : pFleet.fleet.battlecruiser
              }}
            </td>
            <td>
              {{ pFleet.fleet.carrier === 0 ? "-" : pFleet.fleet.carrier }}
            </td>
            <td>
              {{
                pFleet.fleet.dreadnought === 0 ? "-" : pFleet.fleet.dreadnought
              }}
            </td>
            <td>
              {{ pFleet.fleet.yamato === 0 ? "-" : pFleet.fleet.yamato }}
            </td>
          </tr>
        </tbody>
      </table>
      <h2>{{ $t("Resources") }}</h2>
      <table>
        <thead>
          <th>{{ $t("Planet") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Depot") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Depot") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Depot") }}</th>
          <th>{{ $t("Uranium") }}</th>
          <th>{{ $t("Depot") }}</th>
        </thead>
        <tbody>
          <tr v-for="pQuantity in sortedPlanetQuantities" :key="pQuantity.id">
            <td>{{ pQuantity.name }}</td>
            <td>
              <span>{{ pQuantity.coal.toFixed(0) }}</span>
            </td>
            <td>
              <span
                :style="{
                  color: pQuantity.coal >= pQuantity.coaldepot ? 'red' : 'white'
                }"
                >{{ pQuantity.coaldepot.toFixed(0) }}</span
              >
            </td>
            <td>
              <span>{{ pQuantity.ore.toFixed(0) }}</span>
            </td>
            <td>
              <span
                :style="{
                  color: pQuantity.ore >= pQuantity.oredepot ? 'red' : 'white'
                }"
                >{{ pQuantity.oredepot.toFixed(0) }}</span
              >
            </td>
            <td>
              <span>{{ pQuantity.copper.toFixed(0) }}</span>
            </td>
            <td>
              <span
                :style="{
                  color:
                    pQuantity.copper >= pQuantity.copperdepot ? 'red' : 'white'
                }"
                >{{ pQuantity.copperdepot.toFixed(0) }}</span
              >
            </td>
            <td>
              <span>{{ pQuantity.uranium.toFixed(0) }}</span>
            </td>
            <td>
              <span
                :style="{
                  color:
                    pQuantity.uranium >= pQuantity.uraniumdepot
                      ? 'red'
                      : 'white'
                }"
                >{{ pQuantity.uraniumdepot.toFixed(0) }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>
        {{ $t("Please set a") }}
        <router-link to="/">{{ $t("user") }}</router-link>
      </p>
    </template>
  </div>
</template>

<script>
import PlanetsService from "@/services/planets";
import FleetService from "@/services/fleet";
import SteemConnectService from "@/services/steemconnect";
import UserService from "@/services/user";
import { mapState } from "vuex";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import QuantityService from "@/services/quantity";

export default {
  name: "planets",
  components: {
    EarthIcon
  },
  data: function() {
    return {
      planets: null,
      planetFleet: [],
      planetQuantities: [],
      newName: null,
      showRename: null,
      placeholderRename: "enter new name",
      giftingLock: true,
      showGifting: null,
      giftRecipient: null,
      placeholderGifting: "enter recipient",
      clicked: [],
      stardust: null
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
    }),
    sortedPlanets() {
      return this._.orderBy(this.planets, "name");
    },
    sortedPlanetFleet() {
      return this._.orderBy(this.planetFleet, "name");
    },
    sortedPlanetQuantities() {
      return this._.orderBy(this.planetQuantities, "name");
    }
  },
  methods: {
    async prepareComponent() {
      await this.getPlanets();
      await this.getPlanetFleet();
      await this.getPlanetQuantities();
      await this.getStardust();
    },
    async getStardust() {
      const response = await UserService.get(this.gameUser);
      this.stardust = response.stardust;
    },
    async getPlanets() {
      const response = await PlanetsService.byUser(this.gameUser);
      this.planets = response.planets;
      this.$store.dispatch("planet/setList", response.planets);
    },
    async getPlanetFleet() {
      let planets = this.planets;
      for (let i = 0; i < planets.length; i++) {
        let fleet = await this.getFleet(planets[i]);
        this.planetFleet.push(fleet);
      }
    },
    async getPlanetQuantities() {
      let planets = this.planets;
      for (let i = 0; i < planets.length; i++) {
        let qty = await this.getQuantities(planets[i]);
        this.planetQuantities.push(qty);
      }
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
      if (this.showGifting !== planetId && this.stardust > 100000000000) {
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
    respawnPlanet(planet, index) {
      this.clicked.push(planet.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.respawnPlanet(
        this.loginUser,
        planet.id,
        (error, result) => {
          if (error === null && result.success) {
            console.log(planet.id);
          }
        }
      );
    },
    async getFleet(planet) {
      let planetFleet = planet;
      let fleetResponse = null;
      planetFleet.fleet = {
        explorership: 0,
        transportship: 0,
        corvette: 0,
        frigate: 0,
        destroyer: 0,
        cruiser: 0,
        battlecruiser: 0,
        carrier: 0,
        dreadnought: 0,
        yamato: 0
      };
      const response = await FleetService.all(this.gameUser, planetFleet.id);
      fleetResponse = response;
      fleetResponse.forEach(ship => {
        if (ship.type.startsWith("explorership")) {
          planetFleet.fleet.explorership++;
        }
        if (ship.type.startsWith("transportship")) {
          planetFleet.fleet.transportship++;
        }
        if (ship.type.startsWith("corvette")) {
          planetFleet.fleet.corvette++;
        }
        if (ship.type.startsWith("frigate")) {
          planetFleet.fleet.frigate++;
        }
        if (ship.type.startsWith("destroyer")) {
          planetFleet.fleet.destroyer++;
        }
        if (ship.type.startsWith("cruiser")) {
          planetFleet.fleet.cruiser++;
        }
        if (ship.type.startsWith("battlecruiser")) {
          planetFleet.fleet.battlecruiser++;
        }
        if (ship.type.startsWith("carrier")) {
          planetFleet.fleet.carrier++;
        }
        if (ship.type.startsWith("dreadnought")) {
          planetFleet.fleet.dreadnought++;
        }
        if (ship.type.startsWith("yamato")) {
          planetFleet.fleet.yamato++;
        }
      });
      return planetFleet;
    },
    async fetchhUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async getQuantities(planet) {
      let planetQuantities = planet;
      let quantityResponse = null;
      planetQuantities.coal = 0;
      planetQuantities.ore = 0;
      planetQuantities.copper = 0;
      planetQuantities.uranium = 0;
      planetQuantities.coaldepot = 0;
      planetQuantities.oredepot = 0;
      planetQuantities.copperdepot = 0;
      planetQuantities.uraniumdepot = 0;
      const response = await QuantityService.get(planet.id);
      quantityResponse = response;
      planetQuantities.coal = quantityResponse.coal;
      planetQuantities.ore = quantityResponse.ore;
      planetQuantities.copper = quantityResponse.copper;
      planetQuantities.uranium = quantityResponse.uranium;
      planetQuantities.coaldepot = quantityResponse.coaldepot;
      planetQuantities.oredepot = quantityResponse.oredepot;
      planetQuantities.copperdepot = quantityResponse.copperdepot;
      planetQuantities.uraniumdepot = quantityResponse.uraniumdepot;
      return planetQuantities;
    }
  }
};
</script>
