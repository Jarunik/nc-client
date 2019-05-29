import ApiService from "@/services/api";

class BattleService {
  async all(missionId) {
    const response = await ApiService.get(
      `/loadbattle?mission_id=${missionId}`
    );

    return response;
  }
}

export default new BattleService();
