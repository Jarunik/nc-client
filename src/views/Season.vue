<template>
  <div class="season">
    <h1>
      {{ $t("Season") }}
    </h1>
    <template v-if="seasonRanking !== null">
      <p>
        {{ moment(new Date(seasonRanking.start_date * 1000)).format("LLL") }} -
        {{ moment(new Date(seasonRanking.end_date * 1000)).format("LLL") }}
      </p>
      <p>
        {{ $t("Prize Pool") }}: {{ seasonRanking.steem_rewards + " STEEM" }},
        {{ $t("Leach Rate") }}: {{ seasonRanking.leach_rate * 100 + "%" }}
      </p>
      <p>
        <font color="green">{{ seasonDuration() }}</font>
      </p>
      <h2>{{ seasonRanking.name }}</h2>
      <template v-if="sortedRanking === undefined || sortedRanking.length == 0">
        {{ $t("No one scored points yet. Upgrade a Yamato.") }}
      </template>
      <template v-else>
        <table>
          <thead>
            <th>
              <timer-icon :title="$t('Rank')" />
            </th>
            <th @click="sort('user')">
              <account-icon :title="$t('User')" />
            </th>
            <th @click="sort('build_reward')">
              <rocket-icon :title="$t('Build Reward Points')" />
            </th>
            <th @click="sort('destroy_reward')">
              <nuke-icon :title="$t('Destroy Reward Points')" />
            </th>
            <th @click="sort('total_reward')">
              <sigma-icon :title="$t('Total Reward Points')" />
            </th>
          </thead>
          <tbody>
            <tr v-for="(rank, index) in sortedRanking" :key="rank.user">
              <td>{{ index + 1 }}</td>
              <td @click="setUser(rank.user)">{{ rank.user }}</td>
              <td>{{ Number(rank.build_reward / 100000000).toFixed(0) }}</td>
              <td>{{ Number(rank.destroy_reward / 100000000).toFixed(0) }}</td>
              <td>{{ Number(rank.total_reward / 100000000).toFixed(0) }}</td>
            </tr>
          </tbody>
        </table>
      </template>
    </template>
  </div>
</template>

<script>
import SeasonService from "@/services/season";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import TimerIcon from "vue-material-design-icons/Timer.vue";
import AccountIcon from "vue-material-design-icons/Account.vue";
import RocketIcon from "vue-material-design-icons/Rocket.vue";
import SigmaIcon from "vue-material-design-icons/Sigma.vue";
import NukeIcon from "vue-material-design-icons/Nuke.vue";

export default {
  name: "ranking",
  components: {
    TimerIcon,
    AccountIcon,
    RocketIcon,
    NukeIcon,
    SigmaIcon
  },
  data: function() {
    return {
      seasonRanking: null,
      currentSort: "total_reward",
      currentSortDir: "desc",
      loadSort: "battle"
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  computed: {
    sortedRanking() {
      var sortedRanking;
      if (this.seasonRanking !== null) {
        sortedRanking = this.seasonRanking.ranking;
      } else {
        sortedRanking = [];
      }
      if (sortedRanking !== null) {
        return sortedRanking.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] === null) return -1 * modifier;
          if (b[this.currentSort] === null) return 1 * modifier;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedRanking;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getSeason();
    },
    async getSeason() {
      const response = await SeasonService.seasonRanking();
      this.seasonRanking = response;
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
    setUser(newUser) {
      this.fetchUser(newUser).then(searchedUser => {
        if (searchedUser !== null && searchedUser === newUser) {
          this.$store.dispatch("game/setUser", newUser);
          this.fetchStarterPlanet(newUser).then(planet => {
            this.$store.dispatch("planet/setId", planet.id);
            this.$store.dispatch("planet/setName", planet.name);
            this.$store.dispatch("planet/setPosX", planet.posx);
            this.$store.dispatch("planet/setPosY", planet.posy);
          });
        } else {
          this.placeholder = "not found";
          this.user = null;
        }
      });
    },
    async fetchUser(user) {
      const response = await UserService.get(user);
      return response.username;
    },
    async fetchStarterPlanet(user) {
      const response = await PlanetsService.starterPlanet(user);
      return response;
    },
    async setLoadSort(loadSort) {
      if (this.loadSort === loadSort) {
        return;
      }
      this.loadSort = loadSort;
      if (loadSort === "battle") {
        this.currentSort = "destroyed_ships_uranium";
        this.currentSortDir = "desc";
        await this.getRanking();
      }
      if (loadSort === "production") {
        this.currentSort = "meta_rate";
        this.currentSortDir = "desc";
        await this.getProductionRanking();
      }
    },
    seasonDuration() {
      let end_date = this.moment(new Date(this.seasonRanking.end_date * 1000));
      let now = this.moment();
      let duration = this.moment.duration(end_date.diff(now));
      if (end_date.isAfter(now)) {
        return this.$t("Season ends in") + " " + duration.humanize();
      } else {
        return this.$t("No Active Season");
      }
    }
  }
};
</script>

<style>
.ranking .material-design-icon > .material-design-icon__svg {
  height: 1.5em;
  width: 1.5em;
}
</style>
