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
  async byFilter(categoryFilter = null, userFilter = null) {
    let query = "";
    if (categoryFilter !== null) {
      query = query + "category=" + categoryFilter + "&";
    }
    if (userFilter !== null) {
      query = query + "user=" + userFilter + "&";
    }
    const response = await ApiService.get(`/asks?${query}&active=1`);
    return response;
  }
}

export default new MarketService();
