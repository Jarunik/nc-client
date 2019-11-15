<template>
  <div class="production">
    <h1>{{ $t("Production") }} - {{ planetName }}</h1>
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
            <td>{{ $t("Daily Production") }}</td>
            <td>
              {{
                Number(production.coal.production).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.ore.production).toLocaleString(gameLocale, {
                  style: "decimal"
                })
              }}
            </td>
            <td>
              {{
                Number(production.copper.production).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
            <td>
              {{
                Number(production.uranium.production).toLocaleString(
                  gameLocale,
                  {
                    style: "decimal"
                  }
                )
              }}
            </td>
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
    }
  }
};
</script>
