<template>
  <div class="simulator">
    <h1>{{ $t("Simulator") }}</h1>
    <i>{{ $t("The simulator does not consider skills.") }}</i>
    <h2>
      {{ $t("Attacker") }}
      <font
        v-if="currentAttacker === this.slots && currentDefender === this.slots"
        color="yellow"
        >{{ $t("Draw") }}</font
      >
      <span v-else>
        <font v-if="currentDefender === this.slots" color="green">
          {{ $t("Winner") }}
        </font>
        <font v-if="currentAttacker === this.slots" color="red">
          {{ $t("Looser") }}
        </font>
      </span>
    </h2>
    <table>
      <thead>
        <th>{{ $t("Tank") }}</th>
        <th>{{ $t("Shooter") }}</th>
        <th>{{ $t("Order") }}</th>
        <th>{{ $t("Ship") }}</th>
        <th>{{ $t("Quantity") }}</th>
        <th>{{ $t("Structure") }}</th>
        <th>{{ $t("Armor") }}</th>
        <th>{{ $t("Shield") }}</th>
        <th>{{ $t("Rocket") }}</th>
        <th>{{ $t("Bullet") }}</th>
        <th>{{ $t("Laser") }}</th>
        <th>{{ $t("Survivor") }}</th>
      </thead>
      <tbody>
        <tr v-for="(attacker, index) in attackers" :key="attacker.id">
          <td v-show="attacker.id !== 'end'">
            <div v-if="index === currentAttacker">
              <shield-airplane-icon :title="$t('Tank')" />
            </div>
          </td>
          <td v-show="attacker.id !== 'end'">
            <div v-if="turn === 'Attacker' && index === currentAttackerShooter">
              <pistol-icon :title="$t('Shooter')" />
            </div>
          </td>
          <td v-show="attacker.id !== 'end'">
            <button v-on:click="up('attacker', attacker)">↑</button>
            <button v-on:click="down('attacker', attacker)">↓</button>
          </td>
          <td v-show="attacker.id !== 'end'">
            <select v-model="attacker.name" @change="prepare">
              <option v-for="ship in ships" :key="ship.name">{{
                ship.name
              }}</option>
            </select>
          </td>
          <td v-show="attacker.id !== 'end'">
            <input
              type="number"
              v-model="attacker.quantity"
              v-on:input="prepare"
            />
          </td>
          <td>
            <div v-if="attacker.structure > 0">
              <font v-if="attacker.structure === 0" color="red">{{
                attacker.structure.toFixed(0)
              }}</font>
              <font v-else>{{ attacker.structure.toFixed(0) }}</font>
            </div>
          </td>
          <td>
            <div v-if="attacker.armor > 0">{{ attacker.armor.toFixed(0) }}</div>
          </td>
          <td>
            <div v-if="attacker.shield > 0">
              {{ attacker.shield.toFixed(0) }}
            </div>
          </td>
          <td>
            <div v-if="attacker.rocket > 0">
              <font color="orange">{{ attacker.rocket }}</font>
            </div>
          </td>
          <td>
            <div v-if="attacker.bullet > 0">
              <font color="orange">{{ attacker.bullet }}</font>
            </div>
          </td>
          <td>
            <div v-if="attacker.laser > 0">
              <font color="orange">{{ attacker.laser }}</font>
            </div>
          </td>
          <td v-show="attacker.id !== 'end'">
            <div v-if="attacker.survivor > 0">
              <font v-if="attacker.survivor > 0" color="green">{{
                attacker.survivor
              }}</font>
              <div v-else>{{ attacker.survivor }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>
      {{ $t("Defender") }}
      <font
        v-if="currentAttacker === this.slots && currentDefender === this.slots"
        color="yellow"
        >{{ $t("Draw") }}</font
      >
      <span v-else>
        <font v-if="currentAttacker === slots" color="green">
          {{ $t("Winner") }}
        </font>
        <font v-if="currentDefender === slots" color="red">
          {{ $t("Looser") }}
        </font>
      </span>
    </h2>
    <table>
      <thead>
        <th>{{ $t("Tank") }}</th>
        <th>{{ $t("Shooter") }}</th>
        <th>{{ $t("Order") }}</th>
        <th>{{ $t("Ship") }}</th>
        <th>{{ $t("Quantity") }}</th>
        <th>{{ $t("Structure") }}</th>
        <th>{{ $t("Armor") }}</th>
        <th>{{ $t("Shield") }}</th>
        <th>{{ $t("Rocket") }}</th>
        <th>{{ $t("Bullet") }}</th>
        <th>{{ $t("Laser") }}</th>
        <th>{{ $t("Survivor") }}</th>
      </thead>
      <tbody>
        <tr v-for="(defender, index) in defenders" :key="defender.id">
          <td v-show="defender.id !== 'end'">
            <div v-if="index === currentDefender">
              <shield-airplane-icon :title="$t('Tank')" />
            </div>
          </td>
          <td v-show="defender.id !== 'end'">
            <div v-if="turn === 'Defender' && index === currentDefenderShooter">
              <pistol-icon :title="$t('Shooter')" />
            </div>
          </td>
          <td v-show="defender.id !== 'end'">
            <button v-on:click="up('defender', defender)">↑</button>
            <button v-on:click="down('defender', defender)">↓</button>
          </td>
          <td v-show="defender.id !== 'end'">
            <select v-model="defender.name" @change="prepare">
              <option v-for="ship in ships" :key="ship.name">{{
                ship.name
              }}</option>
            </select>
          </td>
          <td v-show="defender.id !== 'end'" v-on:input="prepare">
            <input type="number" v-model="defender.quantity" />
          </td>
          <td>
            <div v-if="defender.structure > 0">
              <font v-if="defender.structure === 0" color="red">{{
                defender.structure.toFixed(0)
              }}</font>
              <font v-else>{{ defender.structure.toFixed(0) }}</font>
            </div>
          </td>
          <td>
            <div v-if="defender.armor > 0">{{ defender.armor.toFixed(0) }}</div>
          </td>
          <td>
            <div v-if="defender.shield > 0">
              {{ defender.shield.toFixed(0) }}
            </div>
          </td>
          <td>
            <div v-if="defender.rocket > 0">
              <font color="orange">{{ defender.rocket }}</font>
            </div>
          </td>
          <td>
            <div v-if="defender.bullet > 0">
              <font color="orange">{{ defender.bullet }}</font>
            </div>
          </td>
          <td>
            <div v-if="defender.laser > 0">
              <font color="orange">{{ defender.laser }}</font>
            </div>
          </td>
          <td>
            <div v-if="defender.survivor > 0">
              <font v-if="defender.survivor > 0" color="green">{{
                defender.survivor
              }}</font>
              <div v-else>{{ defender.survivor }}</div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <h2>{{ $t("Battle") }}</h2>
    <button v-on:click="buildShipList()">{{ $t("Prepare") }}</button>
    <button v-on:click="battle()">{{ $t("Play Turn") }}</button>
    <button v-on:click="auto()">{{ $t("Play Battle") }}</button>
    <button v-on:click="reset()">{{ $t("Reset") }}</button>
    <h2>{{ $t("Battle Log") }}</h2>
    <p>{{ $t(result) }}</p>
    <p>{{ $t("Next Turn") }}: {{ turn }}</p>
    <p>{{ $t("Round") }}: {{ round }}</p>
  </div>
</template>

<script>
import simShips from "@/data/simShips.js";
import simAttackers from "@/data/simAttackers.js";
import simDefenders from "@/data/simDefenders.js";
import simAttackerList from "@/data/simAttackerList.js";
import simDefenderList from "@/data/simDefenderList.js";
import PistolIcon from "vue-material-design-icons/Pistol.vue";
import ShieldAirplaneIcon from "vue-material-design-icons/ShieldAirplane.vue";

export default {
  name: "Simulator",
  components: {
    PistolIcon,
    ShieldAirplaneIcon
  },
  data() {
    return {
      ships: simShips,
      rates: [
        { id: 1, attack: "rocket", defense: "structure", rate: 4 },
        { id: 2, attack: "rocket", defense: "armor", rate: 2 },
        { id: 3, attack: "rocket", defense: "shield", rate: 1 },
        { id: 4, attack: "laser", defense: "structure", rate: 2 },
        { id: 5, attack: "laser", defense: "armor", rate: 1 },
        { id: 6, attack: "laser", defense: "shield", rate: 4 },
        { id: 7, attack: "bullet", defense: "structure", rate: 1 },
        { id: 8, attack: "bullet", defense: "armor", rate: 4 },
        { id: 9, attack: "bullet", defense: "shield", rate: 2 }
      ],
      attackers: simAttackers,
      defenders: simDefenders,
      attackerList: simAttackerList,
      defenderList: simDefenderList,
      turn: "Attacker",
      currentAttacker: 0,
      currentDefender: 0,
      currentAttackerShooter: 0,
      currentDefenderShooter: 0,
      round: 0,
      result: "Ready",
      shieldregen: 0,
      shieldregreduce: 0.005,
      armorrep: 0,
      armorregreduce: 0.01,
      piercerateshield: 1,
      pierceratearmor: 1,
      pierceratestructure: 1,
      slots: 8,
      attackerSlots: 0,
      defenderSlots: 0,
      prepared: false,
      interval: null
    };
  },
  methods: {
    // Component
    prepare: function() {
      this.attackerList = [];
      this.defenderList = [];
      this.attackers = simAttackers;
      this.defenders = simDefenders;
      this.attackerSlots = 0;
      this.defenderSlots = 0;
      this.attackers.forEach(attacker => {
        let aship = this.ships.filter(s => {
          return s.name === attacker.name;
        });
        attacker.structure = attacker.quantity * aship[0].structure;
        attacker.armor = attacker.quantity * aship[0].armor;
        attacker.shield = attacker.quantity * aship[0].shield;
        attacker.rocket = attacker.quantity * aship[0].rocket;
        attacker.bullet = attacker.quantity * aship[0].bullet;
        attacker.laser = attacker.quantity * aship[0].laser;
        attacker.survivor = attacker.quantity;
        // Add expanded ship list to have one slot per ship
        for (let i = 0; i < attacker.quantity; i++) {
          let addAttacker = {
            id:
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15),
            name: attacker.name,
            class: attacker.class,
            quantity: 1,
            structure: aship[0].structure,
            armor: aship[0].armor,
            shield: aship[0].shield,
            rocket: aship[0].rocket,
            bullet: aship[0].bullet,
            laser: aship[0].laser,
            survivor: 1
          };
          this.attackerList.push(addAttacker);
          this.attackerSlots = this.attackerSlots + 1;
        }
      });
      this.defenders.forEach(defender => {
        let dship = this.ships.filter(s => {
          return s.name === defender.name;
        });
        defender.structure = defender.quantity * dship[0].structure;
        defender.armor = defender.quantity * dship[0].armor;
        defender.shield = defender.quantity * dship[0].shield;
        defender.rocket = defender.quantity * dship[0].rocket;
        defender.bullet = defender.quantity * dship[0].bullet;
        defender.laser = defender.quantity * dship[0].laser;
        defender.survivor = defender.quantity;
        for (let j = 0; j < defender.quantity; j++) {
          let addDefender = {
            id:
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15),
            name: defender.name,
            class: defender.class,
            quantity: 1,
            structure: dship[0].structure,
            armor: dship[0].armor,
            shield: dship[0].shield,
            rocket: dship[0].rocket,
            bullet: dship[0].bullet,
            laser: dship[0].laser,
            survivor: 1
          };
          this.defenderList.push(addDefender);
          this.defenderSlots = this.defenderSlots + 1;
        }
      });
      this.slots = Math.max(this.attackerSlots, this.defenderSlots);
      // Add filler slots
      if (this.attackerSlots > this.defenderSlots) {
        let numberToAdd = this.attackerSlots - this.defenderSlots;
        for (let k = 0; k < numberToAdd; k++) {
          let addDefender = {
            id:
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15),
            name: "end",
            class: "end",
            quantity: 0,
            structure: 0,
            armor: 0,
            shield: 0,
            rocket: 0,
            bullet: 0,
            laser: 0,
            survivor: 0
          };
          this.defenderList.push(addDefender);
        }
      }
      if (this.defenderSlots > this.attackerSlots) {
        let numbertoAdd = this.defenderSlots - this.attackerSlots;
        for (let l = 0; l < numbertoAdd; l++) {
          let addAttacker = {
            id:
              Math.random()
                .toString(36)
                .substring(2, 15) +
              Math.random()
                .toString(36)
                .substring(2, 15),
            name: "end",
            class: "end",
            quantity: 0,
            structure: 0,
            armor: 0,
            shield: 0,
            rocket: 0,
            bullet: 0,
            laser: 0,
            survivor: 0
          };
          this.attackerList.push(addAttacker);
        }
      }
      // Add last slot for "stop" logic
      let addDefender = {
        id:
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15),
        name: "end",
        class: "end",
        quantity: 0,
        structure: 0,
        armor: 0,
        shield: 0,
        rocket: 0,
        bullet: 0,
        laser: 0,
        survivor: 0
      };
      let addAttacker = {
        id:
          Math.random()
            .toString(36)
            .substring(2, 15) +
          Math.random()
            .toString(36)
            .substring(2, 15),
        name: "end",
        class: "end",
        quantity: 0,
        structure: 0,
        armor: 0,
        shield: 0,
        rocket: 0,
        bullet: 0,
        laser: 0,
        survivor: 0
      };
      this.attackerList.push(addAttacker);
      this.defenderList.push(addDefender);
      this.turn = "Attacker";
      this.round = 0;
      this.currentAttacker = 0;
      this.currentDefender = 0;
      this.currentAttackerShooter = 0;
      this.currentDefenderShooter = 0;
      this.result = "Ready";
      this.prepared = true;
    },
    reset: function() {
      clearInterval(this.interval);
      this.prepare();
    },
    buildShipList() {
      this.prepare();
      this.attackers = this.attackerList;
      this.defenders = this.defenderList;
    },
    rate: function(attack, defense) {
      var rate = this.rates.filter(
        r => r.attack === attack && r.defense === defense
      );
      return rate[0].rate;
    },
    auto: function() {
      this.buildShipList();
      this.interval = setInterval(() => {
        this.battle();
      }, 100);
      this.battle();
    },
    up(who, ship) {
      if (who === "attacker") {
        var index = this.attackers.indexOf(ship);
        if (index === 0) {
          return;
        }
        if (index === this.slots) {
          return;
        }
        this.attackers[index] = this.attackers[index - 1];
        this.attackers[index - 1] = ship;
      } else {
        var index2 = this.defenders.indexOf(ship);
        if (index2 === 0) {
          return;
        }
        if (index2 === this.slots) {
          return;
        }
        this.defenders[index2] = this.defenders[index2 - 1];
        this.defenders[index2 - 1] = ship;
      }
      this.$forceUpdate();
    },
    down(who, ship) {
      if (who === "attacker") {
        var index = this.attackers.indexOf(ship);
        if (index === this.slots) {
          return;
        }
        if (index === this.slots - 1) {
          return;
        }
        this.attackers[index] = this.attackers[index + 1];
        this.attackers[index + 1] = ship;
      } else {
        var index2 = this.defenders.indexOf(ship);
        if (index2 === this.slots) {
          return;
        }
        if (index2 === this.slots - 1) {
          return;
        }
        this.defenders[index2] = this.defenders[index2 + 1];
        this.defenders[index2 + 1] = ship;
      }
      this.$forceUpdate();
    },
    battle: function() {
      var attackerIndex = this.currentAttacker;
      var defenderIndex = this.currentDefender;

      // Pepare if necessary
      if (!this.prepared) {
        this.prepare();
      }

      // Check if it is already Game Over
      if (attackerIndex === this.slots || defenderIndex === this.slots) {
        if (attackerIndex === this.slots) {
          this.result = "Defender won battle. Game Over";
          clearInterval(this.interval);
        }
        if (defenderIndex === this.slots) {
          this.result = "Attacker won battle. Game Over";
          clearInterval(this.interval);
        }

        return;
      }

      // Move through Attacker Tanks
      if (
        this.attackers[attackerIndex].structure === 0 ||
        this.attackers[attackerIndex].quantity === 0
      ) {
        if (typeof this.attackers[attackerIndex + 1] !== "undefined") {
          attackerIndex = attackerIndex + 1;
          this.currentAttacker = attackerIndex;
          this.currentAttackerShooter = attackerIndex;
        }
      }

      // Move through Defender Tanks
      if (
        this.defenders[defenderIndex].structure === 0 ||
        this.defenders[defenderIndex].quantity === 0
      ) {
        if (typeof this.defenders[defenderIndex + 1] !== "undefined") {
          defenderIndex = defenderIndex + 1;
          this.currentDefender = defenderIndex;
          this.currentDefenderShooter = defenderIndex;
        }
      }

      var a = this.attackers[attackerIndex];
      var d = this.defenders[defenderIndex];
      var as = this.attackers[this.currentAttackerShooter];
      var ds = this.defenders[this.currentDefenderShooter];

      // Skip Empty Slots
      if (
        a.structure < 0 ||
        d.structure < 0 ||
        a.survivor === 0 ||
        d.survivor === 0
      ) {
        this.battle();
        // Fight
      } else {
        if (this.turn === "Attacker") {
          // Attacker Shoots
          if (as.structure > 0) {
            let leftOver = { laser: 0, bullet: 0, rocket: 0 };
            this.applyDamage(as, d, this.defenders, defenderIndex, leftOver);
            // Pierce through Defenders
            while (
              leftOver.laser > 0 ||
              leftOver.bullet > 0 ||
              leftOver.rocket > 0
            ) {
              // Search next Defender
              if (
                this.defenders[defenderIndex].structure === 0 ||
                this.defenders[defenderIndex].quantity === 0
              ) {
                if (typeof this.defenders[defenderIndex + 1] !== "undefined") {
                  defenderIndex = defenderIndex + 1;
                  this.currentDefender = defenderIndex;
                } else {
                  leftOver = { laser: 0, bullet: 0, rocket: 0 };
                }
              }
              d = this.defenders[defenderIndex];
              this.applyDamage(as, d, this.defenders, defenderIndex, leftOver);
            }
          }
        }

        if (this.turn === "Defender") {
          // Defender Shoots
          if (ds.structure > 0) {
            let leftOver = { laser: 0, bullet: 0, rocket: 0 };
            this.applyDamage(ds, a, this.attackers, attackerIndex, leftOver);
            // Pierce through Attackers
            while (
              leftOver.laser > 0 ||
              leftOver.bullet > 0 ||
              leftOver.rocket > 0
            ) {
              // Search next Defender
              if (
                this.attackers[attackerIndex].structure === 0 ||
                this.attackers[attackerIndex].quantity === 0
              ) {
                if (typeof this.attackers[attackerIndex + 1] !== "undefined") {
                  attackerIndex = attackerIndex + 1;
                  this.currentAttacker = attackerIndex;
                } else {
                  leftOver = { laser: 0, bullet: 0, rocket: 0 };
                }
              }
              a = this.attackers[attackerIndex];
              this.applyDamage(ds, a, this.attackers, attackerIndex, leftOver);
            }
          }
        }

        // Log destroyed ship
        if (this.defenders[defenderIndex].structure === 0) {
          this.result = "Attacker destroyed a ship";
        }
        if (this.attackers[attackerIndex].structure === 0) {
          this.result = "Defender destroyed a ship";
        }

        // Move through Attacker Shooters
        if (this.turn === "Attacker") {
          if (this.currentAttackerShooter !== this.slots) {
            this.currentAttackerShooter = this.currentAttackerShooter + 1;
          }

          while (
            this.attackers[this.currentAttackerShooter].survivor === 0 &&
            this.currentAttackerShooter !== this.slots
          ) {
            this.currentAttackerShooter = this.currentAttackerShooter + 1;
          }

          if (
            this.currentAttackerShooter === this.slots &&
            this.currentDefenderShooter === this.slots
          ) {
            this.currentAttackerShooter = this.currentAttacker;
            this.currentDefenderShooter = this.currentDefender;
          }
        }
        // Move through Defender Shooters
        if (this.turn === "Defender") {
          if (this.currentDefenderShooter !== this.slots) {
            this.currentDefenderShooter = this.currentDefenderShooter + 1;
          }

          while (
            this.defenders[this.currentDefenderShooter].survivor === 0 &&
            this.currentDefenderShooter !== this.slots
          ) {
            this.currentDefenderShooter = this.currentDefenderShooter + 1;
          }

          if (
            this.currentDefenderShooter === this.slots &&
            this.currentAttackerShooter === this.slots
          ) {
            this.currentDefenderShooter = this.currentDefender;
            this.currentAttackerShooter = this.currentAttacker;
          }
        }

        // Switch Shooting Right
        if (this.turn === "Attacker") {
          this.turn = "Defender";
        } else if (this.turn === "Defender") {
          this.turn = "Attacker";
        }

        //Skip if already through all own shooters
        if (this.currentAttackerShooter === this.slots) {
          this.turn = "Defender";
        }
        if (this.currentDefenderShooter === this.slots) {
          this.turn = "Attacker";
        }

        //Count up Round
        this.round = this.round + 1;
      }
    },
    applyDamage(shooter, tank, tankArray, tankIndex, leftOver) {
      // Left Overs have to be in raw damage without Bonus !
      let lolaser = 0;
      let lobullet = 0;
      let lorocket = 0;
      let lolaser2 = 0;
      let lobullet2 = 0;
      let lorocket2 = 0;
      let damageLaser = 0;
      let damageBullet = 0;
      let damageRocket = 0;
      let lOver = false;

      let shipStats = this.ships.filter(s => {
        return s.name === tank.name;
      });
      if (leftOver.laser > 0) {
        damageLaser = leftOver.laser;
        lOver = true;
      } else {
        damageLaser = shooter.laser;
      }
      if (leftOver.bullet > 0) {
        damageBullet = leftOver.bullet;
        lOver = true;
      } else {
        damageBullet = shooter.bullet;
      }
      if (leftOver.rocket > 0) {
        damageRocket = leftOver.rocket;
        lOver = true;
      } else {
        damageRocket = shooter.rocket;
      }
      if (tank.shield > 0) {
        if (damageLaser * this.rate("laser", "shield") > tank.shield) {
          lolaser =
            Math.max(
              (damageLaser * this.rate("laser", "shield") - tank.shield) /
                this.rate("laser", "shield"),
              0
            ) * this.piercerateshield;
          if (lOver) {
            leftOver.laser = lolaser;
          }
        } else {
          lolaser = 0;
          if (lOver) {
            leftOver.laser = lolaser;
          }
        }
        if (damageBullet * this.rate("bullet", "shield") > tank.shield) {
          lobullet =
            Math.max(
              (damageBullet * this.rate("bullet", "shield") - tank.shield) /
                this.rate("bullet", "shield"),
              0
            ) * this.piercerateshield;
          if (lOver) {
            leftOver.bullet = lobullet;
          }
        } else {
          lobullet = 0;
          if (lOver) {
            leftOver.bullet = lobullet;
          }
        }
        if (damageRocket * this.rate("rocket", "shield") > tank.shield) {
          lorocket =
            Math.max(
              (damageRocket * this.rate("rocket", "shield") - tank.shield) /
                this.rate("rocket", "shield"),
              0
            ) * this.piercerateshield;
          if (lOver) {
            leftOver.rocket = lorocket;
          }
        } else {
          lorocket = 0;
          if (lOver) {
            leftOver.rocket = lorocket;
          }
        }
        tank.shield = Math.max(
          tank.shield - damageLaser * this.rate("laser", "shield"),
          0
        );
        tank.shield = Math.max(
          tank.shield - damageBullet * this.rate("bullet", "shield"),
          0
        );
        tank.shield = Math.max(
          tank.shield - damageRocket * this.rate("rocket", "shield"),
          0
        );
        // Pierce Armor
        if (tank.shield === 0) {
          if (lolaser > tank.armor) {
            lolaser2 =
              Math.max(
                (lolaser * this.rate("laser", "armor") - tank.armor) /
                  this.rate("laser", "armor"),
                0
              ) * this.pierceratearmor;
            if (lOver) {
              leftOver.laser = lolaser2;
            }
          } else {
            lolaser2 = 0;
            if (lOver) {
              leftOver.laser = lolaser2;
            }
          }
          if (lobullet > tank.armor) {
            lobullet2 =
              Math.max(
                (lobullet * this.rate("bullet", "armor") - tank.armor) /
                  this.rate("bullet", "armor"),
                0
              ) * this.pierceratearmor;
            if (lOver) {
              leftOver.bullet = lobullet2;
            }
          } else {
            lobullet2 = 0;
            if (lOver) {
              leftOver.bullet = lobullet2;
            }
          }
          if (lorocket > tank.armor) {
            lorocket2 =
              Math.max(
                (lorocket * this.rate("rocket", "armor") - tank.armor) /
                  this.rate("rocket", "armor"),
                0
              ) * this.pierceratearmor;
            if (lOver) {
              leftOver.rocket = lorocket2;
            }
          } else {
            lorocket2 = 0;
            if (lOver) {
              leftOver.rocket = lorocket2;
            }
          }
          tank.armor = Math.max(
            tank.armor - lolaser * this.rate("laser", "armor"),
            0
          );
          tank.armor = Math.max(
            tank.armor - lobullet * this.rate("bullet", "armor"),
            0
          );
          tank.armor = Math.max(
            tank.armor - lorocket * this.rate("rocket", "armor"),
            0
          );
          // Pierce structure
          if (tank.armor === 0) {
            if (lolaser2 > tank.structure) {
              leftOver.laser =
                Math.max(
                  (lolaser2 * this.rate("laser", "structure") -
                    tank.structure) /
                    this.rate("laser", "structure"),
                  0
                ) * this.pierceratestructure;
            } else {
              leftOver.laser = 0;
            }
            if (lobullet2 > tank.structure) {
              leftOver.bullet =
                Math.max(
                  (lobullet2 * this.rate("bullet", "structure") -
                    tank.structure) /
                    this.rate("bullet", "structure"),
                  0
                ) * this.pierceratestructure;
            } else {
              leftOver.bullet = 0;
            }
            if (lorocket2 > tank.structure) {
              leftOver.rocket =
                Math.max(
                  (lorocket2 * this.rate("rocket", "structure") -
                    tank.structure) /
                    this.rate("rocket", "structure"),
                  0
                ) * this.pierceratestructure;
            } else {
              leftOver.rocket = 0;
            }
            tank.structure = Math.max(
              tank.structure - lolaser2 * this.rate("laser", "structure"),
              0
            );
            tank.structure = Math.max(
              tank.structure - lobullet2 * this.rate("laser", "structure"),
              0
            );
            tank.structure = Math.max(
              tank.structure - lorocket2 * this.rate("laser", "structure"),
              0
            );
          }
        }
      } else if (tank.armor > 0) {
        if (damageLaser * this.rate("laser", "armor") > tank.armor) {
          lolaser =
            Math.max(
              (damageLaser * this.rate("laser", "armor") - tank.armor) /
                this.rate("laser", "armor"),
              0
            ) * this.pierceratearmor;
          if (lOver) {
            leftOver.laser = lolaser;
          }
        } else {
          lolaser = 0;
          if (lOver) {
            leftOver.laser = lolaser;
          }
        }
        if (damageBullet * this.rate("bullet", "armor") > tank.armor) {
          lobullet =
            Math.max(
              (damageBullet * this.rate("bullet", "armor") - tank.armor) /
                this.rate("bullet", "armor"),
              0
            ) * this.pierceratearmor;
          if (lOver) {
            leftOver.bullet = lobullet;
          }
        } else {
          lobullet = 0;
          if (lOver) {
            leftOver.bullet = lobullet;
          }
        }
        if (damageRocket * this.rate("rocket", "armor") > tank.armor) {
          lorocket =
            Math.max(
              (damageRocket * this.rate("rocket", "armor") - tank.armor) /
                this.rate("rocket", "armor"),
              0
            ) * this.pierceratearmor;
          if (lOver) {
            leftOver.rocket = lorocket;
          }
        } else {
          lorocket = 0;
          if (lOver) {
            leftOver.rocket = lorocket;
          }
        }
        tank.armor = Math.max(
          tank.armor - damageLaser * this.rate("laser", "armor"),
          0
        );
        tank.armor = Math.max(
          tank.armor - damageBullet * this.rate("bullet", "armor"),
          0
        );
        tank.armor = Math.max(
          tank.armor - damageRocket * this.rate("rocket", "armor"),
          0
        );
        // Pierce structure
        if (tank.armor === 0) {
          if (lolaser > tank.structure) {
            leftOver.laser =
              Math.max(
                (lolaser * this.rate("laser", "structure") - tank.structure) /
                  this.rate("laser", "structure"),
                0
              ) * this.pierceratestructure;
          } else {
            leftOver.laser = 0;
          }
          if (lobullet > tank.structure) {
            leftOver.bullet =
              Math.max(
                (lobullet * this.rate("bullet", "structure") - tank.structure) /
                  this.rate("bullet", "structure"),
                0
              ) * this.pierceratestructure;
          } else {
            leftOver.bullet = 0;
          }
          if (lorocket > tank.structure) {
            leftOver.rocket =
              Math.max(
                (lorocket * this.rate("rocket", "structure") - tank.structure) /
                  this.rate("rocket", "structure"),
                0
              ) * this.pierceratestructure;
          } else {
            leftOver.rocket = 0;
          }
          tank.structure = Math.max(
            tank.structure - lolaser * this.rate("laser", "structure"),
            0
          );
          tank.structure = Math.max(
            tank.structure - lobullet * this.rate("bullet", "structure"),
            0
          );
          tank.structure = Math.max(
            tank.structure - lorocket * this.rate("rocket", "structure"),
            0
          );
        }
      } else if (tank.structure > 0) {
        if (damageLaser * this.rate("laser", "structure") > tank.structure) {
          leftOver.laser =
            Math.max(
              (damageLaser * this.rate("laser", "structure") - tank.structure) /
                this.rate("laser", "structure"),
              0
            ) * this.pierceratestructure;
        } else {
          leftOver.laser = 0;
        }
        if (damageBullet * this.rate("bullet", "structure") > tank.structure) {
          leftOver.bullet =
            Math.max(
              (damageBullet * this.rate("bullet", "structure") -
                tank.structure) /
                this.rate("bullet", "structure"),
              0
            ) * this.pierceratestructure;
        } else {
          leftOver.bullet = 0;
        }
        if (damageRocket * this.rate("rocket", "structure") > tank.structure) {
          leftOver.rocket =
            Math.max(
              (damageRocket * this.rate("rocket", "structure") -
                tank.structure) /
                this.rate("rocket", "structure"),
              0
            ) * this.pierceratestructure;
        } else {
          leftOver.rocket = 0;
        }
        tank.structure = Math.max(
          tank.structure - damageLaser * this.rate("laser", "structure"),
          0
        );
        tank.structure = Math.max(
          tank.structure - damageBullet * this.rate("bullet", "structure"),
          0
        );
        tank.structure = Math.max(
          tank.structure - damageRocket * this.rate("rocket", "structure"),
          0
        );
      }
      if (tank.structure !== "undefined") {
        tankArray[tankIndex].survivor = Math.ceil(
          tank.structure / shipStats[0].structure
        );
      }
      tankArray[tankIndex].laser =
        shipStats[0].laser * this.defenders[tankIndex].survivor;
      tankArray[tankIndex].bullet =
        shipStats[0].bullet * this.defenders[tankIndex].survivor;
      tankArray[tankIndex].rocket =
        shipStats[0].rocket * this.defenders[tankIndex].survivor;
      tankArray[tankIndex].structure = tank.structure;
      tankArray[tankIndex].armor = tank.armor;
      if (tankArray[tankIndex].armor !== 0) {
        tankArray[tankIndex].armor = Math.min(
          tankArray[tankIndex].armor +
            shipStats[0].armor *
              Math.max(this.armorrep - this.armorregreduce * this.round, 0) *
              tankArray[tankIndex].survivor,
          shipStats[0].armor * this.defenders[tankIndex].survivor
        );
      }
      tankArray[tankIndex].shield = tank.shield;
      if (tankArray[tankIndex].shield !== 0) {
        tankArray[tankIndex].shield = Math.min(
          tankArray[tankIndex].shield +
            shipStats[0].shield *
              Math.max(
                this.shieldregen - this.shieldregreduce * this.round,
                0
              ) *
              tankArray[tankIndex].survivor,
          shipStats[0].shield * tankArray[tankIndex].survivor
        );
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
input {
  width: 6ch;
}
select {
  width: 20ch;
}
</style>
