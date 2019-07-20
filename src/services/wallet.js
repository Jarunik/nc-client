import ApiService from "@/services/api";

class WalletService {
  async get(user) {
    const response = await ApiService.get(`/wallet?user=${user}`);

    return response;
  }
}

export default new WalletService();
