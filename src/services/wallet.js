import ApiService from "@/services/api";

class WalletService {
  async get(user) {
    const response = await ApiService.get(`/wallet?user=${user}&limit=30`);

    return response;
  }
  async ranking(limit = 100) {
    const response = await ApiService.get(`/wallet_ranking?limit=${limit}`);

    return response;
  }
}

export default new WalletService();
