<template>
  <div class="battle">
    <h3>{{ $t("Battle") }}</h3>
    <div v-if="battle !== null">
      <div v-for="mission in battle" :key="mission.battle_number">
        <p>
          {{ $t("Mission") }} : {{ mission.mission_id }} {{ $t("Battle") }} :
          {{ mission.battle_number }}
        </p>
        <h3>
          {{ $t("Attacker") }} {{ mission.attacker }}
          <font v-if="mission.result === 2" color="green">{{
            $t("Winner")
          }}</font>
          <font v-if="mission.result === 1" color="red">{{
            $t("Looser")
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
              v-for="(attacker, a) in mission.final_attacker_ships"
              :key="attacker.type"
            >
              <td>{{ attacker.pos }}</td>
              <td>{{ attacker.longname }}</td>
              <td>{{ attacker.survivor }} / {{ attacker.n }}</td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (attacker.structure /
                          mission.initial_attacker_ships[a].structure) *
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
                          mission.initial_attacker_ships[a].armor) *
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
                          mission.initial_attacker_ships[a].shield) *
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
          <font v-if="mission.result === 2" color="red">{{
            $t("Looser")
          }}</font>
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
              <td>{{ defender.longname }}</td>
              <td>{{ defender.survivor }} / {{ defender.n }}</td>
              <td>
                <div id="bag-health">
                  <div
                    :style="{
                      width:
                        (defender.structure /
                          mission.initial_defender_ships[d].structure) *
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
                          mission.initial_defender_ships[d].armor) *
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
                          mission.initial_defender_ships[d].shield) *
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
        <p>
          <router-link :to="{ path: '/replay/' + mission.mission_id }">
            {{ $t("Replay") }}</router-link
          >
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
      battle: null
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
