<template>
  <div class="fleet">
    <h1>{{ $t("Fleet") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br />
          {{ $t("Planet: ") + routePlanet }}
        </template>
      </p>
    </template>
    <template
      v-if="
        routeUser !== 'null' &&
          routePlanet != 'null' &&
          sortedFleet !== null &&
          sortedFleet.length > 0
      "
    >
      <!-- Ship List -->
      <table>
        <thead>
          <th @click="sort('longname')">{{ $t("Name") }}</th>
          <th @click="sort('quantity')">{{ $t("All") }}</th>
          <th @click="sort('speed')">{{ $t("Speed") }}</th>
          <th @click="sort('cons')">{{ $t("Use") }}</th>
          <th @click="sort('capacity')">{{ $t("Load") }}</th>
          <th @click="sort('available')">{{ $t("Free") }}</th>
          <th
            v-if="
              command === 'deploy' ||
                command === 'support' ||
                command === 'attack'
            "
            @click="sort('toSend')"
          >
            {{ $t("Send") }}
          </th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedFleet" :key="ship.longname">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.quantity }}</td>
            <td>{{ ship.speed }}</td>
            <td>{{ ship.cons }}</td>
            <td>{{ ship.capacity }}</td>
            <td>{{ ship.available }}</td>
            <td
              v-if="
                command === 'deploy' ||
                  command === 'support' ||
                  command === 'attack'
              "
            >
              <input type="number" v-model="ship.toSend" />
              <button @click="add(ship, ship.toSend)">{{ $t("Add") }}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <br />
      <!-- Commands -->
      <div>
        {{ $t("Command") }}
        <select @change="onCommand(command)" v-model="command">
          <option value="explorespace">{{ $t("Explore") }}</option>
          <option value="transport">{{ $t("Transport") }}</option>
          <option value="deploy">{{ $t("Deploy") }}</option>
          <option value="support">{{ $t("Support") }}</option>
          <option value="attack">{{ $t("Attack") }}</option>
          <option value="sent">{{ $t("Sent") }}</option>
        </select>
      </div>
      <br />
      <template v-if="command !== null && command !== 'sent'">
        <!-- General Form -->
        <table>
          <thead>
            <th>{{ $t("Position") }}</th>
            <th>{{ $t("Ship Type") }}</th>
            <th>{{ $t("Number") }}</th>
          </thead>
          <tbody>
            <tr v-for="(ship, shipType) in shipFormation.ships" :key="shipType">
              <td>{{ ship.pos }}</td>
              <td>{{ $t(ship.name) }}</td>
              <td>{{ ship.n }}</td>
            </tr>
          </tbody>
        </table>
        <p>
          <input v-model="search" placeholder="(x/y)" />
          <button @click="fillCoordinates(search)">{{ $t("Fill") }}</button>
        </p>
        <p>
          {{ $t("X") }}:
          <input
            type="number"
            v-model="xCoordinate"
            v-on:change="onCoordinateChange"
          />
          {{ $t("Y") }}:
          <input
            type="number"
            v-model="yCoordinate"
            v-on:change="onCoordinateChange"
          />
        </p>
        <p>{{ $t("Distance") }}: {{ Number(distance).toFixed(2) }}</p>
        <p>
          {{ $t("Uranium Needed") }}:
          {{ Number(this.fuelConsumption).toFixed(2) }}
        </p>
        <p>
          {{ $t("Outbound Travel") }}:
          {{ moment.duration(parseFloat(travelTime), "hours").humanize() }}
        </p>
        <!-- Exploration -->
        <div v-if="command === 'explorespace'">
          <button @click="explore" :disabled="!commandEnabled('explorespace')">
            {{ $t("Send Explorer") }}
          </button>
        </div>
        <!-- Transport -->
        <div v-if="command === 'transport'">
          <div>
            {{ $t("C") }}:
            <input
              type="number"
              v-model="transportCoal"
              v-on:change="onResourceChange"
            />
            {{ $t("Fe") }}:
            <input
              type="number"
              v-model="transportOre"
              v-on:change="onResourceChange"
            />
            {{ $t("Cu") }}:
            <input
              type="number"
              v-model="transportCopper"
              v-on:change="onResourceChange"
            />
            {{ $t("U") }}:
            <input
              type="number"
              v-model="transportUranium"
              v-on:change="onResourceChange"
            />
          </div>
          <br />
          <div>
            <button @click="transport" :disabled="!commandEnabled('transport')">
              {{ $t("Send Transporter") }}
            </button>
          </div>
        </div>
        <!-- Deploy / Support / Attack-->
        <div
          v-if="
            command === 'deploy' ||
              command === 'support' ||
              command === 'attack'
          "
        >
          <div>
            <div v-if="command === 'deploy'">
              <button @click="deploy" :disabled="!commandEnabled('deploy')">
                {{ $t("Deploy Ships") }}
              </button>
            </div>
            <div v-if="command === 'support'">
              <button @click="support" :disabled="!commandEnabled('support')">
                {{ $t("Support Planet") }}
              </button>
            </div>
            <div v-if="command === 'attack'">
              <button @click="attack" :disabled="!commandEnabled('attack')">
                {{ $t("Attack Planet") }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </template>
    <!-- Not enough Context -->
    <template v-else>
      <template v-if="routeUser === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="routePlanet === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/' + routeUser + '/planets'">{{
            $t("planet")
          }}</router-link>
        </p>
      </template>
      <template v-if="routeUser !== 'null'">
        <p>
          {{ $t("You have no ships. Buy some in the") }}
          <router-link :to="'/' + gameUser + '/' + planetId + '/shipyard'">{{
            $t("Shipyard")
          }}</router-link
          >.
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import FleetService from "@/services/fleet";
import QuantityService from "@/services/quantity";
import { mapState } from "vuex";
import moment from "moment";
import SteemConnectService from "@/services/steemconnect";

export default {
  name: "fleet",
  props: ["routeUser", "routePlanet"],
  data: function() {
    return {
      fleet: null,
      quantity: null,
      interval: null,
      coal: null,
      ore: null,
      copper: null,
      uranium: null,
      clicked: [],
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
      pos: 1,
      search: null
    };
  },
  async mounted() {
    await this.prepareComponent();
    this.interval = setInterval(() => {
      this.calculateCoal();
      this.calculateOre();
      this.calculateCopper();
      this.calculateUranium();
    }, 1000);
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
    },
    async getFleet() {
      const response = await FleetService.all(this.routeUser, this.routePlanet);
      this.fleet = response;
      if (this.fleet !== null) {
        this.fleet.forEach(ship => {
          ship.quantity = 1;
          if (this.isBusy(ship.busy)) {
            ship.available = 0;
          } else {
            ship.available = 1;
          }
          ship.toSend = 0;
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
                ship.available = ship.available + current.available;
                ship.capacity = ship.capacity + current.capacity;
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
    onCommand(command) {
      if (
        (this.$route.query.x !== undefined && this.$route.query.x !== null) &
        (this.$route.query.y !== undefined && this.$route.query.y !== null)
      ) {
        this.xCoordinate = this.$route.query.x;
        this.yCoordinate = this.$route.query.y;
      }
      this.resetShipFormation();
      if (command === "explorespace") {
        this.sortedFleet.forEach(ship => {
          if (ship.type === "explorership") {
            this.add(ship, 1);
          }
        });
      }
    },
    onResourceChange() {
      let sum =
        parseFloat(this.transportCoal) +
        parseFloat(this.transportOre) +
        parseFloat(this.transportCopper) +
        parseFloat(this.transportUranium);
      this.sortedFleet.forEach(ship => {
        if (ship.type === "transportship") {
          this.add(ship, Math.ceil(sum / 100));
        }
      });
    },
    onCoordinateChange() {
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
    commandEnabled(command) {
      let enabled = false;
      if (
        this.command !== null &&
        this.command === command &&
        this.xCoordinate !== null &&
        this.xCoordinate !== "" &&
        this.yCoordinate !== null &&
        this.yCoordinate !== "" &&
        this.shipFormation.count > 0 &&
        parseFloat(this.uranium) > parseFloat(this.fuelConsumption)
      ) {
        if (command === "transport") {
          if (
            parseFloat(this.coal) > parseFloat(this.transportCoal) &&
            parseFloat(this.ore) > parseFloat(this.transportOre) &&
            parseFloat(this.copper) > parseFloat(this.transportCopper) &&
            parseFloat(this.uranium) >
              parseFloat(this.transportUranium) +
                parseFloat(this.fuelConsumption) &&
            this.shipFormation.ships.transportship.n > 0
          ) {
            enabled = true;
          } else {
            enabled = false;
          }
        } else if (command === "explorespace") {
          if (
            parseFloat(this.coal) > parseFloat(this.transportCoal) &&
            parseFloat(this.ore) > parseFloat(this.transportOre) &&
            parseFloat(this.copper) > parseFloat(this.transportCopper) &&
            parseFloat(this.uranium) >
              parseFloat(this.transportUranium) +
                parseFloat(this.fuelConsumption) &&
            this.shipFormation.ships.explorership.n > 0
          ) {
            enabled = true;
          } else {
            enabled = false;
          }
        } else {
          enabled = true;
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
      this.pos = 1;
      this.shipFormation = {
        count: 0,
        ships: {
          corvette: { n: 0, c: 0, pos: 0, name: "Corvette" },
          frigate: { n: 0, c: 0, pos: 0, name: "Frigate" },
          destroyer: { n: 0, c: 0, pos: 0, name: "Destroyer" },
          cruiser: { n: 0, c: 0, pos: 0, name: "Cruiser" },
          battlecruiser: { n: 0, c: 0, pos: 0, name: "Battlecruiser" },
          carrier: { n: 0, c: 0, pos: 0, name: "Carrier" },
          dreadnought: { n: 0, c: 0, pos: 0, name: "Dreadnought" },
          transportship: { n: 0, c: 0, pos: 0, name: "Transporter" },
          explorership: { n: 0, c: 0, pos: 0, name: "Explorer" }
        }
      };
      this.fleet.forEach(ship => {
        ship.toSend = 0;
      });
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
    add(ship, quantity) {
      var shipClass = ship.type;
      shipClass = shipClass.replace(/[0-9]/g, "");
      if (this.slowestSpeed === null) {
        this.slowestSpeed = ship.speed;
      }
      if (ship.speed < this.slowestSpeed) {
        this.slowestSpeed = ship.speed;
      }
      this.shipFormation.count = this.shipFormation.count + 1;
      this.shipFormation.ships[shipClass].n = Math.min(
        quantity,
        ship.available
      );
      this.shipFormation.ships[shipClass].c = ship.cons;
      this.shipFormation.ships[shipClass].pos = this.pos;
      this.pos++;
      // There are only 8 slots.
      if (this.pos > 8) {
        this.pos = 1;
      }
    },
    explore() {
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.explorespace(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        (error, result) => {
          if (error === null && result.success) {
            this.command = "sent";
            this.xCoordinate = null;
            this.yCoordinate = null;
          }
        }
      );
    },
    transport() {
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.transport(
        this.loginUser,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
        this.shipFormation.ships.transportship.n,
        this.transportCoal,
        this.transportOre,
        this.transportCopper,
        this.transportUranium,
        (error, result) => {
          if (error === null && result.success) {
            this.command = "sent";
            this.xCoordinate = null;
            this.yCoordinate = null;
            this.transportCoal = 0;
            this.transportOre = 0;
            this.transportCopper = 0;
            this.transportUranium = 0;
          }
        }
      );
    },
    deploy() {
      // shipList = { "transportship": 2, "explorership": 1 }
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[key] = this.shipFormation.ships[key].n;
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
            this.command = "sent";
            this.xCoordinate = null;
            this.yCoordinate = null;
            this.transportCoal = 0;
            this.transportOre = 0;
            this.transportCopper = 0;
            this.transportUranium = 0;
          }
        }
      );
    },
    support() {
      // shipList = {"corvette": { "pos": 1, "n": 2 }, "transportship": { "pos": 8, "n": 1 } }
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[key] = {
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
            this.command = "sent";
            this.xCoordinate = null;
            this.yCoordinate = null;
          }
        }
      );
    },
    attack() {
      // shipList = { "corvette": { "pos": 1, "n": 1 }, "frigate": { "pos": 2, "n": 1 }}
      let shipList = {};
      for (let key in this.shipFormation.ships) {
        if (this.shipFormation.ships[key].n > 0) {
          shipList[key] = {
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
            this.command = "sent";
            this.xCoordinate = null;
            this.yCoordinate = null;
          }
        }
      );
    },
    fillCoordinates(search) {
      let split = search
        .replace("(", "")
        .replace(")", "")
        .replace(/\s+/g, "")
        .split("/");
      this.xCoordinate = split[0];
      this.yCoordinate = split[1];
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
.fleet input {
  width: 10ch;
}
.fleet select {
  width: 15ch;
}
</style>
