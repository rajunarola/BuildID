import axios from "axios";

export function userLogin(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SignIn2`, data);
}

export function getUserDetails() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserInfo/${parseInt(localStorage.getItem('userID'))}`);
}

export function userWorkHistory() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserWorkHistory/${parseInt(localStorage.getItem('userID'))}`);
}

export function userProjects(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/getproject/${id}`);
}

export function getTicketsByUserId() {
    return axios.get(process.env.REACT_APP_API_URL + `api/tickets/GetTicketsByUserId/${parseInt(localStorage.getItem('userID'))}`);
}

export function getTicketDetails(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/tickets/GetTicketById/${id}`);
}

export function editUserProfile(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SavePersonalInfo`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            "type": "formData"
        }
    })
}

export function getNewQuestionForTheUser() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetNewQuestionForTheUser/${parseInt(localStorage.getItem('userID'))}/0`);
}

export function saveUserQuestion(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserQuestion`, data);
}

export function getUserWorkExperience(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserWorkExperience/${parseInt(localStorage.getItem('userID'))}/${id}`);
}