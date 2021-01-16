import axios from "axios";

export function getProjectManufacturers(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/GetProjectManufacturers/${id}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getProjectCompany(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/GetProjectCompanies/${id}`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveManufacturers(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/misc/SaveManufacturer`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveCompany(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/companies/SaveCompany`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveNewManufacturerInProject(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectManufacturer`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveNewCompanyInProject(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectCompany`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function saveProjectPicture(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectPictures`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    }).then(response => {
        return response
    }).catch(error => {
        return error
    });
}