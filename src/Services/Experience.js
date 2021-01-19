import axios from 'axios';

const userID = parseInt(localStorage.getItem('userID'));

export function getUserExperienceHistory() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserCompanyHistory/${userID}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveUserWorkHistory(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserCompanyHistory`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function deleteAnExperience(experienceId) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/DeleteUserCompanyHistory`, experienceId).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function editAnExperience(userid, experienceId) {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserCompanyHistoryItem/${userid}/${experienceId}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}