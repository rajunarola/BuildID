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

export function getSearchProjectsBy(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/GetSearchProjectsBy`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function postSaveUserWorkHistory(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserWorkHistory`, data).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function searchProjectsBy(city, projectName, buildingTypeId, contractorName) {
    var uri = `${process.env.REACT_APP_API_URL}api/projects/GetSearchProjectsBy/{CityProv:'${city}',ProjectName:'${projectName}',BuildingTypeId:'${buildingTypeId}',ContractorName:'${contractorName}'}`;
    var res = encodeURI(uri);
    return axios.get(res).then(response => {
        return response
    }).catch(error => {
        return error
    });
}

export function getGoogleAPIKey() {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/GetGoogleSearchCode`).then(response => {
        return response
    }).catch(error => {
        return error
    });
}