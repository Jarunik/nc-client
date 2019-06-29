import ApiService from "@/services/api";

class ActivityService {
  async all() {
    const response = await ApiService.get("/transactions");

    return response;
  }

  async byFilter(missionType = null, filterUser = null) {
    let query = "";
    if (missionType !== null) {
      query = query + "type=" + missionType + "&";
    }
    if (filterUser !== null) {
      query = query + "user=" + filterUser + "&";
    }
    const response = await ApiService.get(`/transactions?${query}`);
    return response;
  }
}

export default new ActivityService();
