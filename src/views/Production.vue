<template>
  <div class="production">
    <h1>
      {{ $t("Production") }} {{ planetName }}
      <font color="grey" size="2em">{{ posX }}/{{ posY }}</font>
    </h1>
    <template
      v-if="gameUser !== null && planetId !== null && production !== null"
    >
      <quantityRibbon />
      <br />
      <br />
      <table>
        <thead>
          <th></th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
        </thead>
        <tbody>
          <tr>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
          </tr>
          <tr>
            <td>
              {{ $t("Booster Skill Level") }}
            </td>
            <td>({{ production.coal.booster || 0 }})</td>
            <td>({{ production.ore.booster || 0 }})</td>
            <td>({{ production.copper.booster || 0 }})</td>
            <td>({{ production.uranium.booster || 0 }})</td>
          </tr>
          <tr>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
          </tr>
          <tr>
            <td>{{ $t("Daily Raw Production") }}</td>
            <td>
              {{
                Number(dailyProduction(production.coal)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyProduction(production.ore)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyProduction(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyProduction(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $t("Daily Skill Boost") }}
            </td>
            <td>
              {{
                Number(dailySkillBoost(production.coal || 0)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailySkillBoost(production.ore || 0)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailySkillBoost(production.copper || 0)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailySkillBoost(production.uranium || 0)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $t("Daily Rarity Boost") }} ({{ $t(production.misc.bonus) }})
            </td>
            <td>
              {{
                Number(dailyRarityBoost(production.coal || 0)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRarityBoost(production.ore)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRarityBoost(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRarityBoost(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td>
              {{ $t("Daily Rune Boost") }}
              ({{ $t(production.misc.rune_name || "-") }})
            </td>
            <td>
              {{
                Number(dailyRuneBoost(production.coal)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRuneBoost(production.ore)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRuneBoost(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyRuneBoost(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td>{{ $t("Daily Normal Production") }}</td>
            <td>
              {{
                Number(dailyTotal(production.coal)).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(dailyTotal(production.ore)).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(dailyTotal(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(dailyTotal(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td>{{ $t("Shield Charge Malus") }}</td>
            <td>
              {{
                Number(shieldMalus(production.coal)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(shieldMalus(production.ore)).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(shieldMalus(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(shieldMalus(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
          </tr>
          <tr>
            <td>{{ $t("Current Production") }}</td>
            <td>
              {{
                Number(currentProduction(production.coal)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(currentProduction(production.ore)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(currentProduction(production.copper)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(currentProduction(production.uranium)).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
          </tr>
          <tr>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
            <td><hr /></td>
          </tr>
          <tr>
            <td>{{ $t("Depot Size") }}</td>
            <td>
              {{
                Number(production.coal.depot).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.ore.depot).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.copper.depot).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.uranium.depot).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
          </tr>
          <tr>
            <td>{{ $t("Safe") }}</td>
            <td>
              {{
                Number(production.coal.safe).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.ore.safe).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.copper.safe).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.uranium.safe).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="gameUser === null">
        <p>{{ $t("Please set the") }} {{ $t("user") }}</p>
      </template>
      <template v-if="planetId == null">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/planets'">{{ $t("planet") }}</router-link>
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import ProductionService from "@/services/production";
import { mapState } from "vuex";
import * as types from "@/store/mutation-types";
import QuantityRibbon from "@/components/QuantityRibbon.vue";

export default {
  name: "production",
  components: {
    QuantityRibbon
  },
  data: function() {
    return {
      production: null
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
      posX: state => state.planet.posX,
      posY: state => state.planet.posY,
      gameLocale: state => state.game.gameLocale
    })
  },
  methods: {
    async prepareComponent() {
      if (this.$route.name == "production") {
        await this.getProduction();
        this.$store.subscribe(mutation => {
          switch (mutation.type) {
            case "planet/" + types.SET_PLANET_ID:
              this.prepareComponent();
          }
        });
      }
    },
    async getProduction() {
      const response = await ProductionService.all(
        this.gameUser,
        this.planetId
      );
      this.production = response;
    },
    dailyProduction(resource) {
      return resource.production;
    },
    dailySkillBoost(resource) {
      return (this.dailyProduction(resource) * resource.booster * 0.5) / 100;
    },
    dailyRarityBoost(resource) {
      return (this.dailyProduction(resource) * this.production.misc.rate) / 100;
    },
    dailyRuneBoost(resource) {
      return (this.dailyProduction(resource) * this.production.misc.rune) / 100;
    },
    dailyTotal(resource) {
      return (
        this.dailyProduction(resource) +
        this.dailySkillBoost(resource) +
        this.dailyRarityBoost(resource) +
        this.dailyRuneBoost(resource)
      );
    },
    shieldMalus(resource) {
      let malus = 0;
      if (this.production.misc.shieldcharge_busy > this.moment().unix()) {
        malus = -this.dailyTotal(resource) * 0.1;
      }
      return malus;
    },
    currentProduction(resource) {
      return this.dailyTotal(resource) + this.shieldMalus(resource);
    }
  }
};
</script>
