import ApiService from "@/services/api";

class ShopService {
  async byUser(user) {
    const response = await ApiService.get(`/loaditems?user=${user}`);

    return response;
  }
}

export default new ShopService();
