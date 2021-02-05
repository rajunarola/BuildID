import axios from "axios";

export function getProjectManufacturers(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/GetProjectManufacturers/${id}`);
}

export function getProjectCompany(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/projects/GetProjectCompanies/${id}`);
}

export function saveManufacturers(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/misc/SaveManufacturer`, data);
}

export function saveCompany(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/companies/SaveCompany`, data);
}

export function saveNewManufacturerInProject(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectManufacturer`, data);
}

export function saveNewCompanyInProject(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectCompany`, data);
}

export function saveProjectPicture(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProjectPictures`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    });
}

export function getSearchProjectsBy(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/GetSearchProjectsBy`, data);
}

export function postSaveUserWorkHistory(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/users/SaveUserWorkHistory`, data);
}

export function searchProjectsBy(city, projectName, buildingTypeId, contractorName) {
    var uri = `${process.env.REACT_APP_API_URL}api/projects/GetSearchProjectsBy/{CityProv:'${city}',ProjectName:'${projectName}',BuildingTypeId:'${buildingTypeId}',ContractorName:'${contractorName}'}`;
    var res = encodeURI(uri);
    return axios.get(res);
}

export function getGoogleAPIKey() {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/GetGoogleSearchCode`);
}

export function addGlobalProject(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/projects/SaveProject`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    });
}