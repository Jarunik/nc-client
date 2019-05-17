<template>
  <div class="ranking">
    <h1>{{ $t("Ranking") }}</h1>
    <table>
      <thead>
        <th>{{ $t("Rank") }}</th>
        <th>{{ $t("User") }}</th>
        <th>{{ $t("Production") }}</th>
        <th>{{ $t("Planets") }}</th>
        <th>{{ $t("Explorations") }}</th>
        <th>{{ $t("Per Planet") }}</th>
      </thead>
      <tbody>
        <tr v-for="(rank, index) in topRanks" :key="rank.user">
          <td>{{ index + 1 }}</td>
          <td>{{ rank.user }}</td>
          <td>{{ rank.meta_rate.toFixed(0) }}</td>
          <td>{{ rank.planets }}</td>
          <td>{{ rank.explorations }}</td>
          <td>
            {{ Number(rank.explorations / (rank.planets - 1)).toFixed(0) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import RankingService from "@/services/ranking";

export default {
  name: "ranking",
  data: function() {
    return {
      ranking: null
    };
  },
  async mounted() {
    await this.prepareComponent();
  },
  computed: {
    topRanks() {
      if (this.ranking !== null) {
        return this.ranking.slice(0, 30);
      } else {
        return this.ranking;
      }
    }
  },
  methods: {
    async prepareComponent() {
      await this.getRanking();
    },
    async getRanking() {
      const response = await RankingService.all();
      this.ranking = response;
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
