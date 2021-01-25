import axios from "axios";

export function getAddress() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserAddress/${parseInt(localStorage.getItem('userID'))}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveUserAddress(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserAddress`, data, {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => {
        return response
    }).catch(error => {
        return error
    });
}