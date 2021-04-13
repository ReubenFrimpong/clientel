import http from "../http-common";

class ClientDataService {
    getAll() {
        return http.get("/providers");
    }

    get(id) {
        return http.get(`/providers/${id}`);
    }

    create(data) {
        return http.post("/providers", data);
    }

    update(id, data) {
        return http.put(`/providers/${id}`, data);
    }

    delete(id) {
        return http.delete(`/providers/${id}`);
    }

}

export default new ClientDataService();