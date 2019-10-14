<template>
  <div class="battlefeed">
    <h1>{{ $t("Recent Battles") }}</h1>
    <table>
      <thead>
        <th>{{ $t("Date") }}</th>
        <th>{{ $t("Attacker") }}</th>
        <th>{{ $t("Defender") }}</th>
        <th>{{ $t("C") }}</th>
        <th>{{ $t("Fe") }}</th>
        <th>{{ $t("Cu") }}</th>
        <th>{{ $t("U") }}</th>
        <th>{{ $t("Result") }}</th>
      </thead>
      <tbody>
        <tr v-for="battle in battles" :key="battle.mission_id + battle.trx_id">
          <td>{{ moment.unix(battle.date, "seconds").format("lll") }}</td>
          <td @click="setUser(battle.attacker)">{{ battle.attacker }}</td>
          <td @click="setUser(battle.defender)">{{ battle.defender }}</td>
          <td>
            {{
              Number(battle.coal).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
          <td>
            {{
              Number(battle.ore).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
          <td>
            {{
              Number(battle.copper).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
          <td>
            {{
              Number(battle.uranium).toLocaleString(gameLocale, {
                style: "decimal"
              })
            }}
          </td>
          <td>
            <router-link
              v-if="battle.initial_defender_ships.length == 0"
              :to="{ path: '/battle/' + battle.mission_id }"
              >{{ $t("Loot") }}
            </router-link>
            <router-link
              v-if="
                battle.result === 2 &&
                  !battle.initial_defender_ships.length == 0
              "
              :to="{ path: '/battle/' + battle.mission_id }"
              >{{ $t("Victory") }}
            </router-link>
            <router-link
              v-if="battle.result === 1"
              :to="{ path: '/battle/' + battle.mission_id }"
              >{{ $t("Defeat") }}</router-link
            >
            <router-link
              v-if="battle.result === 0"
              :to="{ path: '/battle/' + battle.mission_id }"
              >{{ $t("Standoff") }}</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BattleService from "@/services/battle";
import UserService from "@/services/user";
import PlanetsService from "@/services/planets";
import { mapState } from "vuex";

export default {
  name: "battlefeed",
  data: function() {
    return {
      battles: null
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
      gameLocale: state => state.game.gameLocale
    })
  },
  methods: {
    async prepareComponent() {
      await this.getBattles();
    },
    async getBattles() {
      const response = await BattleService.limit(200);
      this.battles = response;
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
