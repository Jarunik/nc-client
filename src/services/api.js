import axios from "axios";

class ApiService {
  async get(url, config = {}) {
    var base = process.env.VUE_APP_ROOT_API;
    const response = await axios.get(`${base}${url}`, config);

    if (response.error) {
      return Promise.reject(
        new Error(`Error GET ${url} : ${JSON.stringify(response)}`)
      );
    }
    return response.data;
  }

  async post(url, data = {}, config = {}) {
    config.headers ||
      (config.headers = {
        "Content-Type": "application/json"
      });
    var base = process.env.VUE_APP_ROOT_API;
    const response = await axios.post(`${base}/${url}`, data, config);

    if (response.error) {
      return Promise.reject(
        new Error(`Error POST ${url} : ${JSON.stringify(response)}`)
      );
    }

    return response.data;
  }
}

export default new ApiService();
