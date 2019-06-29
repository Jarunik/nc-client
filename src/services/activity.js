import ApiService from "@/services/api";

class ActivityService {
  async all() {
    const response = await ApiService.get("/transactions");

    return response;
  }

  async byType(missionType) {
    const response = await ApiService.get(`/transactions?type=${missionType}`);
    return response;
  }
}

export default new ActivityService();
