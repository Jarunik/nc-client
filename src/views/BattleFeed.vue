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
        <tr v-for="battle in battles" :key="battle.trx_id">
          <td>{{ moment.unix(battle.date, "seconds").format("lll") }}</td>
          <td>{{ battle.attacker }}</td>
          <td>{{ battle.defender }}</td>
          <td>{{ battle.coal.toFixed(0) }}</td>
          <td>{{ battle.ore.toFixed(0) }}</td>
          <td>{{ battle.copper.toFixed(0) }}</td>
          <td>{{ battle.uranium.toFixed(0) }}</td>
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
  methods: {
    async prepareComponent() {
      await this.getBattles();
    },
    async getBattles() {
      const response = await BattleService.limit(200);
      this.battles = response;
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
