import ApiService from "@/services/api";

class MissionsService {
  async all(user) {
    const response = await ApiService.get(`/loadfleetmission?user=${user}`);

    return response;
  }
}

export default new MissionsService();
