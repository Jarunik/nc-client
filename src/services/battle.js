import ApiService from "@/services/api";

class BattleService {
  async all(userId, missionId) {
    const response = await ApiService.get(
      `/loadbattle?user=${userId}&mission_id=${missionId}`
    );

    return response;
  }
}

export default new BattleService();
