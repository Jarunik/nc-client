import ApiService from "@/services/api";

class GalaxyService {
  async galaxy(xCoordinate, yCoordinate) {
    const response = await ApiService.get(
      `/loadgalaxy?x=${xCoordinate}&y=${yCoordinate}`
    );

    return response;
  }

  async area(xCoordinate, yCoordinate, height = 11, width = 11) {
    const response = await ApiService.get(
      `/loadgalaxy?x=${xCoordinate}&y=${yCoordinate}&heigth=${height}&width=${width}`
    );

    return response;
  }
}

export default new GalaxyService();
