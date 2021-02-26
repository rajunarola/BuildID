import axios from 'axios';

export function getUserRewardAmount() {
    return axios.get(process.env.REACT_APP_API_URL + `api/users/GetUserRewardAmount/${localStorage.getItem('userID')}`);
}

export function getStoreItems() {
    return axios.get(process.env.REACT_APP_API_URL + `api/store/getstoreitems`);
}

export function searchStoreItems(searchString) {
    return axios.get(process.env.REACT_APP_API_URL + `api/store/SearchStoreItems/${searchString}`);
}

export function getUserPurchases() {
    return axios.get(process.env.REACT_APP_API_URL + `api/store/GetUserPurchases/${localStorage.getItem('userID')}`);
}

export function getUserShoppingCart() {
    return axios.get(process.env.REACT_APP_API_URL + `api/store/GetUserShoppingCart/${localStorage.getItem('userID')}`);
}

export function getNrItemsShoppingCart() {
    return axios.get(process.env.REACT_APP_API_URL + `api/store/GetNrItemsShoppingCart/${localStorage.getItem('userID')}`);
}

export function saveUserPurchase(data) {
    return axios.post(process.env.REACT_APP_API_URL + `api/store/SaveUserPurchase`, data);
}
