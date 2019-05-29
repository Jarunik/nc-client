<template>
  <div class="battle">
    <h1>{{ $t("Battle") }}</h1>
    <div v-for="mission in battle" :key="mission.mission_id">
      <p>
        {{ $t("Mission") }} : {{ mission.mission_id }} {{ $t("Battle") }} :
        {{ mission.battle_number }}
      </p>
      <h3>{{ $t("Attacker") }} {{ mission.attacker }}</h3>
      <table>
        <thead>
          <th>Slot</th>
          <th>Ship</th>
          <th>Survivor</th>
          <th>Structure</th>
          <th>Armor</th>
          <th>Shield</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Battlecruiser</td>
            <td>1</td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 100 + '%' }"></div>
              </div>
            </td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 100 + '%' }"></div>
              </div>
            </td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 50 + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>{{ $t("Defender") }} {{ mission.defender }}</h3>
      <table>
        <thead>
          <th>Slot</th>
          <th>Ship</th>
          <th>Survivor</th>
          <th>Structure</th>
          <th>Armor</th>
          <th>Shield</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Corvette</td>
            <td>0</td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 0 + '%' }"></div>
              </div>
            </td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 0 + '%' }"></div>
              </div>
            </td>
            <td>
              <div id="bag-health">
                <div :style="{ width: 0 + '%' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <h3>{{ $t("Loot") }}</h3>
      <p>
        C:{{ Number(mission.coal).toFixed(0) }} Fe:{{
          Number(mission.ore).toFixed(0)
        }}
        Cu:{{ Number(mission.copper).toFixed(0) }} U:{{
          Number(mission.uranium).toFixed(0)
        }}
      </p>
    </div>
  </div>
</template>

<script>
import BattleService from "@/services/battle";
import { mapState } from "vuex";

export default {
  name: "battle",
  props: ["missionId"],
  data: function() {
    return {
      battle: null,
      health: 100
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
    })
  },
  methods: {
    async prepareComponent() {
      await this.getBattle();
    },
    async getBattle() {
      const response = await BattleService.all(this.routeUser, this.missionId);
      this.battle = response;
    }
  }
};
</script>

<style>
#bag-health {
  width: 50px;
  border: 2px solid white;
}
#bag-health div {
  height: 10px;
  background: white;
}
</style>
