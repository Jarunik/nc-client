<template>
  <div class="ranking">
    <h1>{{ $t("Ranking") }}</h1>
    <table>
      <thead>
        <th>{{ $t("Rank") }}</th>
        <th @click="sort('user')">{{ $t("User") }}</th>
        <th @click="sort('meta_rate')">{{ $t("Production") }}</th>
        <th @click="sort('planets')">{{ $t("Planets") }}</th>
        <th @click="sort('explorations')">{{ $t("Explorations") }}</th>
        <th>{{ $t("Per Planet") }}</th>
      </thead>
      <tbody>
        <tr v-for="(rank, index) in sortedRanking" :key="rank.user">
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
      ranking: null,
      currentSort: "name",
      currentSortDir: "asc"
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
    },
    sortedRanking() {
      var sortedRanking = this.ranking;
      if (sortedRanking !== null) {
        return sortedRanking.sort((a, b) => {
          let modifier = 1;
          if (this.currentSortDir === "desc") modifier = -1;
          if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
        });
      } else {
        return sortedRanking;
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
    },
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
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
