import axios from 'axios';

/**
 * Tạo axios instance
 * create by: ttanh (25/08/2023)
 */
const request = axios.create({
    baseURL: 'https://localhost:7244/api/v1/',
});

/**
 * Tạo get request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (25/08/2023)
 */
export const get = async (url, configs = {}) => {
    const response = await request.get(url, configs);
    return response;
}

/**
 * Tạo post request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (25/08/2023)
 */
export const post = async (url, configs = {}) => {
    const response = await request.post(url, configs);
    return response;
};

/**
 * Tạo post request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (21/09/2023)
 */
export const put = async (url, configs = {}) => {
    const response = await request.put(url, configs);
    return response;
};

/**
 * Tạo delete request đến API
 * @param {string} url API path
 * @param {object} configs bao gồm params, etc
 * @returns response từ API
 * Created by: ttanh (10/09/2023)
 */
export const remove = async (url, configs = {}) => {
    const response = await request.delete(url, configs);
    return response;
};

export default request;
