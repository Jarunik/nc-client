import ApiService from "@/services/api";

class ShopService {
  async all() {
    const response = await ApiService.get(`/loadshop`);

    return response;
  }
}

export default new ShopService();
