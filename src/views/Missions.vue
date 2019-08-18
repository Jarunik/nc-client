<template>
  <div class="missions">
    <h1>{{ $t("Missions") }}</h1>
    <template v-if="gameUser !== 'null'">
      <p v-if="shipString">{{ shipString }}</p>
      <p v-else>{{ $t("Click the ship total to see details.") }}</p>
      <h2>
        {{ $t("Active") }} ({{
          activeMissions !== null ? activeMissions.length : 0
        }}
        / {{ totalMissions }})
      </h2>
      <table>
        <thead>
          <th @click="sortActive('type')">{{ $t("Type") }}</th>
          <th @click="sortActive('user')">{{ $t("User") }}</th>
          <th @click="sortActive('start_x')">{{ $t("Origin") }}</th>
          <th @click="sortActive('end_x')">{{ $t("Destination") }}</th>
          <th @click="sortActive('ships.total')">{{ $t("Ships") }}</th>
          <th @click="sortActive('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sortActive('return')">{{ $t("Return") }}</th>
          <th @click="sortActive('result')">{{ $t("Result") }}</th>
          <th @click="sortActive('id')">{{ $t("Details") }}</th>
          <th>{{ $t("Cancel") }}</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedActiveMissions" :key="mission.id">
            <td>{{ $t(mission.type) }}</td>
            <td>{{ mission.user }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>
              <span v-if="mission.ships !== null" @click="shipList(mission)">
                <font v-if="selectedShips === mission.id" color="green">{{
                  mission.ships.total
                }}</font>
                <span v-else>{{ mission.ships.total }}</span></span
              >
            </td>
            <td>
              {{
                moment
                  .duration(
                    moment.utc().diff(moment.unix(mission.arrival, "seconds"))
                  )
                  .humanize()
              }}
            </td>
            <td>
              <span v-if="mission.return !== null">
                {{
                  moment
                    .duration(
                      moment.utc().diff(moment.unix(mission.return, "seconds"))
                    )
                    .humanize()
                }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ $t(parseResult(mission.result)) || "-" }}</td>
            <td>
              <router-link
                v-if="
                  (mission.type === 'attack' ||
                    mission.type === 'support' ||
                    mission.type === 'siege' ||
                    mission.type === 'breaksiege') &&
                    mission.result !== null &&
                    (mission.result !== 'cancel' &&
                      mission.result !== 'cancel_support' &&
                      mission.result !== 'cancel_siege' &&
                      mission.result !== 'cancel_breaksiege')
                "
                :to="{ path: '/battle/' + mission.id }"
                >{{ $t("Log") }}</router-link
              >
            </td>
            <td>
              <button
                :disabled="clicked.includes(mission.id)"
                v-if="cancelPossible(mission)"
                @click="cancel(mission)"
              >
                <cancel-icon :title="$t('Cancel')" />
              </button>
            </td>
            <td v-if="chainResponse.includes(mission.id)">
              <timer-sand-icon :title="$t('Transaction sent')" />
            </td>
          </tr>
        </tbody>
      </table>
      <h2>{{ $t("Recent") }}</h2>
      <table>
        <thead>
          <th @click="sort('type')">{{ $t("Type") }}</th>
          <th @click="sort('user')">{{ $t("User") }}</th>
          <th @click="sort('start_x')">{{ $t("Origin") }}</th>
          <th @click="sort('end_x')">{{ $t("Destination") }}</th>
          <th @click="sort('ships.total')">{{ $t("Ships") }}</th>
          <th @click="sort('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sort('return')">{{ $t("Return") }}</th>
          <th @click="sort('result')">{{ $t("Result") }}</th>
          <th @click="sort('id')">{{ $t("Details") }}</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedMissions" :key="mission.id">
            <td>{{ $t(mission.type) }}</td>
            <td>{{ mission.user }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>
              <span v-if="mission.ships !== null" @click="shipList(mission)">
                <font v-if="selectedShips === mission.id" color="green">{{
                  mission.ships.total
                }}</font>
                <span v-else>{{ mission.ships.total }}</span></span
              >
            </td>
            <td>{{ moment.unix(mission.arrival, "seconds").format("lll") }}</td>
            <td>
              <span v-if="mission.return !== null">
                {{ moment.unix(mission.return, "seconds").format("lll") }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ $t(parseResult(mission.result)) || "-" }}</td>
            <td>
              <router-link
                v-if="
                  (mission.type === 'attack' ||
                    mission.type === 'support' ||
                    mission.type === 'siege' ||
                    mission.type === 'breaksiege') &&
                    mission.result !== null &&
                    (mission.result !== 'cancel' &&
                      mission.result !== 'cancel_support' &&
                      mission.result !== 'cancel_siege' &&
                      mission.result !== 'cancel_breaksiege')
                "
                :to="{ path: '/battle/' + mission.id }"
                >{{ $t("Log") }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="JSON.stringify(missions) === '[]'">{{ $t("No Result") }}</p>
    </template>
    <template v-else>
      <p>
        {{ $t("Please set the") }}
        <router-link to="/user">{{ $t("set a user") }}</router-link>
      </p>
    </template>
  </div>
</template>

<script>
import MissionsService from "@/services/missions";
import SkillsService from "@/services/skills";
import { mapState } from "vuex";
import CancelIcon from "vue-material-design-icons/Cancel.vue";
import TimerSandIcon from "vue-material-design-icons/TimerSand.vue";
import SteemConnectService from "@/services/steemconnect";
import moment from "moment";

export default {
  name: "missions",
  components: {
    CancelIcon,
    TimerSandIcon
  },
  data: function() {
    return {
      missions: null,
      skills: null,
      activeMissions: null,
      currentSort: "arrival",
      currentDir: "desc",
      currentActiveSort: "arrival",
      currentActiveDir: "asc",
      clicked: [],
      chainResponse: [],
      shipString: "",
      selectedShips: null,
      totalMissions: 0
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
    sortedMissions() {
      var sortedMissions = this.missions;
      if (sortedMissions !== null) {
        return sortedMissions.sort((a, b) => {
          let modifier = 1;
          if (this.currentDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (this.currentSort === "ships.total") {
            if (a.ships.total < b.ships.total) return -1 * modifier;
            if (a.ships.total > b.ships.total) return 1 * modifier;
          } else {
            if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
            if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          }
          return 0;
        });
      } else {
        return sortedMissions;
      }
    },
    sortedActiveMissions() {
      var sortedActiveMissions = this.activeMissions;
      if (sortedActiveMissions !== null) {
        return sortedActiveMissions.sort((a, b) => {
          let modifier = 1;
          if (this.currentActiveDir === "desc") modifier = -1;
          if (a[this.currentActiveSort] === null) return -1 * modifier;
          if (b[this.currentActiveSort] === null) return 1 * modifier;
          if (this.currentSort === "ships.total") {
            if (a.ships.total < b.ships.total) return -1 * modifier;
            if (a.ships.total > b.ships.total) return 1 * modifier;
          } else {
            if (a[this.currentActiveSort] < b[this.currentActiveSort])
              return -1 * modifier;
            if (a[this.currentActiveSort] > b[this.currentActiveSort])
              return 1 * modifier;
          }
          return 0;
        });
      } else {
        return sortedActiveMissions;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getMissions();
      await this.getSkills();
      await this.calculatMissionTotal();
    },
    async getMissions() {
      const active = await MissionsService.active(this.gameUser);
      this.activeMissions = active;

      const latest = await MissionsService.latest(this.gameUser, 80);

      const inactiveMissions = latest.filter(latest => {
        return !active.find(active => {
          return active.id === latest.id;
        });
      });

      this.missions = inactiveMissions;
    },
    async getSkills() {
      const response = await SkillsService.all(this.gameUser);
      this.skills = response;
    },
    calculatMissionTotal() {
      let missionBudget = 0;
      if (this.skills !== null) {
        this.skills.forEach(skill => {
          if (skill.name === "missioncontrol") {
            missionBudget = skill.current * 2;
          }
        });
      }
      this.totalMissions = missionBudget;
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentDir = this.currentDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    sortActive(s) {
      //if s == current sort, reverse
      if (s === this.currentActiveSort) {
        this.currentActiveDir =
          this.currentActiveDir === "asc" ? "desc" : "asc";
      }
      this.currentActiveSort = s;
    },
    cancelPossible(mission) {
      if (mission.cancel_trx !== null) {
        return false;
      }
      if (mission.user !== this.loginUser) {
        return false;
      }
      if (mission.result != null && mission.type != "support") {
        return false;
      }
      if (
        !this.isOutgoing(mission.arrival) &&
        mission.type !== "support" &&
        mission.type !== "seige" &&
        mission.type !== "breaksiege"
      ) {
        return false;
      }
      return true;
    },
    cancel(mission) {
      this.clicked.push(mission.id);
      SteemConnectService.setAccessToken(this.accessToken);
      SteemConnectService.cancel(
        this.loginUser,
        mission.id,
        (error, result) => {
          if (error === null && result.success) {
            this.chainResponse.push(mission.id);
          }
        }
      );
    },
    isOutgoing(arrival) {
      var arrivalUntil = moment(new Date(arrival * 1000));
      var now = moment.utc();
      if (arrivalUntil === 0) {
        return false;
      } else {
        if (now.isAfter(arrivalUntil)) {
          return false;
        } else {
          return true;
        }
      }
    },
    parseResult(result) {
      if (result === "nothing_found") {
        return "Nothing found";
      }
      if (result === "planet_found") {
        return "Planet found";
      }
      if (result === "nothing_happened") {
        return "Nothing Happened";
      }
      if (result === "cancel_support") {
        return "Cancel support";
      }
      if (result === "cancel_siege") {
        return "Cancel siege";
      }
      if (result === "cancel_breaksiege") {
        return "Cancel breaksiege";
      }
      if (result === "cancel") {
        return "Cancel";
      }
      if (result === "explorer_lost") {
        return "Explorer lost";
      }
      if (result === "2") {
        return "Victory";
      }
      if (result === "1") {
        return "Defeat";
      }
      if (result === "0") {
        return "Draw";
      }
      if (result !== null) {
        return "Unknown";
      }
    },
    shipList(mission) {
      var string = "";
      for (const key in mission.ships) {
        let value = mission.ships[key];
        if (
          value !== "undefined" &&
          key !== "total" &&
          value !== 0 &&
          typeof value == "number"
        ) {
          string = string + this.$t(key) + ":" + mission.ships[key] + " ";
        } else if (
          value !== "undefined" &&
          key !== "total" &&
          value !== 0 &&
          typeof value == "object"
        ) {
          string = string + this.$t(key) + ":" + mission.ships[key].n + " ";
        }
      }
      this.shipString = string;
      this.selectedShips = mission.id;
    }
  }
};
</script>
