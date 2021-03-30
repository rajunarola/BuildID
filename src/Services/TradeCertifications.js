import axios from "axios";

export function getUserTradeCertifications() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserTradeCertifications/${parseInt(localStorage.getItem('userID'))}`);
}

export function saveUserTradeCertification(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserTradeCertification`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    });
}

export function getUserTradeCertification(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserTradeCertification/${parseInt(localStorage.getItem('userID'))}/${id}`);
}