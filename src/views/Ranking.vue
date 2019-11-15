<template>
  <div class="ranking">
    <h1>{{ $t("Ranking") }}</h1>
    <P
      ><i>{{
        $t("Click users to view the game from their perspective.")
      }}</i></P
    >
    <p>
      <span @click="setLoadSort('production')" class="pointer"
        ><font v-if="loadSort === 'production'" color="green">{{
          $t("Production")
        }}</font
        ><font v-else>{{ $t("Production") }}</font></span
      >
      |
      <span @click="setLoadSort('battle')" class="pointer"
        ><font v-if="loadSort === 'battle'" color="green">{{
          $t("Battle")
        }}</font
        ><font v-else>{{ $t("Battle") }}</font></span
      >
      |
      <span @click="setLoadSort('topwallets')" class="pointer"
        ><font v-if="loadSort === 'topwallets'" color="green">{{
          $t("Top Wallets")
        }}</font
        ><font v-else>{{ $t("Top Wallets") }}</font></span
      >
    </p>
    <template v-if="loadSort === 'production' || loadSort === 'battle'">
      <table>
        <thead>
          <th>
            <chevron-triple-up-icon
              :title="$t('Rank')"
              v-tooltip="$t('Rank')"
            />
          </th>
          <th @click="sort('user')">
            <account-icon :title="$t('User')" v-tooltip="$t('User')" />
          </th>
          <th @click="sort('meta_rate')">
            <alpha-u-box-icon
              :title="$t('Production')"
              v-tooltip="$t('Production')"
            />
          </th>
          <th @click="sort('meta_skill')">
            <school-icon :title="$t('Skill')" v-tooltip="$t('Skill')" />
          </th>
          <th @click="sort('planets')">
            <earth-icon :title="$t('Planets')" v-tooltip="$t('Planets')" />
          </th>
          <th @click="sort('explorations')">
            <magnify-icon
              :title="$t('Explorations')"
              v-tooltip="$t('Explorations')"
            />
          </th>
          <th @click="sort('ships')">
            <rocket-icon :title="$t('Ships')" v-tooltip="$t('Ships')" />
          </th>
          <th @click="sort('destroyed_ships_uranium')">
            <nuke-icon :title="$t('Destroyed')" v-tooltip="$t('Destroyed')" />
          </th>
        </thead>
        <tbody>
          <tr v-for="(rank, index) in sortedRanking" :key="rank.user">
            <td>{{ index + 1 }}</td>
            <td @click="setUser(rank.user)">{{ rank.user }}</td>
            <td>
              {{
                Number(rank.meta_rate).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(rank.meta_skill).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(rank.planets).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(rank.explorations).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(rank.ships).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(rank.destroyed_ships_uranium).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <TopWallets v-if="loadSort === 'topwallets'" />
  </div>
</template>

<script>
import RankingService from "@/services/ranking";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import AlphaUBoxIcon from "vue-material-design-icons/AlphaUBox.vue";
import ChevronTripleUpIcon from "vue-material-design-icons/ChevronTripleUp.vue";
import AccountIcon from "vue-material-design-icons/Account.vue";
import EarthIcon from "vue-material-design-icons/Earth.vue";
import MagnifyIcon from "vue-material-design-icons/Magnify.vue";
import RocketIcon from "vue-material-design-icons/Rocket.vue";
import SchoolIcon from "vue-material-design-icons/School.vue";
import NukeIcon from "vue-material-design-icons/Nuke.vue";
import TopWallets from "@/components/TopWallets.vue";
import { mapState } from "vuex";

export default {
  name: "ranking",
  components: {
    AlphaUBoxIcon,
    ChevronTripleUpIcon,
    AccountIcon,
    EarthIcon,
    MagnifyIcon,
    RocketIcon,
    SchoolIcon,
    NukeIcon,
    TopWallets
  },
  data: function() {
    return {
      ranking: null,
      currentSort: "destroyed_ships_uranium",
      currentSortDir: "desc",
      loadSort: "battle"
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
      if (this.$route.name == "ranking") {
        await this.getRanking();
      }
    },
    async getRanking() {
      const response = await RankingService.sortDestroyed(200);
      this.ranking = response;
    },
    async getProductionRanking() {
      const response = await RankingService.limit(200);
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
