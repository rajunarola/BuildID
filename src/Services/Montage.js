import axios from 'axios';

export function getMontages() {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/getmontagesv1/${parseInt(localStorage.getItem('userID'))}`);
}

export function getMusicFiles() {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/getmusicfilesv1`);
}

export function saveMontage(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/misc/savemontage`, data);
}

export function saveMontageFile(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/misc/savemontagefile`, data);
}

export function deleteMontage(id) {
    return axios.delete(process.env.REACT_APP_API_URL + `api/misc/deletemontage/${id}/${parseInt(localStorage.getItem('userID'))}`);
}

export function deleteMontageFile(id) {
    return axios.delete(process.env.REACT_APP_API_URL + `api/misc/deletemontagefile/${id}/${parseInt(localStorage.getItem('userID'))}`);
}

export function getMontageFiles(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/getmontagefilesv1/${id}`);
}

export function getMontageFilesByUserIdAndId(id) {
    return axios.get(process.env.REACT_APP_API_URL + `api/misc/getmontage/${parseInt(localStorage.getItem('userID'))}/${id}`);
}