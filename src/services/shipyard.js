import ApiService from "@/services/api";

class ShipyardService {
  async all(planetId) {
    const response = await ApiService.get(`/shipyard?id=${planetId}`);

    return response;
  }
  async planetShipyard(userId, planetId) {
    const response = await ApiService.get(
      `/planetshipyard?user=${userId}&planet=${planetId}`
    );

    return response;
  }
}

export default new ShipyardService();
