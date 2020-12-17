import axios from "axios";

const userID = localStorage.getItem('userID');

export function getAddress() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserAddress/${userID}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveUserAddress(data) {
    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/users/SaveUserAddress`, data, {
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