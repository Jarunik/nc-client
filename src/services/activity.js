import ApiService from "@/services/api";

class ActivityService {
  async all() {
    const response = await ApiService.get("/transactions");

    return response;
  }
}

export default new ActivityService();
