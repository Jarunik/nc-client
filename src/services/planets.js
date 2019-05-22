import ApiService from "@/services/api";

class PlanetsService {
  async byUser(user) {
    const response = await ApiService.get(`/loadplanets?user=${user}`);

    return response;
  }

  async starterPlanet(user) {
    const response = await ApiService.get(
      `/loadplanets?user=${user}&from=0&to=1`
    );

    return response;
  }

  async byId(planetId) {
    const response = await ApiService.get(`/loadplanet?id=${planetId}`);

    return response;
  }
}

export default new PlanetsService();
