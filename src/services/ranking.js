import ApiService from "@/services/api";

class RankingService {
  async all() {
    const response = await ApiService.get("/loadranking");

    return response;
  }

  async limit(limit = 100) {
    const response = await ApiService.get(`/loadranking?limit=${limit}`);

    return response;
  }

  async sortDestroyed(limit = 100) {
    const response = await ApiService.get(
      `/loadranking?limit=${limit}&sort=destroyed`
    );

    return response;
  }
}

export default new RankingService();
