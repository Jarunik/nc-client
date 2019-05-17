import ApiService from "@/services/api";

class QuantityService {
  async get(planetId) {
    const response = await ApiService.get(`/loadqyt?id=${planetId}`);

    return response;
  }
}

export default new QuantityService();
