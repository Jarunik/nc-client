<template>
  <div class="planets">
    <h1>{{ $t("Planets") }} - {{ gameUser }}</h1>
    <template v-if="gameUser !== null">
      <table>
        <thead>
          <th>{{ $t("Planet Identifier") }}</th>
          <th>{{ $t("Location") }}</th>
          <th>{{ $t("Name") }}</th>
          <th>{{ $t("Bonus") }}</th>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Rename") }}</th>
          <th>{{ $t("Sale") }}</th>
          <th>{{ $t("Ship") }}</th>
          <th>{{ $t("Sell") }}</th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Gift") }}</font>
          </th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Respawn") }}</font>
          </th>
          <th v-if="!giftingLock">
            <font color="red">{{ $t("Burn") }}</font>
          </th>
          <th>
            <font color="#72bcd4">{{ $t("SD") }}</font>
          </th>
          <th>{{ $t("Selected") }}</th>
        </thead>
        <tbody>
          <tr v-for="(planet, index) in sortedPlanets" :key="planet.id">
            <td :style="{ color: planet.for_sale == 1 ? 'grey' : 'white' }">
              {{ planet.id }}
            </td>
            <td :style="{ color: planet.for_sale == 1 ? 'grey' : 'white' }">
              {{ planet.posx }}/{{ planet.posy }}
            </td>
            <td :style="{ color: planet.for_sale == 1 ? 'grey' : 'white' }">
              {{ planet.name }}
            </td>
            <td :style="{ color: planet.for_sale == 1 ? 'grey' : 'white' }">
              {{ $t("planet-bonus-" + planet.bonus) }}
            </td>
            <td :style="{ color: planet.for_sale == 1 ? 'grey' : 'white' }">
              {{ $t("planet-type-" + planet.planet_type) }}
            </td>
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
              <span v-if="planet.for_sale == 1">
                <router-link :to="'/market'" v-tooltip="$t('Market')">
                  <store-icon :title="$t('Market')" />
                </router-link>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="shipForSale(planet)">
                <router-link :to="'/market'" v-tooltip="$t('Market')">
                  <store-icon :title="$t('Market')" />
                </router-link>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span
                v-if="
                  gameUser === loginUser &&
                    planet.for_sale != 1 &&
                    planet.starter == 0 &&
                    !shipForSale(planet)
                "
              >
                <button @click="toggleSell(planet)">...</button>
                <template v-if="planet.id !== null && showSell === planet.id">
                  <input
                    v-model.number="price"
                    @blur="validatePrice()"
                    :placeholder="$t(placeholderPrice)"
                  />
                  <button
                    :disabled="clicked.includes(planet.id)"
                    @click="sell(planet, price, index)"
                  >
                    {{ $t("Sell") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td v-if="!giftingLock">
              <span
                v-if="
                  gameUser === loginUser &&
                    planet.starter !== 1 &&
                    planet.for_sale != 1
                "
              >
                <button @click="toggleGifting(planet)">...</button>
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
              <span
                v-if="
                  gameUser === loginUser &&
                    planet.starter == 1 &&
                    planet.for_sale != 1
                "
              >
                <button @click="toggleGifting(planet)">...</button>
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
            <td v-if="!giftingLock">
              <span
                v-if="
                  gameUser === loginUser &&
                    planet.starter != 1 &&
                    planet.for_sale != 1
                "
              >
                <button @click="toggleBurn(planet)">...</button>
                <template v-if="planet.id !== null && showBurn === planet.id">
                  {{ $t("Really?") }}
                  <button
                    :disabled="clicked.includes(planet.id)"
                    @click="burnPlanet(planet, index)"
                  >
                    {{ $t("Burn") }}
                  </button>
                </template>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <font color="#72bcd4">
                {{
                  Number(
                    burnRate(planet.bonus, planet.planet_type) / 100000000
                  ).toLocaleString(gameLocale, { style: "decimal" })
                }}
              </font>
            </td>
            <td>
              <span v-if="planet.id === planetId">
                <earth-icon :title="$t('Home')" />
              </span>
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
              "Respawn costs 1000 Stardust in fees and it is only possible without active outgoing missions."
            )
          }}
        </p>
        <p>
          {{
            $t(
              "If you burn a (non-starter) planet with all ships on it then you will receive stardust for it."
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
          {{ $t("Gifting") }}/{{ $t("Respawn") }}/{{ $t("Burn") }}
        </button>
      </p>
      <h2>{{ $t("Fleet") }}</h2>
      <table>
        <thead>
          <th>{{ $t("Planet") }}</th>
          <th>{{ $t("Explorer") }}</th>
          <th>{{ $t("Transporter") }}</th>
          <th>{{ $t("Scout") }}</th>
          <th>{{ $t("Patrol") }}</th>
          <th>{{ $t("Cutter") }}</th>
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
              {{ pFleet.fleet.scout === 0 ? "-" : pFleet.fleet.scout }}
            </td>
            <td>
              {{ pFleet.fleet.patrol === 0 ? "-" : pFleet.fleet.patrol }}
            </td>
            <td>
              {{ pFleet.fleet.cutter === 0 ? "-" : pFleet.fleet.cutter }}
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
            <td>{{ pFleet.fleet.yamato === 0 ? "-" : pFleet.fleet.yamato }}</td>
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
              <span>
                {{
                  Number(Number(pQuantity.coal).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span
                :style="{
                  color: pQuantity.coal >= pQuantity.coaldepot ? 'red' : 'green'
                }"
              >
                {{
                  Number(Number(pQuantity.coaldepot).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span>
                {{
                  Number(Number(pQuantity.ore).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span
                :style="{
                  color: pQuantity.ore >= pQuantity.oredepot ? 'red' : 'green'
                }"
              >
                {{
                  Number(Number(pQuantity.oredepot).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span>
                {{
                  Number(Number(pQuantity.copper).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span
                :style="{
                  color:
                    pQuantity.copper >= pQuantity.copperdepot ? 'red' : 'green'
                }"
              >
                {{
                  Number(
                    Number(pQuantity.copperdepot).toFixed(0)
                  ).toLocaleString(gameLocale, {
                    style: "decimal"
                  })
                }}
              </span>
            </td>
            <td>
              <span>
                {{
                  Number(Number(pQuantity.uranium).toFixed(0)).toLocaleString(
                    gameLocale,
                    {
                      style: "decimal"
                    }
                  )
                }}
              </span>
            </td>
            <td>
              <span
                :style="{
                  color:
                    pQuantity.uranium >= pQuantity.uraniumdepot
                      ? 'red'
                      : 'green'
                }"
              >
                {{
                  Number(
                    Number(pQuantity.uraniumdepot).toFixed(0)
                  ).toLocaleString(gameLocale, {
                    style: "decimal"
                  })
                }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <p>{{ $t("Please set the") }} {{ $t("user") }}</p>
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
import * as types from "@/store/mutation-types";
import StoreIcon from "vue-material-design-icons/Store.vue";

export default {
  name: "planets",
  components: {
    EarthIcon,
    StoreIcon
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
      stardust: null,
      showBurn: null,
      burnRates: null,
      showSell: null,
      price: null,
      placeholderPrice: "enter SD price"
    };
  },
  async mounted() {
    this.clicked = [];
    this.chainResponse = [];
    await this.prepareComponent();
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "game/" + types.SET_GAME_USER:
          this.prepareComponent();
      }
    });
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      gameLocale: state => state.game.gameLocale
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
      if (this.$route.name == "planets") {
        await this.getPlanets();
        await this.getBurnRates();
        await this.getPlanetFleet();
        await this.getPlanetQuantities();
        await this.getStardust();
      }
    },
    async getStardust() {
      if (this.gameUser !== null) {
        const response = await UserService.get(this.gameUser);
        this.stardust = response.stardust;
      }
    },
    async getPlanets() {
      if (this.gameUser !== null) {
        const response = await PlanetsService.byUser(this.gameUser);
        this.planets = response.planets;
        this.$store.dispatch("planet/setList", response.planets);
      }
    },
    async getBurnRates() {
      const response = await PlanetsService.burnRates();
      this.burnRates = response;
    },
    async getPlanetFleet() {
      let planets = this.planets;
      if (planets !== null) {
        for (let i = 0; i < planets.length; i++) {
          let fleet = await this.getFleet(planets[i]);
          this.planetFleet.push(fleet);
        }
      }
    },
    async getPlanetQuantities() {
      let planets = this.planets;
      if (planets !== null) {
        for (let i = 0; i < planets.length; i++) {
          let qty = await this.getQuantities(planets[i]);
          this.planetQuantities.push(qty);
        }
      }
    },
    renamePlanet(planetId, newName) {
      this.clicked.push(planetId);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.renamePlanet(
        this.loginUser,
        planetId,
        newName,
        (error, result) => {
          if (error === null && result.success) {
            this.$store.dispatch("planet/setName", newName);
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
    toggleGifting(planet) {
      if (this.showGifting !== planet.id && this.stardust >= 100000000000) {
        this.showGifting = planet.id;
      } else {
        this.showGifting = null;
      }
    },
    toggleBurn(planet) {
      if (this.showBurn !== planet.id) {
        this.showBurn = planet.id;
      } else {
        this.showBurn = null;
      }
    },
    giftPlanet(planet, recipient) {
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
    respawnPlanet(planet) {
      this.clicked.push(planet.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.respawnPlanet(
        this.loginUser,
        planet.id,
        (error, result) => {
          if (error === null && result.success) {
            null;
          }
        }
      );
    },
    burnPlanet(planet) {
      this.clicked.push(planet.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.burnPlanet(
        this.loginUser,
        planet.id,
        (error, result) => {
          if (error === null && result.success) {
            null;
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
        scout: 0,
        patrol: 0,
        cutter: 0,
        corvette: 0,
        frigate: 0,
        destroyer: 0,
        cruiser: 0,
        battlecruiser: 0,
        carrier: 0,
        dreadnought: 0,
        yamato: 0,
        forSale: 0
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
        if (ship.type.startsWith("scout")) {
          planetFleet.fleet.scout++;
        }
        if (ship.type.startsWith("patrol")) {
          planetFleet.fleet.patrol++;
        }
        if (ship.type.startsWith("cutter")) {
          planetFleet.fleet.cutter++;
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
        if (ship.for_sale == 1) {
          planetFleet.fleet.forSale++;
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
      planetQuantities.coal = this.calculateQuantity(
        quantityResponse.coal,
        quantityResponse.coaldepot,
        quantityResponse.coalrate,
        quantityResponse.lastUpdate
      );
      planetQuantities.ore = this.calculateQuantity(
        quantityResponse.ore,
        quantityResponse.oredepot,
        quantityResponse.orerate,
        quantityResponse.lastUpdate
      );
      planetQuantities.copper = this.calculateQuantity(
        quantityResponse.copper,
        quantityResponse.copperdepot,
        quantityResponse.copperrate,
        quantityResponse.lastUpdate
      );
      planetQuantities.uranium = this.calculateQuantity(
        quantityResponse.uranium,
        quantityResponse.uraniumdepot,
        quantityResponse.uraniumrate,
        quantityResponse.lastUpdate
      );
      planetQuantities.coaldepot = quantityResponse.coaldepot;
      planetQuantities.oredepot = quantityResponse.oredepot;
      planetQuantities.copperdepot = quantityResponse.copperdepot;
      planetQuantities.uraniumdepot = quantityResponse.uraniumdepot;
      return planetQuantities;
    },
    burnRate(bonus, planetType) {
      if (this.burnRates !== null) {
        let rate = this.burnRates.filter(item => {
          return item.bonus == bonus && item.planet_type == planetType;
        });
        return rate[0].burnrate;
      } else {
        return 0;
      }
    },
    calculateQuantity(quantity, depot, rate, lastUpdate) {
      var startTime = this.moment.unix(parseInt(lastUpdate));
      var endTime = this.moment.utc();
      var duration = this.moment.duration(endTime.diff(startTime));
      var diff = duration.asDays();

      return Math.max(
        Math.min(
          parseFloat(quantity) + parseFloat(rate) * diff, // accumulation
          parseFloat(depot) // below depot
        ),
        parseFloat(quantity) // or overflow above depot
      ).toFixed(1);
    },
    sell(planet) {
      this.clicked.push(planet.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.ask(
        this.loginUser,
        "planet",
        planet.id,
        this.price,
        "null",
        (error, result) => {
          if (error === null && result.success) {
            this.price = null;
            this.placeholderPrice = "Success";
          }
        }
      );
    },
    toggleSell(planet) {
      if (this.showSell !== planet.id) {
        this.showSell = planet.id;
      } else {
        this.showSell = null;
      }
    },
    shipForSale(planet) {
      let forSale = false;
      this.planetFleet.forEach(planetFleet => {
        if (planetFleet.id == planet.id) {
          if (planetFleet.fleet.forSale > 0) {
            forSale = true;
          }
        }
      });
      return forSale;
    },
    validatePrice() {
      if (this.price < 0) {
        this.price = 0.000001;
      }
      if (this.price > 90000000000) {
        this.price = 90000000000;
      }
    }
  }
};
</script>
