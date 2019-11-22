import ApiService from "@/services/api";

class BuffsService {
  async all(user) {
    const response = await ApiService.get(`/buffs?user=${user}`);

    return response;
  }
}

export default new BuffsService();
