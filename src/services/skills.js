import ApiService from "@/services/api";

class SkillsService {
  async all(user) {
    const response = await ApiService.get(`/loadskills?user=${user}`);

    return response;
  }
}

export default new SkillsService();
