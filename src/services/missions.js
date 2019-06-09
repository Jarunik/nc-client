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

  async activeUser(user) {
    const response = await ApiService.get(
      `/loadfleetmission?user=${user}&active=1&onlyuser=1`
    );

    return response;
  }

  async latest(user, limit = 40) {
    const response = await ApiService.get(
      `/loadfleetmission?user=${user}&page=0&limit=${limit}`
    );

    return response;
  }
}

export default new MissionsService();
