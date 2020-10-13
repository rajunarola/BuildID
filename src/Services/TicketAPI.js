import axios from "axios";

const userId = localStorage.getItem('userID')

export function addNewTicket(data) {

    return axios.post(`https://bimiscwebapi-test.azurewebsites.net/api/tickets/SaveTicket`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json",
            "type": "formData"
        }
    }).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getAllTickets() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/tickets/GetTicketsByUserId/${userId}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getTicketType() {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/tickets/GetTicketTypes`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getIssuedBy(string) {
    return axios.get(`https://bimiscwebapi-test.azurewebsites.net/api/companies/GetCompanies/${string}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}