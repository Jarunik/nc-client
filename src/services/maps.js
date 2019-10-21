import ApiService from "@/services/api";

class MapsService {
  async all() {
    const response = await ApiService.get(`/galaxyplanets`);

    return response;
  }
  async after(lastUpdate) {
    const response = await ApiService.get(`/galaxyplanets?after=${lastUpdate}`);

    return response;
  }
}

export default new MapsService();
