import ApiService from "@/services/api";

class WalletService {
  async get(user) {
    const response = await ApiService.get(`/wallet?user=${user}&limit=30`);

    return response;
  }
}

export default new WalletService();
