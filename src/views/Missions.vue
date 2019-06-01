<template>
  <div class="missions">
    <h1>{{ $t("Missions") }}</h1>
    <template v-if="gameUser !== 'null'">
      <table>
        <thead>
          <th @click="sort('type')">{{ $t("Type") }}</th>
          <th @click="sort('start_x')">{{ $t("Origin") }}</th>
          <th @click="sort('end_x')">{{ $t("Destination") }}</th>
          <th @click="sort('ships.total')">{{ $t("Ships") }}</th>
          <th @click="sort('arrival')">{{ $t("Arrival") }}</th>
          <th @click="sort('return')">{{ $t("Return") }}</th>
          <th @click="sort('result')">{{ $t("Result") }}</th>
          <th @click="sort('cancel_trx')">{{ $t("Cancel") }}</th>
          <th @click="sort('id')">{{ $t("Details") }}</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="mission in sortedMissions" :key="mission.id">
            <td>{{ $t(mission.type) }}</td>
            <td>{{ "(" + mission.start_x + "/" + mission.start_y + ")" }}</td>
            <td>{{ "(" + mission.end_x + "/" + mission.end_y + ")" }}</td>
            <td>{{ mission.ships.total }}</td>
            <td>{{ moment.unix(mission.arrival, "seconds").format("lll") }}</td>
            <td>
              <span v-if="mission.return !== null">
                {{ moment.unix(mission.return, "seconds").format("lll") }}
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ $t(parseResult(mission.result) || "-") }}</td>
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
            <td>
              <router-link
                v-if="
                  mission.type === 'attack' &&
                    mission.result !== null &&
                    mission.result !== 'cancel'
                "
                :to="{ path: '/battle/' + mission.id }"
                >{{ $t("Log") }}</router-link
              >&nbsp;
              <router-link
                v-if="
                  mission.type === 'attack' &&
                    mission.result !== null &&
                    mission.result !== 'cancel'
                "
                :to="{ path: '/replay/' + mission.id }"
              >
                {{ $t("Replay") }}</router-link
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
      currentSort: "arrival",
      currentDir: "desc",
      clicked: [],
      chainResponse: []
    };
  },
  async mounted() {
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
    }
  },
  methods: {
    async prepareComponent() {
      await this.getMissions();
    },
    async getMissions() {
      const response = await MissionsService.all(this.gameUser);
      this.missions = response;
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentDir = this.currentDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    cancelPossible(mission) {
      if (mission.cancel_trx !== null) {
        return false;
      }
      if (mission.user !== this.loginUser) {
        return false;
      }
      if (mission.result != null) {
        return false;
      }
      if (!this.isOutgoing(mission.arrival)) {
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
    }
  }
};
</script>
