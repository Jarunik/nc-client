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
            <router-link :to="{ path: '/battle/' + battle.mission_id }">{{
              $t("Win")
            }}</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import BattleService from "@/services/battle";
import moment from "moment";

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
      const response = await BattleService.limit(100);
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
