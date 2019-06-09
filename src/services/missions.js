import ApiService from "@/services/api";

class MissionsService {
  async all(user) {
    const response = await ApiService.get(`/loadfleetmission?user=${user}`);

    return response;
  }

  async active(user) {
    const response = await ApiService.get(
      `/loadfleetmission?user=${user}&active=1`
    );

    return response;
  }
}

export default new MissionsService();
