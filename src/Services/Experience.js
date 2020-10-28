import axios from 'axios';

const userID = localStorage.getItem('userID');

export function getUserWorkHistory() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserWorkHistory/${userID}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveUserWorkHistory(data) {
    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/users/SaveUserCompanyHistory`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}