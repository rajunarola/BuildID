import axios from 'axios';

const userID = localStorage.getItem('userID');

export function getUserWorkHistory() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserCompanyHistory/${userID}`).then(response => {
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

export function deleteAnExperience(experienceId) {
    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/users/DeleteUserCompanyHistory`, experienceId).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function editAnExperience(experienceId) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserCompanyHistoryItem/${userID}/${experienceId}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}