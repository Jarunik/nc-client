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
  async byFilter(
    categoryFilter = null,
    subcategoryFilter = null,
    typeFilter = null,
    userFilter = null
  ) {
    let query = "";
    if (categoryFilter !== null) {
      query = query + "category=" + categoryFilter + "&";
    }
    if (subcategoryFilter !== null) {
      query = query + "subcategory=" + subcategoryFilter + "&";
    }
    if (typeFilter !== null) {
      query = query + "type=" + typeFilter + "&";
    }
    if (userFilter !== null) {
      query = query + "user=" + userFilter + "&";
    }
    const response = await ApiService.get(`/asks?${query}&active=1`);
    return response;
  }
  async lowest() {
    const response = await ApiService.get(`/lowestasks`);
    return response;
  }
}

export default new MarketService();
