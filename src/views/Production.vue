<template>
  <div class="production">
    <h1>{{ $t("Production") }}</h1>
        <template v-if="user !== this.$store.state.game.user">
      <p>
        {{ $t("User: ") + user }}
        <template v-if="user !== this.$store.state.planet.id">
          </br>{{ $t("Planet: ") + planet }}
        </template>
      </p>
    </template>
    <template
      v-if="user !== 'null' && planet !== 'null' && production !== null"
    >
      <table>
        <thead>
          <th>{{ $t("Type") }}</th>
          <th>{{ $t("Coal") }}</th>
          <th>{{ $t("Ore") }}</th>
          <th>{{ $t("Copper") }}</th>
          <th>{{ $t("Uranium") }}</th>
        </thead>
        <tbody>
                    <tr>
            <td>{{ $t("Depot Size") }}</td>
            <td>{{ production.coal.depot }}</td>
            <td>{{ production.ore.depot }}</td>
            <td>{{ production.copper.depot }}</td>
            <td>{{ production.uranium.depot }}</td>
          </tr>
          <tr>
            <td>{{ $t("Daily Production") }}</td>
            <td>{{ production.coal.production }}</td>
            <td>{{ production.ore.production }}</td>
            <td>{{ production.copper.production }}</td>
            <td>{{ production.uranium.production }}</td>
          </tr>
          <tr>
            <td>{{ $t("Mine Level") }}</td>
            <td>{{ production.coal.level }}</td>
            <td>{{ production.ore.level }}</td>
            <td>{{ production.copper.level }}</td>
            <td>{{ production.uranium.level }}</td>
          </tr>
          <tr>
            <td>{{ $t("Booster Level") }}</td>
            <td>{{ production.coal.booster }}</td>
            <td>{{ production.ore.booster }}</td>
            <td>{{ production.copper.booster }}</td>
            <td>{{ production.uranium.booster }}</td>
          </tr>
        </tbody>
      </table>
    </template>
    <template v-else>
      <template v-if="user === 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link to="/user">{{ $t("user") }}</router-link>
        </p>
      </template>
      <template v-if="planet == 'null'">
        <p>
          {{ $t("Please set the") }}
          <router-link :to="'/' + user + '/planets'">{{
            $t("planet")
          }}</router-link>
        </p>
      </template>
    </template>
  </div>
</template>

<script>
import ProductionService from "@/services/production";

export default {
  name: "production",
  props: ["user", "planet"],
  data: function() {
    return {
      production: null
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  methods: {
    async prepareComponent() {
      await this.getProduction();
    },
    async getProduction() {
      const response = await ProductionService.all(this.user, this.planet);
      this.production = response;
    }
  }
};
</script>

<style>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>
