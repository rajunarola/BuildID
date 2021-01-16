import axios from "axios";

export function addNewTicket(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/tickets/SaveTicket`, data, {
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

export function getTicketByID(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/tickets/GetTicketById/${id}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}