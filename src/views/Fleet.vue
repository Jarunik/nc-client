<template>
  <div class="fleet">
    <h1>{{ $t("Fleet") }} - {{ planetName }}</h1>
    <template
      v-if="
        gameUser !== 'null' &&
          planetId != 'null' &&
          sortedFleet !== null &&
          sortedFleet.length > 0
      "
    >
      <p>
        {{ $t("Available Missions") }}: {{ availableMissions }} /
        {{ totalMissions }}
      </p>
      <!-- Commands -->
      <p>
        {{ $t("Command") }}
        <select @change="onCommand()" v-model="command">
          <option value="explorespace">{{ $t("Explore") }}</option>
          <option value="transport">{{ $t("Transport") }}</option>
          <option value="deploy">{{ $t("Deploy") }}</option>
          <option value="support">{{ $t("Support") }}</option>
          <option value="attack">{{ $t("Attack") }}</option>
          <option value="siege">{{ $t("Siege") }}</option>
          <option value="breaksiege">{{ $t("Break Siege") }}</option>
          <option value="upgradeyamato">{{ $t("Upgrade Yamato") }}</option>
          <option value="sent">{{ $t("Sent") }}</option>
        </select>
      </p>
      <!-- Ship List -->
      <table>
        <thead>
          <th @click="sort('longname')">{{ $t("Name") }}</th>
          <th @click="sort('speed')">{{ $t("Speed") }}</th>
          <th @click="sort('cons')">{{ $t("Use") }}</th>
          <th @click="sort('capacity')">{{ $t("Load") }}</th>
          <th @click="sort('quantity')">{{ $t("Quantity") }}</th>
          <th v-if="command !== null" @click="sort('toSend')">
            {{ $t("Send") }}
          </th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedFleet" :key="ship.longname">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.speed }}</td>
            <td>{{ ship.cons }}</td>
            <td>{{ ship.capacity }}</td>
            <td>{{ ship.quantity }}</td>
            <td v-if="command !== null">
              <input class="inputShort" type="number" v-model="ship.toSend" />
              <button @click="add(ship, ship.toSend)">{{ $t("+") }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Last Destination -->
      <p v-if="command === 'sent'">
        <span @click="openMap(lastX, lastY)"
          >{{ $t("Last Destination") }}:{{
            "(" + lastX + "/" + lastY + ")"
          }}</span
        >
      </p>
      <template v-if="command !== null && command !== 'sent'">
        <!-- Formation -->
        <table>
          <thead>
            <th>{{ $t("Position") }}</th>
            <th>{{ $t("Ship") }}</th>
            <th>{{ $t("Number") }}</th>
          </thead>
          <tbody>
            <tr v-for="ship in shipFormation.ships" :key="ship.id">
              <td>{{ ship.pos }}</td>
              <td>{{ $t(ship.name) }}</td>
              <td>{{ ship.n }}</td>
            </tr>
          </tbody>
        </table>
        <p>
          <button @click="resetShipFormation">{{ $t("Clear") }}</button>
        </p>
        <!-- Destination -->
        <template v-if="command !== 'upgradeyamato'">
          <p>
            <input
              class="inputMedium"
              v-on:change="fillCoordinates(search)"
              v-model="search"
              placeholder="(x/y)"
            />
            {{ $t("X") }}:
            <input
              class="inputShort"
              type="number"
              v-model="xCoordinate"
              v-on:change="onCoordinateChange"
            />
            {{ $t("Y") }}:
            <input
              class="inputShort"
              type="number"
              v-model="yCoordinate"
              v-on:change="onCoordinateChange"
            />
          </p>
        </template>
        <!-- Travel Information -->
        <template v-if="command !== 'upgradeyamato'">
          <table>
            <tr>
              <td>{{ $t("Distance") }}</td>
              <td>{{ Number(distance).toFixed(2) }}</td>
            </tr>
            <tr>
              <td>{{ $t("Uranium Fuel") }}</td>
              <td>
                <span
                  :style="{
                    color:
                      parseFloat(this.uranium - this.transportUranium) <
                      parseFloat(this.fuelConsumption)
                        ? 'red'
                        : 'white'
                  }"
                >
                  {{ Number(this.fuelConsumption).toFixed(4) }}</span
                >
              </td>
            </tr>
            <tr>
              <td>{{ $t("Outbound Travel") }}</td>
              <td>
                {{
                  moment.duration(parseFloat(travelTime), "hours").humanize()
                }}
              </td>
            </tr>
          </table>
        </template>

        <!-- Resources -->
        <div v-if="command === 'deploy' || command === 'transport'">
          <p>
            {{ $t("C") }}:
            <input
              class="inputMedium"
              type="number"
              v-model="transportCoal"
              v-on:change="onDeployResource('coal')"
            />
            {{ $t("Fe") }}:
            <input
              class="inputMedium"
              type="number"
              v-model="transportOre"
              v-on:change="onDeployResource('ore')"
            />
            {{ $t("Cu") }}:
            <input
              class="inputMedium"
              type="number"
              v-model="transportCopper"
              v-on:change="onDeployResource('copper')"
            />
            {{ $t("U") }}:
            <input
              class="inputMedium"
              type="number"
              v-model="transportUranium"
              v-on:change="onDeployResource('uranium')"
            />
          </p>
          <p>{{ $t("Capacity") }}: {{ capacity }}</p>
        </div>
        <!-- Costs -->
        <div v-if="command === 'upgradeyamato'">
          <p>
            {{ $t("Costs") }}:
            <font v-if="yamatoCoal > coal" color="red">
              {{ yamatoCoal }} <alpha-c-box-icon :title="$t('Coal')"/></font
            ><font v-else>
              {{ yamatoCoal }} <alpha-c-box-icon :title="$t('Coal')"
            /></font>
            <font v-if="yamatoOre > ore" color="red">
              {{ yamatoOre }}
              <alpha-f-box-icon :title="$t('Ore')"/><alpha-e-box-icon
                :title="$t('Ore')"/></font
            ><font v-else>
              {{ yamatoOre }}
              <alpha-f-box-icon :title="$t('Ore')"/><alpha-e-box-icon
                :title="$t('Ore')"
            /></font>
            <font v-if="yamatoCopper > copper" color="red">
              {{ yamatoCopper }}
              <alpha-c-box-icon :title="$t('Copper')"/><alpha-u-box-icon
                :title="$t('Copper')"/></font
            ><font v-else>
              {{ yamatoCopper }}
              <alpha-c-box-icon :title="$t('Copper')"/><alpha-u-box-icon
                :title="$t('Copper')"
            /></font>
            <font v-if="yamatoUranium > uranium" color="red">
              {{ yamatoUranium }} <alpha-u-box-icon :title="$t('Uranium')"
            /></font>
            <font v-else>
              {{ yamatoUranium }} <alpha-u-box-icon :title="$t('Uranium')"
            /></font>
            <font v-if="yamatoStardust > stardust" color="red">
              {{ yamatoStardust / 100000000 }}
              <alpha-s-box-icon :title="$t('Stardust')"/><alpha-d-box-icon
                :title="$t('Stardust')"
            /></font>
            <font v-else>
              {{ yamatoStardust / 100000000 }}
              <alpha-s-box-icon :title="$t('Stardust')"/><alpha-d-box-icon
                :title="$t('Stardust')"
            /></font>
          </p>
        </div>
        <!-- Send Transaction -->
        <div>
          <div v-if="this.loginUser === this.gameUser">
            <div v-if="command === 'deploy'">
              <button
                @click="deploy"
                :disabled="!commandEnabled('deploy') || clicked"
              >
                {{ $t("Deploy Ships") }}
              </button>
            </div>
            <div v-if="command === 'support'">
              <button
                @click="support"
                :disabled="!commandEnabled('support') || clicked"
              >
                {{ $t("Support Planet") }}
              </button>
            </div>
            <div v-if="command === 'attack'">
              <button
                @click="attack"
                :disabled="!commandEnabled('attack') || clicked"
              >
                {{ $t("Attack Planet") }}
              </button>
            </div>
            <div v-if="command === 'siege'">
              <button
                @click="siege"
                :disabled="!commandEnabled('siege') || clicked"
              >
                {{ $t("Siege Planet") }}
              </button>
            </div>
            <div v-if="command === 'breaksiege'">
              <button
                @click="breaksiege"
                :disabled="!commandEnabled('breaksiege') || clicked"
              >
                {{ $t("Break Siege") }}
              </button>
            </div>
            <div v-if="command === 'explorespace'">
              <button
                @click="explore"
                :disabled="!commandEnabled('explorespace') || clicked"
              >
                {{ $t("Send Explorer") }}
              </button>
            </div>
            <div v-if="command === 'transport'">
              <button
                @click="transport"
                :disabled="!commandEnabled('transport') || clicked"
              >
                {{ $t("Send Transporter") }}
              </button>
            </div>
            <div v-if="command === 'upgradeyamato'">
              <button
                @click="upgradeyamato"
                :disabled="!commandEnabled('upgradeyamato') || clicked"
              >
                {{ $t("Upgrade Yamato") }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </template>
    <!-- Not enough Context -->
    <template v-else>
      <template v-if="gameUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="planetId === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/planets'">{{ $t("planet") }}</router-link>
        </p>
      </template>
      <template v-if="gameUser !== 'null'">
        <p>
          {{ $t("You have no ships. Build some in the") }}
          <router-link :to="'/shipyard'">{{ $t("Shipyard") }}</router-link
          >.
        </p>
        <p>
          {{ $t("Available Missions") }}: {{ availableMissions }} /
          {{ totalMissions }}
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import FleetService from "@/services/fleet";
import QuantityService from "@/services/quantity";
import MissionsService from "@/services/missions";
import SkillsService from "@/services/skills";
import PlanetsService from "@/services/planets";
import ShipyardService from "@/services/shipyard";
import UserService from "@/services/user";
import { mapState } from "vuex";
import moment from "moment";
import SteemConnectService from "@/services/steemconnect";
import * as types from "@/store/mutation-types";
import AlphaCBoxIcon from "vue-material-design-icons/AlphaCBox.vue";
import AlphaFBoxIcon from "vue-material-design-icons/AlphaFBox.vue";
import AlphaEBoxIcon from "vue-material-design-icons/AlphaEBox.vue";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";
import AlphaSBoxIcon from "vue-material-design-icons/AlphaSBox.vue";
import AlphaDBoxIcon from "vue-material-design-icons/AlphaDBox.vue";

export default {
  name: "fleet",
  components: {
    AlphaCBoxIcon,
    AlphaFBoxIcon,
    AlphaEBoxIcon,
    AlphaUBoxIcon,
    AlphaSBoxIcon,
    AlphaDBoxIcon
  },
  data: function() {
    return {
      fleet: null,
      activeUserMissions: null,
      skills: null,
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      stardust: null,
      clicked: false,
      chainResponse: [],
      currentSort: "name",
      currentSortDir: "asc",
      command: null,
      xCoordinate: null,
      yCoordinate: null,
      transportCoal: 0,
      transportOre: 0,
      transportCopper: 0,
      transportUranium: 0,
      shipFormation: {},
      fuelConsumption: 0,
      slowestSpeed: null,
      pos: 0,
      search: null,
      availableMissions: 0,
      totalMissions: 0,
      capacity: 0,
      processing: false,
      lastX: null,
      lastY: null,
      yamatoCoal: 0,
      yamatoOre: 0,
      yamatoCopper: 0,
      yamatoUranium: 0,
      yamatoStardust: 0,
      buildYamato: false,
      activeYamatoMission: false
    };
  },
  async mounted() {
    this.clicked = false;
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    }, 1000);
    this.$store.subscribe(mutation => {
      switch (mutation.type) {
        case "planet/" + types.SET_PLANET_ID:
          this.prepareComponent();
          this.clicked = false;
      }
    });
  },
  filters: {
    busyPretty(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      var now = moment.utc();
      if (busy === 0) {
        return "-";
      } else {
        if (now.isAfter(busyUntil)) {
          return "-";
        } else {
          return moment.duration(now.diff(busyUntil)).humanize();
        }
      }
    },
    timePretty(time) {
      return moment.duration(parseInt(time), "seconds").humanize();
    }
  },
  computed: {
    ...mapState({
      loginUser: state => state.game.loginUser,
      accessToken: state => state.game.accessToken,
      gameUser: state => state.game.user,
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      planetPosX: state => state.planet.posX,
      planetPosY: state => state.planet.posY
    }),
    sortedFleet() {
      var sortedFleet = this.fleet;
      if (sortedFleet !== null) {
        return sortedFleet.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedFleet;
      }
    },
    distance() {
      var a = this.planetPosX - this.xCoordinate;
      var b = this.planetPosY - this.yCoordinate;

      return Math.sqrt(a * a + b * b);
    },
    travelTime() {
      return Number(this.distance / this.slowestSpeed).toFixed(2);
    }
  },
  methods: {
    async prepareComponent() {
      await this.getFleet();
      await this.getQuantity();
      await this.getMissions();
      await this.getSkills();
      await this.getStardust();
      await this.getShipyard();
      await this.calculateAvailableMissions();
      await this.calculateYamatoMission();
      await this.fillForm();
    },
    async getStardust() {
      const response = await UserService.get(this.gameUser);
      this.stardust = response.stardust;
    },
    async getShipyard() {
      const response = await ShipyardService.all(this.planetId);
      this.shipyard = response;
    },
    async fillForm() {
      if (
        this.$route.query.command !== undefined &&
        this.$route.query.command === "explorespace"
      ) {
        this.command = "explorespace";
      } else {
        return;
      }
      if (
        (this.$route.query.x !== undefined && this.$route.query.x !== null) &
        (this.$route.query.y !== undefined && this.$route.query.y !== null)
      ) {
        this.xCoordinate = this.$route.query.x;
        this.yCoordinate = this.$route.query.y;
        this.search =
          "(" + this.$route.query.x + "/" + this.$route.query.y + ")";
      }
      this.resetShipFormation();
      let addShip = null;
      this.sortedFleet.forEach(ship => {
        if (ship.type === "explorership") {
          addShip = ship;
        }
        if (ship.type === "explorership1") {
          addShip = ship;
        }
      });
      if (addShip !== null) {
        this.add(addShip, 1);
      }
    },
    async getMissions() {
      const response = await MissionsService.activeUser(this.gameUser);
      this.activeUserMissions = response;
    },
    async getSkills() {
      const response = await SkillsService.all(this.gameUser);
      this.skills = response;
    },
    async getFleet() {
      const response = await FleetService.all(this.gameUser, this.planetId);
      this.fleet = response;
      if (this.fleet !== null) {
        this.fleet.forEach(ship => {
          ship.quantity = 1;
          ship.toSend = 1;
        });
        this.fleet = this.fleet.reduce((acc, current) => {
          const x = acc.find(item => item.longname === current.longname);
          if (!x) {
            // add first found by name
            return acc.concat([current]);
          } else {
            acc.forEach(ship => {
              // count up the duplicates
              if (ship.longname === current.longname) {
                ship.quantity++;
              }
            });
            return acc;
          }
        }, []);
      }
    },
    isBusy(busy) {
      var busyUntil = moment(new Date(busy * 1000));
      var now = moment.utc();
      if (busyUntil === 0) {
        return false;
      } else {
        if (now.isAfter(busyUntil)) {
          return false;
        } else {
          return true;
        }
      }
    },
    onCommand() {
      this.clicked = false;
      if (
        (this.$route.query.x !== undefined && this.$route.query.x !== null) &
        (this.$route.query.y !== undefined && this.$route.query.y !== null)
      ) {
        this.xCoordinate = this.$route.query.x;
        this.yCoordinate = this.$route.query.y;
        this.search =
          "(" + this.$route.query.x + "/" + this.$route.query.y + ")";
      }
      this.resetShipFormation();
    },
    onDeployResource(res) {
      let sumTransport =
        parseFloat(this.transportCoal) +
        parseFloat(this.transportOre) +
        parseFloat(this.transportCopper) +
        parseFloat(this.transportUranium);
      if (sumTransport > this.capacity) {
        if (res === "coal") {
          this.transportCoal =
            this.transportCoal - (sumTransport - this.capacity);
        }
        if (res === "ore") {
          this.transportOre =
            this.transportOre - (sumTransport - this.capacity);
        }
        if (res === "copper") {
          this.transportCopper =
            this.transportCopper - (sumTransport - this.capacity);
        }
        if (res === "uranium") {
          this.transportUranium =
            this.transportUranium - (sumTransport - this.capacity);
        }
      }
    },
    calculateConsumption() {
      this.fuelConsumption = 0;
      for (var ship in this.shipFormation.ships) {
        if (this.shipFormation.ships[ship].n > 0) {
          this.fuelConsumption =
            this.fuelConsumption +
            this.shipFormation.ships[ship].n *
              this.shipFormation.ships[ship].c *
              this.distance;
        }
      }
    },
    onCoordinateChange() {
      this.calculateConsumption();
      this.search = "(" + this.xCoordinate + "/" + this.yCoordinate + ")";
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response;
    },
    calculateAvailableMissions() {
      let missionBudget = 0;
      if (this.skills !== null) {
        this.skills.forEach(skill => {
          if (skill.name === "missioncontrol") {
            missionBudget = skill.current * 2;
          }
        });
      }
      this.totalMissions = missionBudget;
      let runningMissions = 0;
      if (this.activeUserMissions !== null) {
        this.activeUserMissions.forEach(mission => {
          if (mission.user === this.gameUser) {
            runningMissions = runningMissions + 1;
          }
        });
      }
      this.fetchStarterPlanet(this.gameUser).then(planet => {
        if (this.planetId === planet.id) {
          missionBudget = missionBudget + 1;
          this.totalMissions = missionBudget;
          this.availableMissions = missionBudget - runningMissions;
        } else {
          this.availableMissions = missionBudget - runningMissions;
        }
      });
      this.totalMissions = missionBudget;
    },
    calculateYamatoMission() {
      this.activeYamatoMission = false;
      if (this.activeUserMissions !== null) {
        this.activeUserMissions.forEach(mission => {
          if (
            (mission.user === this.gameUser) &
            (mission.type === "upgradeyamato") &
            (mission.from_planet.id === this.planetId)
          ) {
            this.activeYamatoMission = true;
          }
        });
      }
    },
    commandEnabled(command) {
      let enabled = false;
      if (
        this.command === "transport" ||
        this.command === "attack" ||
        this.command === "deploy" ||
        this.command === "support" ||
        this.command === "explorespace" ||
        this.command === "siege" ||
        this.command === "breaksiege"
      ) {
        if (
          this.command !== null &&
          this.command === command &&
          this.xCoordinate !== null &&
          this.xCoordinate !== "" &&
          this.yCoordinate !== null &&
          this.yCoordinate !== "" &&
          this.shipFormation.count > 0 &&
          parseFloat(this.uranium - this.transportUranium) >
            parseFloat(this.fuelConsumption) &&
          this.availableMissions > 0 &&
          this.loginUser === this.gameUser
        ) {
          if (command === "transport") {
            if (
              parseFloat(this.coal) > parseFloat(this.transportCoal) &&
              parseFloat(this.ore) > parseFloat(this.transportOre) &&
              parseFloat(this.copper) > parseFloat(this.transportCopper) &&
              parseFloat(this.uranium) >
                parseFloat(this.transportUranium) +
                  parseFloat(this.fuelConsumption)
            ) {
              enabled = true;
            } else {
              enabled = false;
            }
          } else if (command === "explorespace") {
            if (
              parseFloat(this.uranium) >
                parseFloat(this.transportUranium) +
                  parseFloat(this.fuelConsumption) &&
              this.shipFormation.count === 1 &&
              this.shipFormation.ships[0].n === 1 &&
              this.shipFormation.ships[0].type.includes("explore")
            ) {
              enabled = true;
            } else {
              enabled = false;
            }
          } else {
            enabled = true;
          }
        }
      }
      if (this.command === "upgradeyamato") {
        if (
          this.shipFormation.count === 1 &&
          this.shipFormation.ships[0].n === 1 &&
          (typeof this.shipFormation.ships[0].type != "undefined" &&
            this.shipFormation.ships[0].type.includes("yamato")) &&
          this.shipFormation.ships[0].type != "yamato20" &&
          this.coal >= this.yamatoCoal &&
          this.ore >= this.yamatoOre &&
          this.copper >= this.yamatoCopper &&
          this.uranium >= this.yamatoUranium &&
          this.stardust >= this.yamatoStardust &&
          this.buildYamato &&
          !this.activeYamatoMission &&
          this.loginUser === this.gameUser
        ) {
          enabled = true;
        } else {
          enabled = false;
        }
      }
      return enabled;
    },
    searchLongName(key) {
      for (var i = 0; i < this.sortedFleet.length; i++) {
        if (this.sortedFleet[i].type === key) {
          return this.sortedFleet[i].longname;
        }
      }
    },
    resetShipFormation() {
      this.pos = 0;
      this.slowestSpeed = null;
      this.capacity = 0;
      this.transportCoal = 0;
      this.transportOre = 0;
      this.transportCopper = 0;
      this.transportUranium = 0;
      this.yamatoCoal = 0;
      this.yamatoOre = 0;
      this.yamatoCopper = 0;
      this.yamatoUranium = 0;
      this.yamatoStardust = 0;
      this.buildYamato = false;
      this.fuelConsumption = 0;

      this.shipFormation = {
        count: 0,
        ships: [
          { id: 1, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 2, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 3, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 4, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 5, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 6, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 7, type: null, n: "-", c: 0, pos: "-", name: "-" },
          { id: 8, type: null, n: "-", c: 0, pos: "-", name: "-" }
        ]
      };
      this.fleet.forEach(ship => {
        ship.toSend = 1;
      });
    },
    add(ship, quantity) {
      let existingGroup = false;
      if (this.command === null || this.command === "Sent") {
        return;
      }
      // There are only 8 slots
      if (this.pos > 8) {
        return;
      }
      // Recalculate Slowest
      if (this.slowestSpeed === null) {
        this.slowestSpeed = ship.speed;
      }
      if (ship.speed < this.slowestSpeed) {
        this.slowestSpeed = ship.speed;
      }
      // Replace existing
      this.shipFormation.ships.forEach(s => {
        if (s.type === ship.type) {
          // Remove old Capacity
          this.capacity = this.capacity - s.n * ship.capacity;
          s.n = Math.min(quantity, ship.quantity);
          s.c = ship.cons;
          s.pos = this.pos;
          s.type = ship.type;
          s.name = ship.longname;
          // Add new Capacity
          this.capacity = this.capacity + s.n * ship.capacity;
          existingGroup = true;
        }
      });
      // Add a new one
      if (!existingGroup) {
        this.shipFormation.count = this.shipFormation.count + 1;
        this.shipFormation.ships[this.pos].n = Math.max(
          Math.min(quantity, ship.quantity),
          1
        );
        this.shipFormation.ships[this.pos].c = ship.cons;
        this.shipFormation.ships[this.pos].pos = this.pos + 1;
        this.shipFormation.ships[this.pos].type = ship.type;
        this.shipFormation.ships[this.pos].name = ship.longname;
        this.capacity =
          this.capacity + this.shipFormation.ships[this.pos].n * ship.capacity;
        this.pos++;
      }
      this.calculateYamatoCosts();
      this.calculateConsumption();
    },
    calculateYamatoCosts() {
      this.yamatoCoal = 0;
      this.yamatoOre = 0;
      this.yamatoCopper = 0;
      this.yamatoUranium = 0;
      this.yamatoStardust = 0;
      this.buildYamato = false;
      this.shipFormation.ships.forEach(ship => {
        if (
          typeof ship.type !== "undefined" &&
          ship.type !== null &&
          ship.type.includes("yamato")
        ) {
          let upgradeTo =
            "yamato" + (Number(ship.type.replace("yamato", "")) + 1);
          let shipCost = this.shipyard.find(obj => {
            return obj.type === upgradeTo;
          });
          if (typeof shipCost !== "undefined") {
            this.yamatoCoal = shipCost.cost.coal;
            this.yamatoOre = shipCost.cost.ore;
            this.yamatoCopper = shipCost.cost.copper;
            this.yamatoUranium = shipCost.cost.uranium;
            this.yamatoStardust = shipCost.cost.stardust;
            this.buildYamato = shipCost.cur_level >= shipCost.min_level;
          }
        }
      });
    },
    openMap(x, y) {
      this.$router.push({ path: "galaxy", query: { x: x, y: y } });
    },
    fillCoordinates(search) {
      let split = search
        .replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "")
        .split("/");
      this.xCoordinate = split[0];
      this.yCoordinate = split[1];
    },
    async getQuantity() {
      const response = await QuantityService.get(this.planetId);
      this.quantity = response;
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    },
    calculateQuantity(quantity, depot, rate, lastUpdate) {
      var startTime = moment.unix(parseInt(lastUpdate));
      var endTime = moment.utc();
      var duration = moment.duration(endTime.diff(startTime));
      var diff = duration.asDays();

      return Math.max(
        Math.min(
          parseFloat(quantity) + parseFloat(rate) * diff, // accumulation
          parseFloat(depot) // below depot
        ),
        parseFloat(quantity) // or overflow above depot
      ).toFixed(1);
    },
    calculateCoal() {
      if (this.quantity !== null) {
        this.coal = this.calculateQuantity(
          this.quantity.coal,
          this.quantity.coaldepot,
          this.quantity.coalrate,
          this.quantity.lastUpdate
        );
      } else {
        this.coal = 0;
      }
    },
    calculateOre() {
      if (this.quantity !== null) {
        this.ore = this.calculateQuantity(
          this.quantity.ore,
          this.quantity.oredepot,
          this.quantity.orerate,
          this.quantity.lastUpdate
        );
      } else {
        this.ore = 0;
      }
    },
    calculateCopper() {
      if (this.quantity !== null) {
        this.copper = this.calculateQuantity(
          this.quantity.copper,
          this.quantity.copperdepot,
          this.quantity.copperrate,
          this.quantity.lastUpdate
        );
      } else {
        this.copper = 0;
      }
    },
    calculateUranium() {
      if (this.quantity !== null) {
        this.uranium = this.calculateQuantity(
          this.quantity.uranium,
          this.quantity.uraniumdepot,
          this.quantity.uraniumrate,
          this.quantity.lastUpdate
        );
      } else {
        this.uranium = 0;
      }
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    callbackHandling(self) {
      // Only do it once
      if (self.processing) {
        if (self.command === "upgradeyamato") {
          this.activeYamatoMission = true;
        }
        self.command = "sent";
        self.lastX = self.xCoordinate;
        self.lastY = self.yCoordinate;
        self.xCoordinate = null;
        self.yCoordinate = null;
        self.processing = false;
        self.transportCoal = 0;
        self.transportOre = 0;
        self.transportCopper = 0;
        self.transportUranium = 0;
        self.capacity = 0;
      }
    },
    explore() {
      let self = this;
      self.processing = true;
      self.clicked = true;
      SteemConnectService.setAccessToken(self.accessToken);
      SteemConnectService.explorespace(
        self.loginUser,
        self.planetId,
        self.xCoordinate,
        self.yCoordinate,
        self.shipFormation.ships[0].type,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    // shipList = { "transportship": 2, "explorership": 1 }
    transport() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[
            this.shipFormation.ships[key].type
          ] = this.shipFormation.ships[key].n;
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.transport(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        this.transportCoal,
        this.transportOre,
        this.transportCopper,
        this.transportUranium,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    deploy() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      // shipList = { "transportship": 2, "explorership": 1 }
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[
            this.shipFormation.ships[key].type
          ] = this.shipFormation.ships[key].n;
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.deploy(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        this.transportCoal,
        this.transportOre,
        this.transportCopper,
        this.transportUranium,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    support() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      // shipList = {"corvette": { "pos": 1, "n": 2 }, "transportship": { "pos": 8, "n": 1 } }
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[this.shipFormation.ships[key].type] = {
            pos: this.shipFormation.ships[key].pos,
            n: this.shipFormation.ships[key].n
          };
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.support(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    attack() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      // shipList = { "corvette": { "pos": 1, "n": 1 }, "frigate": { "pos": 2, "n": 1 }}
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[this.shipFormation.ships[key].type] = {
            pos: this.shipFormation.ships[key].pos,
            n: this.shipFormation.ships[key].n
          };
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.attack(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    siege() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      // shipList = {"corvette": { "pos": 1, "n": 2 }, "transportship": { "pos": 8, "n": 1 } }
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[this.shipFormation.ships[key].type] = {
            pos: this.shipFormation.ships[key].pos,
            n: this.shipFormation.ships[key].n
          };
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.siege(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    breaksiege() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      // shipList = { "corvette": { "pos": 1, "n": 1 }, "frigate": { "pos": 2, "n": 1 }}
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[this.shipFormation.ships[key].type] = {
            pos: this.shipFormation.ships[key].pos,
            n: this.shipFormation.ships[key].n
          };
        }
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.breaksiege(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        shipList,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    upgradeyamato() {
      let self = this;
      self.processing = true;
      this.clicked = true;
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.upgradeYamato(
        this.loginUser,
        this.planetId,
        self.shipFormation.ships[0].type,
        (error, result) => {
          if (error === null && result.success) {
            self.callbackHandling(self);
          }
        }
      );
      setTimeout(function() {
        self.callbackHandling(self);
      }, 700);
    },
    nextEventDuration() {
      let nextEvent = null;
      if (this.activeUserMissions !== null) {
        this.activeUserMissions.forEach(mission => {
          let busy = moment(new Date(mission.arrival * 1000));
          let returning = moment(new Date(mission.return * 1000));
          if (returning.isAfter(this.now) && returning.isBefore(busy)) {
            busy = returning;
          }
          if (nextEvent === null) {
            if (busy !== null && busy.isAfter(this.now)) {
              nextEvent = busy;
            }
          }

          if (
            nextEvent !== null &&
            nextEvent.isAfter(busy) &&
            busy.isAfter(this.now)
          ) {
            nextEvent = moment(busy);
          }
        });
        if (nextEvent === null) {
          return null;
        }
        let duration = this.moment.duration(nextEvent.diff(this.now));
        //Get Days and subtract from duration
        let days = ("0" + duration.days()).slice(-2);
        duration.subtract(this.moment.duration(days, "days"));

        //Get hours and subtract from duration
        let hours = ("0" + duration.hours()).slice(-2);
        duration.subtract(this.moment.duration(hours, "hours"));

        //Get Minutes and subtract from duration
        let minutes = ("0" + duration.minutes()).slice(-2);
        duration.subtract(this.moment.duration(minutes, "minutes"));

        //Get seconds
        let seconds = ("0" + duration.seconds()).slice(-2);
        return days + ":" + hours + ":" + minutes + ":" + seconds;
      } else {
        return null;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.fleet input.inputMedium {
  width: 10ch;
}
.fleet input.inputShort {
  width: 6ch;
}
.fleet select {
  width: 20ch;
}
</style>
