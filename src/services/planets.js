import ApiService from "@/services/api";

class PlanetsService {
  async byUser(user) {
    if (user !== null) {
      const response = await ApiService.get(
        `/loadplanets?user=${user}&to=1000`
      );

      return response;
    } else {
      return null;
    }
  }

  async starterPlanet(user) {
    if (user !== null) {
      const response = await ApiService.get(
        `/loadplanets?user=${user}&to=1000`
      );

      const starter = response.planets.filter(planet => {
        return planet.starter === 1;
      });

      return starter[0];
    } else {
      return null;
    }
  }

  async byId(planetId) {
    const response = await ApiService.get(`/loadplanet?id=${planetId}`);

    return response;
  }

  async burnRates() {
    const response = await ApiService.get(`/burnrates`);

    return response;
  }
}

export default new PlanetsService();
