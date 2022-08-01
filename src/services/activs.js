import axios from "axios";

class ActivDataService {

  getAll(page = 0) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs?page=${page}`);
  }

  find(query, by="title", page=0) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs?${by}=${query}&page=${page}`);
  }

  getRatings() {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/ratings`);
  }

  getActivDetail(movie_id) {
    return axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/id/${movie_id}`);
  }

  createReview(data) {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, data);
  }

  updateReview(data) {
    return axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, data);
  }

  deleteReview(data) {
    return axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/v1/activs/review`, {data});
  }
}

export default new ActivDataService();