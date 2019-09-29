import ApiService from "@/services/api";

class SeasonService {
  async seasonRanking() {
    const response = await ApiService.get("/seasonranking?limit=100");

    return response;
  }
}

export default new SeasonService();
