import axios from "axios";

export function getStoreItemsForSale(type, searchString) {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetStoreItemsForSale/${parseInt(localStorage.getItem('userID'))}/${type}/${searchString}`);
}

export function getStoreItemsForSaleByItemId(itemId) {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetStoreItemForSale/${parseInt(localStorage.getItem('userID'))}/${itemId}`);
}

export function saveUserWishItem(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/buysell/SaveUserWishItem`, data);
}

export function getUserWishList() {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetUserWishList/${parseInt(localStorage.getItem('userID'))}`);
}

export function deleteUserWishItem(id) {
    return axios.post(process.env.REACT_APP_API_URL + `api/buysell/DeleteUserWishItem`, id);
}

export function getUserItems(itemStatusId) {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetUserItems/${parseInt(localStorage.getItem('userID'))}/${itemStatusId}`);
}

export function getUserItemStatuses() {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetUserItemStatuses`);
}

export function saveUserItem(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/buysell/SaveUserItem`, data);
}

export function getUserItem(itemId) {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetUserItem/${parseInt(localStorage.getItem('userID'))}/${itemId}`);
}

export function getUserItemsHistory() {
    return axios.get(process.env.REACT_APP_API_URL + `api/buysell/GetUserItemsHistory/${parseInt(localStorage.getItem('userID'))}`);
}

export function saveUserItemPicture2(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/buysell/SaveUserItemPicture2`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Accept": "application/json"
        }
    });
}

export function deleteUserItemPicture(id, buyselluseritemid) {
    return axios.delete(process.env.REACT_APP_API_URL + `api/buysell/DeleteUserItemPicture/${id}/${buyselluseritemid}/${parseInt(localStorage.getItem('userID'))}`);
}