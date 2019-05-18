import ApiService from "@/services/api";

class ShipyardService {
  async all(planetId) {
    const response = await ApiService.get(`/shipyard?id=${planetId}`);

    return response;
  }
}

export default new ShipyardService();
