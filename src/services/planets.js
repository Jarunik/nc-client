import ApiService from "@/services/api";

class PlanetsService {
  async byUser(user) {
    const response = await ApiService.get(`/loadplanets?user=${user}&to=1000`);

    return response;
  }

  async starterPlanet(user) {
    const response = await ApiService.get(`/loadplanets?user=${user}&to=1000`);

    const starter = response.planets.filter(planet => {
      return planet.starter === 1;
    });

    return starter[0];
  }

  async byId(planetId) {
    const response = await ApiService.get(`/loadplanet?id=${planetId}`);

    return response;
  }
}

export default new PlanetsService();
