import ApiService from "@/services/api";

class FleetService {
  async all(userId, planetId) {
    const response = await ApiService.get(
      `/loadfleet?user=${userId}&planetid=${planetId}`
    );

    return response;
  }
  async grouped(userId, planetId) {
    const response = await ApiService.get(
      `/planetfleet?user=${userId}&planet=${planetId}`
    );

    return response;
  }
  async ships(userId, planetId) {
    const response = await ApiService.get(
      `/planetships?user=${userId}&planet=${planetId}`
    );

    return response;
  }
}

export default new FleetService();
