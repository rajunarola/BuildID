import axios from "axios";

export function userLogin(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SignIn2`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getUserDetails() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserInfo/${parseInt(localStorage.getItem('userID'))}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function userWorkHistory() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserWorkHistory/${parseInt(localStorage.getItem('userID'))}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function userProjects(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/getproject/${id}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function getTicketsByUserId() {
    return axios.get(process.env.REACT_APP_API_URL + `api/tickets/GetTicketsByUserId/${parseInt(localStorage.getItem('userID'))}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function getTicketDetails(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/tickets/GetTicketById/${id}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function editUserProfile(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SavePersonalInfo`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            "type": "formData"
        }
    }).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function getNewQuestionForTheUser() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetNewQuestionForTheUser/${parseInt(localStorage.getItem('userID'))}/0`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function saveUserQuestion(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserQuestion`, data).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}