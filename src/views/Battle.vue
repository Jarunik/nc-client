<template>
  <div class="battle">
    <h1>{{ $t("Battle") }}</h1>
    <div v-if="battle !== null">
      <div v-for="mission in battle" :key="mission.mission_id">
        <p>
          {{ $t("Mission") }} : {{ mission.mission_id }} {{ $t("Battle") }} :
          {{ mission.battle_number }}
        </p>
        <h3>
          {{ $t("Attacker") }} {{ mission.attacker }}
          <font v-if="mission.result === 2" color="green">{{
            $t("Winner")
          }}</font>
          <font v-if="mission.result === 1" color="red">{{ $t("Loser") }}</font>
          <font v-if="mission.result === 0" color="yellow">{{
            $t("Draw")
          }}</font>
        </h3>
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
            <tr
              v-for="(attacker, a) in mission.final_attacker_ships"
              :key="attacker.type"
            >
              <td>{{ attacker.pos }}</td>
              <td>{{ attacker.type }}</td>
              <td>{{ attacker.survivor }} / {{ attacker.n }}</td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (attacker.structure /
                          mission.inital_attacker_ships[a].structure) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (attacker.armor /
                          mission.inital_attacker_ships[a].armor) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (attacker.shield /
                          mission.inital_attacker_ships[a].shield) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <h3>
          {{ $t("Defender") }} {{ mission.defender }}
          <font v-if="mission.result === 2" color="red">{{ $t("Loser") }}</font>
          <font v-if="mission.result === 1" color="green">{{
            $t("Winner")
          }}</font>
          <font v-if="mission.result === 0" color="yellow">{{
            $t("Draw")
          }}</font>
        </h3>
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
            <tr
              v-for="(defender, d) in mission.final_defender_ships"
              :key="defender.type"
            >
              <td>{{ defender.pos }}</td>
              <td>{{ defender.type }}</td>
              <td>{{ defender.survivor }} / {{ defender.n }}</td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (defender.structure /
                          mission.inital_defender_ships[d].structure) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (defender.armor /
                          mission.inital_defender_ships[d].armor) *
                          100 +
                        '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (defender.shield /
                          mission.inital_defender_ships[d].shield) *
                          100 +
                        '%'
                    }"
                  ></div>
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
      const response = await BattleService.all(this.missionId);
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
