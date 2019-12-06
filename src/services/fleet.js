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
  async ships(userId, planetId, limit = 100) {
    const response = await ApiService.get(
      `/planetships?user=${userId}&planet=${planetId}&limit=${limit}`
    );

    return response;
  }

  async shipsByType(userId, planetId, shipType, limit = 100) {
    const response = await ApiService.get(
      `/planetships?user=${userId}&planet=${planetId}&type=${shipType}&limit=${limit}`
    );

    return response;
  }

  async missionInfo(userId, planetId) {
    const response = await ApiService.get(
      `/missioninfo?user=${userId}&planet=${planetId}`
    );

    return response;
  }
}

export default new FleetService();
