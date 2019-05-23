<template>
  <div class="fleet">
    <h1>{{ $t("Fleet") }}</h1>
    <template v-if="routeUser !== gameUser">
      <p>
        {{ $t("User: ") + routeUser }}
        <template v-if="routeUser !== planetId">
          <br>
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
      <table>
        <thead>
          <th @click="sort('longname')">{{ $t("Name") }}</th>
          <th @click="sort('quantity')">{{ $t("All") }}</th>
          <th @click="sort('speed')">{{ $t("Speed") }}</th>
          <th @click="sort('cons')">{{ $t("Use") }}</th>
          <th @click="sort('capacity')">{{ $t("Load") }}</th>
          <th @click="sort('available')">{{ $t("Free") }}</th>
          <th
            v-if="command === 'deploy' || command === 'support' || command === 'attack'"
            @click="sort('toSend')"
          >{{ $t("Send") }}</th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedFleet" :key="ship.longname">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.quantity }}</td>
            <td>{{ ship.speed }}</td>
            <td>{{ ship.cons }}</td>
            <td>{{ ship.capacity }}</td>
            <td>{{ ship.available }}</td>
            <td v-if="command === 'deploy' || command === 'support' || command === 'attack'">
              <input type="number" v-model="ship.toSend">
              <button @click="add(ship,ship.toSend)">{{$t("Add")}}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        {{ $t("Command") }}
        <select v-model="command">
          <option value="explorespace">{{ $t("Explore") }}</option>
          <option value="transport">{{ $t("Transport") }}</option>
          <option value="deploy">{{ $t("Deploy") }}</option>
          <option value="support">{{ $t("Support") }}</option>
          <option value="attack">{{ $t("Attack") }}</option>
          <option value="sent">{{ $t("Sent") }}</option>
        </select>
      </p>
      <template v-if="command !== null">
        <p>
          {{ $t("X") }}:
          <input type="number" v-model="xCoordinate">
          {{ $t("Y") }}:
          <input type="number" v-model="yCoordinate">
        </p>
        <p>{{ $t("Distance") }}: {{ distance }}</p>
        <div v-if="command === 'explorespace'">
          <p>{{ $t("Uranium Consumption") }}: {{ consumption }}</p>
          <p>
            {{ $t("Outbound Travel") }}:
            {{ moment.duration(parseFloat(travelTime), "hours").humanize() }}
          </p>
          <button @click="explore" :disabled="!explorationPossible">{{ $t("Send Explorer") }}</button>
        </div>
        <div v-if="command === 'transport'">
          <div>
            {{ $t("C") }}:
            <input type="number" v-model="transportCoal">
            {{ $t("Fe") }}:
            <input type="number" v-model="transportOre">
            {{ $t("Cu") }}:
            <input type="number" v-model="transportCopper">
            {{ $t("U") }}:
            <input type="number" v-model="transportUranium">
          </div>
          <p>{{ $t("Needed Transporter") }}: {{ neededTransporter }}</p>
          <div>
            <p>{{ $t("Uranium Consumption") }}: {{ consumption }}</p>
            <p>
              {{ $t("Outbound Travel") }}:
              {{ moment.duration(parseFloat(travelTime), "hours").humanize() }}
            </p>
            <button @click="transport" :disabled="!transportPossible">{{ $t("Send Transporter") }}</button>
          </div>
        </div>
        <div v-if="command ==='deploy' || command === 'support' || command === 'attack'">
          <div>
            <p>{{ $t("Uranium Consumption") }}: {{ consumption}}</p>
            <p>
              {{ $t("Outbound Travel") }}:
              {{ moment.duration(parseFloat(travelTime), "hours").humanize() }}
            </p>
            <div
              v-for="(quantity,ship) in shipList"
              :key="ship"
            >{{$t(searchLongName(ship))}}: {{quantity}}</div>
            <br>
            <div v-if="command ==='deploy'">
              <button @click="deploy" :disabled="!commandPossible">{{ $t("Deploy Ships") }}</button>
            </div>
            <div v-if="command ==='support'">
              <button @click="support" :disabled="!commandPossible">{{ $t("Support Planet") }}</button>
            </div>
            <div v-if="command ==='attack'">
              <button @click="attack" :disabled="!commandPossible">{{ $t("Attack Planet") }}</button>
            </div>
          </div>
        </div>
      </template>
    </template>
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
          <router-link :to="'/' + routeUser + '/planets'">{{ $t("planet") }}</router-link>
        </p>
      </template>
      <template v-if="routeUser !== 'null'">
        <p>
          {{ $t("You have no ships. Buy some in the") }}
          <router-link :to="'/' + gameUser + '/' + planetId + '/shipyard'">{{ $t("Shipyard") }}</router-link>.
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
      shipList: {},
      shipListEmpty: true,
      slowestSpeed: null
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
    explorationPossible() {
      let possible = false;
      let consumption = this.consumption;
      if (
        this.command !== null &&
        this.command === "explorespace" &&
        this.xCoordinate !== null &&
        this.yCoordinate !== null &&
        parseFloat(this.coal) > parseFloat(consumption)
      ) {
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Explorer" && ship.available > 0) {
            possible = true;
          }
        });
      }

      return possible;
    },
    transportPossible() {
      let possible = false;
      if (
        this.command !== null &&
        this.command === "transport" &&
        this.xCoordinate !== null &&
        this.xCoordinate !== "" &&
        this.yCoordinate !== null &&
        this.yCoordinate !== "" &&
        parseFloat(this.coal) > parseFloat(this.transportCoal) &&
        parseFloat(this.ore) > parseFloat(this.transportOre) &&
        parseFloat(this.copper) > parseFloat(this.transportCopper) &&
        parseFloat(this.uranium) >
          parseFloat(this.transportUranium) + parseFloat(this.consumption)
      ) {
        this.sortedFleet.forEach(ship => {
          if (
            ship.longname === "Transporter" &&
            ship.available >= this.neededTransporter
          ) {
            possible = true;
          }
        });
      }

      return possible;
    },
    commandPossible() {
      let possible = false;
      if (
        this.command !== null &&
        (this.command === "deploy" ||
          this.command === "support" ||
          this.command === "attack") &&
        this.xCoordinate !== null &&
        this.xCoordinate !== "" &&
        this.yCoordinate !== null &&
        this.yCoordinate !== "" &&
        !this.shipListEmpty
      ) {
        possible = true;
      }

      return possible;
    },
    neededTransporter() {
      let sum =
        parseFloat(this.transportCoal) +
        parseFloat(this.transportOre) +
        parseFloat(this.transportCopper) +
        parseFloat(this.transportUranium);
      return Math.ceil(sum / 100);
    },
    distance() {
      var a = this.planetPosX - this.xCoordinate;
      var b = this.planetPosY - this.yCoordinate;

      return Math.sqrt(a * a + b * b);
    },
    consumption() {
      var oneWay = this.distance;
      if (this.command === "explorespace") {
        let shipConsumption = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Explorer") {
            shipConsumption = ship.cons;
          }
        });
        return Number(2 * oneWay * shipConsumption).toFixed(2);
      }
      if (this.command === "transport") {
        let shipConsumption = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Transporter") {
            shipConsumption = ship.cons;
          }
        });
        return Number(
          this.neededTransporter * 2 * oneWay * shipConsumption
        ).toFixed(2);
      }
      if (this.command !== "transport" && this.command != "explorespace") {
        let shipConsumption = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.toSend > 0) {
            shipConsumption =
              shipConsumption +
              ship.cons * oneWay * Math.min(ship.toSend, ship.available);
          }
        });
        return Number(shipConsumption).toFixed(2);
      }
      return 0;
    },
    travelTime() {
      if (this.command === "explorespace") {
        let speed = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Explorer") {
            speed = ship.speed;
          }
        });
        return Number(this.distance / speed).toFixed(2);
      }
      if (this.command === "transport") {
        let speed = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Transporter") {
            speed = ship.speed;
          }
        });
        return Number(this.distance / speed).toFixed(2);
      }
      if (this.command !== "transport" && this.command !== "transport") {
        return Number(this.distance / this.slowestSpeed).toFixed(2);
      }
      return 0;
    },
    shipsToSend() {
      var total = 0;
      this.sortedFleet.forEach(ship => {
        if (ship.toSend > 0) {
          total = total + Math.min(ship.available, ship.toSend);
        }
      });
      return total;
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
          // add quantity property
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
        this.neededTransporter,
        this.planetId,
        this.xCoordinate,
        this.yCoordinate,
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
    add(ship, quantity) {
      if (this.slowestSpeed === null) {
        this.slowestSpeed = ship.speed;
      }
      if (ship.speed < this.slowestSpeed) {
        this.slowestSpeed = ship.speed;
      }
      this.shipListEmpty = false;
      var type = ship.type;
      this.shipList[type] = Math.min(quantity, ship.available);
      this.$forceUpdate();
    },
    deploy() {
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.deploy(
        this.loginUser,
        this.planetId,
        this.shipList,
        this.xCoordinate,
        this.yCoordinate,
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
      let shipPosList = {};
      let pos = 1;
      for (let key in this.shipList) {
        shipPosList[key] = { pos: pos, n: this.shipList[key] };
        pos++;
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.support(
        this.loginUser,
        shipPosList,
        this.xCoordinate,
        this.yCoordinate,
        this.planetId,
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
      let shipPosList = {};
      let pos = 1;
      for (let key in this.shipList) {
        shipPosList[key] = { pos: pos, n: this.shipList[key] };
        pos++;
      }
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.attack(
        this.loginUser,
        this.planetId,
        shipPosList,
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
    searchLongName(key) {
      for (var i = 0; i < this.sortedFleet.length; i++) {
        if (this.sortedFleet[i].type === key) {
          return this.sortedFleet[i].longname;
        }
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
