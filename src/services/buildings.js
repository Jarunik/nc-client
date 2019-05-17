import ApiService from "@/services/api";

class BuildingsService {
  async all(planetId) {
    const response = await ApiService.get(`/loadbuildings?id=${planetId}`);

    return response;
  }
}

export default new BuildingsService();
