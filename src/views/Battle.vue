<template>
  <div class="battle">
    <h1>{{ $t("Battle") }}</h1>
    <i>{{ $t("Yamato only loses one tier on destruction.") }}</i>
    <div v-if="battle !== null">
      <div v-for="mission in battle" :key="mission.battle_number">
        <h2>
          {{ $t("Mission") }} : {{ mission.mission_id }} {{ $t("Battle") }} :
          {{ mission.battle_number }}
        </h2>
        <p>{{ moment.unix(mission.date, "seconds").format("lll") }},</p>
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
            <th>Struct</th>
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
                <div
                  :id="
                    attacker.structure.toFixed(0) ==
                    mission.initial_attacker_ships[a].structure.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_attacker_ships[a] !== undefined &&
                      mission.initial_attacker_ships[a].structure != 0
                  "
                >
                  <div
                    v-if="mission.initial_attacker_ships[a].structure != 0"
                    :style="{
                      width:
                        (attacker.structure /
                          mission.initial_attacker_ships[a].structure) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div
                  :id="
                    attacker.armor.toFixed(0) ==
                    mission.initial_attacker_ships[a].armor.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_attacker_ships[a] !== undefined &&
                      mission.initial_attacker_ships[a].armor != 0
                  "
                >
                  <div
                    v-if="mission.initial_attacker_ships[a].armor != 0"
                    :style="{
                      width:
                        (attacker.armor /
                          mission.initial_attacker_ships[a].armor) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div
                  :id="
                    attacker.shield.toFixed(0) ==
                    mission.initial_attacker_ships[a].shield.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_attacker_ships[a] !== undefined &&
                      mission.initial_attacker_ships[a].shield != 0
                  "
                >
                  <div
                    v-if="mission.initial_attacker_ships[a].shield != 0"
                    :style="{
                      width:
                        (attacker.shield /
                          mission.initial_attacker_ships[a].shield) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
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
        <p>
          {{ $t("Location") }}:
          {{
            mission.support_mission_id === null
              ? $t("Planet")
              : mission.support_mission_id
          }}
        </p>
        <table>
          <thead>
            <th>Slot</th>
            <th>Ship</th>
            <th>Survivor</th>
            <th>Struct</th>
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
                <div
                  :id="
                    defender.structure.toFixed(0) ==
                    mission.initial_defender_ships[d].structure.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_defender_ships[d] !== undefined &&
                      mission.initial_defender_ships[d].structure != 0
                  "
                >
                  <div
                    v-if="mission.initial_defender_ships[d].structure != 0"
                    :style="{
                      width:
                        (defender.structure /
                          mission.initial_defender_ships[d].structure) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div
                  :id="
                    defender.armor.toFixed(0) ==
                    mission.initial_defender_ships[d].armor.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_defender_ships[d] !== undefined &&
                      mission.initial_defender_ships[d].armor != 0
                  "
                >
                  <div
                    v-if="mission.initial_defender_ships[d].armor != 0"
                    :style="{
                      width:
                        (defender.armor /
                          mission.initial_defender_ships[d].armor) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
                    }"
                  ></div>
                </div>
              </td>
              <td>
                <div
                  :id="
                    defender.shield.toFixed(0) ==
                    mission.initial_defender_ships[d].shield.toFixed(0)
                      ? 'bag-health'
                      : 'bag-health-damaged'
                  "
                  v-if="
                    mission.initial_defender_ships[d] !== undefined &&
                      mission.initial_defender_ships[d].shield != 0
                  "
                >
                  <div
                    v-if="mission.initial_defender_ships[d].shield != 0"
                    :style="{
                      width:
                        (defender.shield /
                          mission.initial_defender_ships[d].shield) *
                          100 +
                        '%'
                    }"
                  ></div>
                  <div
                    v-else
                    :style="{
                      width: 0 + '%'
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
        <hr v-if="battle.length != mission.battle_number" width="20%" />
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
      if (this.$route.name == "battle") {
        await this.getBattle();
      }
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
#bag-health-damaged {
  width: 50px;
  border: 2px solid red;
}
#bag-health div {
  height: 10px;
  background: white;
}
#bag-health-damaged div {
  height: 10px;
  background: red;
}
</style>
