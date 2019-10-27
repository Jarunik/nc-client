import ApiService from "@/services/api";

class MarketService {
  async asks() {
    const response = await ApiService.get(`/asks`);

    return response;
  }
}

export default new MarketService();
