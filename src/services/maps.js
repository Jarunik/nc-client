import ApiService from "@/services/api";

class MapsService {
  async all() {
    const response = await ApiService.get(`/galaxyplanets`);

    return response;
  }
}

export default new MapsService();
