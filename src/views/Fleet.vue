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
      <table>
        <thead>
          <th @click="sort('longname')">{{ $t("Name") }}</th>
          <th @click="sort('quantity')">{{ $t("Quantity") }}</th>
          <th @click="sort('speed')">{{ $t("Speed") }}</th>
          <th @click="sort('cons')">{{ $t("Consumption") }}</th>
          <th @click="sort('capacity')">{{ $t("Capacity") }}</th>
          <th @click="sort('available')">{{ $t("Available") }}</th>
        </thead>
        <tbody>
          <tr v-for="ship in sortedFleet" :key="ship.longname">
            <td>{{ $t(ship.longname) }}</td>
            <td>{{ ship.quantity }}</td>
            <td>{{ ship.speed }}</td>
            <td>{{ ship.cons }}</td>
            <td>{{ ship.capacity }}</td>
            <td>{{ ship.available }}</td>
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
          {{ $t("X") }}: <input type="number" v-model="xCoordinate" />
          {{ $t("Y") }}:<input type="number" v-model="yCoordinate" />
        </p>
        <p>
          {{ $t("Distance") }}: {{ distance }}
        </p>
        <div v-if="command === 'explorespace'">
          <p>{{ $t("Uranium Consumption") }}:
          {{ consumption }}</p>
           <p>{{ $t("Outbound Travel") }}:
          {{ moment.duration(parseFloat(travelTime), 'hours').humanize()}}</p>
          <button @click="explore" :disabled="!explorationPossible">
            {{ $t("Send Explorer") }}
          </button>
        </div>
        <div v-if="command === 'transport'">
          <div>
            {{ $t("C") }}: <input type="number" v-model="transportCoal" />
            {{ $t("Fe") }}: <input type="number" v-model="transportOre" />
            {{ $t("Cu") }}: <input type="number" v-model="transportCopper" />
            {{ $t("U") }}: <input type="number" v-model="transportUranium" />
          </div>
          <p>{{ $t("Needed Transporter") }}: {{ neededTransporter }}</p>
          <p>
            <p>{{ $t("Uranium Consumption") }}:
          {{ consumption }}</p>
          <p>{{ $t("Outbound Travel") }}:
          {{ moment.duration(parseFloat(travelTime), 'hours').humanize() }}</p>
            <button @click="transport" :disabled="!transportPossible">
              {{ $t("Send Trasnporter") }}
            </button>
          </p>
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
          <router-link :to="'/' + routeUser + '/planets'">
            {{ $t("planet") }}
          </router-link>
        </p>
      </template>
      <template v-if="routeUser !== 'null'">
        <p>
          {{ $t("You have no ships. Buy some in the") }}
          <router-link :to="'/' + gameUser + '/' + planetId + '/shipyard'">
            {{ $t("Shipyard") }} </router-link
          >.
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import FleetService from "@/services/fleet";
import PlanetService from "@/services/planets";
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
      planet: null,
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
      transportUranium: 0
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
      planetId: state => state.planet.id
    }),
    sortedFleet() {
      var sortedFleet = this.groupedFleet;
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
    groupedFleet() {
      var groupedFleet = this.fleet;
      if (groupedFleet !== null) {
        groupedFleet.forEach(ship => {
          // add quantity property
          ship.quantity = 1;
          if (this.isBusy(ship.busy)) {
            ship.available = 0;
          } else {
            ship.available = 1;
          }
        });
        groupedFleet = groupedFleet.reduce((acc, current) => {
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
        return groupedFleet;
      } else {
        return groupedFleet;
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
        parseFloat(this.uranium) > (parseFloat(this.transportUranium) + parseFloat(this.consumption))
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
    neededTransporter() {
      let sum =
        parseFloat(this.transportCoal) +
        parseFloat(this.transportOre) +
        parseFloat(this.transportCopper) +
        parseFloat(this.transportUranium);
      return Math.ceil(sum / 100);
    },
    distance() {
      var a = this.planet.planet_corx - this.xCoordinate;
      var b = this.planet.planet_cory - this.yCoordinate;

      return Math.sqrt(a * a + b * b);
    },
    consumption() {
      if (this.command === "explorespace") {
        let shipConsumption = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Explorer") {
            shipConsumption = ship.cons;
          }
        })
        return Number (this.distance * shipConsumption).toFixed(2); 
      }
      if (this.command === "transport") {
                let shipConsumption = 0;
                this.sortedFleet.forEach(ship => {
          if (ship.longname === "Transporter") {
            shipConsumption =  ship.cons;
          } 
        })
        return Number (this.neededTransporter * this.distance * shipConsumption).toFixed(2); 
      }
      return 0;
    },
    travelTime() {
      if (this.command === "explorespace") {
        let speed = 0;
        this.sortedFleet.forEach(ship => {
          if (ship.longname === "Explorer") {
            speed =  ship.speed;
          } 
        })
        return Number (this.distance / speed).toFixed(2);
      }
      if (this.command === "transport") {
                let speed = 0;
                this.sortedFleet.forEach(ship => {
          if (ship.longname === "Transporter") {
            speed = ship.speed;
          } 
        })
        return Number (this.distance / speed).toFixed(2); 
      }
      return 0;
    }
  },
  methods: {
    async prepareComponent() {
      await this.getFleet();
      await this.getQuantity();
      await this.getPlanet();
    },
    async getFleet() {
      const response = await FleetService.all(this.routeUser, this.routePlanet);
      this.fleet = response;
    },
    async getPlanet() {
      const response = await PlanetService.byId(this.routePlanet);
      this.planet = response;
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
