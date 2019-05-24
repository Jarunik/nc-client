import ApiService from "@/services/api";

class GalaxyService {
  async galaxy(xCoordinate, yCoordinate) {
    const response = await ApiService.get(
      `/loadgalaxy?x=${xCoordinate}&y=${yCoordinate}`
    );

    return response;
  }
}

export default new GalaxyService();
