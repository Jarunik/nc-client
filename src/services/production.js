import ApiService from "@/services/api";

class ProductionService {
  async all(user, planetId) {
    const response = await ApiService.get(
      `/loadproduction?id=${planetId}&user=${user}`
    );

    return response;
  }
}

export default new ProductionService();
