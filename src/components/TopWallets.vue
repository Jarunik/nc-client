<template>
  <div class="topwallets">
    <table>
      <thead>
        <th>
          <chevron-triple-up-icon :title="$t('Rank')" v-tooltip="$t('Rank')" />
        </th>
        <th @click="sort('user')">
          <account-icon :title="$t('User')" v-tooltip="$t('User')" />
        </th>
        <th @click="sort('stardust')">
          <span :style="{ color: '#72bcd4' }">
            <alpha-s-box-icon
              :title="$t('Stardust')"
              v-tooltip="$t('Stardust')"
            />
            <alpha-d-box-icon
              :title="$t('Stardust')"
              v-tooltip="$t('Stardust')"
            />
          </span>
        </th>
        <th @click="sort('percentage')">
          <sack-percent-icon
            :title="$t('Percentage')"
            v-tooltip="$t('Percentage')"
          />
        </th>
      </thead>
      <tbody>
        <tr v-for="(rank, index) in sortedRanking" :key="rank.user">
          <td>{{ index + 1 }}</td>
          <td @click="setUser(rank.user)">{{ rank.user }}</td>
          <td>
            <span :style="{ color: '#72bcd4' }">{{
              Number(rank.stardust / 100000000).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}</span>
          </td>
          <td>
            {{
              Number(rank.percentage).toLocaleString(gameLocale, {
                style: "percent"
              })
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import WalletService from "@/services/wallet";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import AlphaSBoxIcon from "vue-material-design-icons/AlphaSBox.vue";
import AlphaDBoxIcon from "vue-material-design-icons/AlphaDBox.vue";
import ChevronTripleUpIcon from "vue-material-design-icons/ChevronTripleUp.vue";
import SackPercentIcon from "vue-material-design-icons/SackPercent.vue";
import AccountIcon from "vue-material-design-icons/Account.vue";
import { mapState } from "vuex";

export default {
  name: "topwallets",
  components: {
    AlphaSBoxIcon,
    AlphaDBoxIcon,
    ChevronTripleUpIcon,
    AccountIcon,
    SackPercentIcon
  },
  data: function() {
    return {
      ranking: null,
      currentSort: "destroyed_ships_uranium",
      currentSortDir: "desc"
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
      planetId: state => state.planet.id,
      planetName: state => state.planet.name,
      gameLocale: state => state.game.gameLocale
    }),
    sortedRanking() {
      var sortedRanking = this.ranking;
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
      await this.getWalletRanking();
    },
    async getWalletRanking() {
      const response = await WalletService.ranking(200);
      this.ranking = response;
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
