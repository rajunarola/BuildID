import axios from 'axios';

export function getUserExperienceHistory() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserCompanyHistory/${parseInt(localStorage.getItem('userID'))}`);
}

export function saveUserWorkHistory(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserCompanyHistory`, data);
}

export function deleteAnExperience(experienceId) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/DeleteUserCompanyHistory`, experienceId);
}

export function editAnExperience(userid, experienceId) {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserCompanyHistoryItem/${userid}/${experienceId}`);
}