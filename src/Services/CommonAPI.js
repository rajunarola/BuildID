import axios from "axios";

const userID = localStorage.getItem('userID');

export function userLogin(data) {
    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/users/SignIn`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function userWorkHistory() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/users/GetUserWorkHistory/${userID}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function userProjects(id) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/projects/getproject/${id}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function getTicketsByUserId() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/tickets/GetTicketsByUserId/${userID}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}

export function getTicketDetails(id) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/tickets/GetTicketById/${id}`).then(response => {
        return response;
    }).catch(error => {
        return error;
    });
}