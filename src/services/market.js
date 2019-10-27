import ApiService from "@/services/api";

class MarketService {
  async asks() {
    const response = await ApiService.get(`/asks`);

    return response;
  }
  async active() {
    const response = await ApiService.get(`/asks?active=1`);

    return response;
  }
}

export default new MarketService();
