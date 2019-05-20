import ApiService from "@/services/api";

class UserService {
  async get(user) {
    const response = await ApiService.get(`/loaduser?user=${user}`);

    return response;
  }
}

export default new UserService();
