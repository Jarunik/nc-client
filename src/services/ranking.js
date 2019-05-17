import ApiService from "@/services/api";

class RankingService {
  async all() {
    const response = await ApiService.get("/loadranking");

    return response;
  }
}

export default new RankingService();
