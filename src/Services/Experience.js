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

export function deleteAnExperience(experienceId) {
    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/users/DeleteUserCompanyHistory`, experienceId).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getUserExperience(userId, experienceId) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserWorkExperience/${userId}/${experienceId}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}
export function getUserExperience1(userId) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserCompanyHistory/${userId}`).then(response => {
        return response
    }).catch(error => {
        return error
    });

}