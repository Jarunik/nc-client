import ApiService from "@/services/api";

class BattleService {
  async all(missionId) {
    const response = await ApiService.get(
      `/loadbattle?mission_id=${missionId}`
    );

    return response;
  }

  async limit(limit = 20) {
    const response = await ApiService.get(`/loadbattle?limit=${limit}`);

    return response;
  }
}

export default new BattleService();
