import * as httpRequest from '@/utils/httpRequest';

export const readAll = async () => {
    try {
        const res = await httpRequest.get('Employees/');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const readById = async (id) => {
    try {
        const res = await httpRequest.get(`Employees/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const createNewEmployee = async (data) => {
    try {
        const res = await httpRequest.post('Employees/', data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const updateEmployee = async (id, data) => {
    try {
        const res = await httpRequest.put(`Employees/${id}`, data);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const removeByCode = async (id) => {
    try {
        const res = await httpRequest.delete(`Employees/${id}`);
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const removeAll = async () => {
    try {
        const res = await httpRequest.delete('Employees/');
        return res;
    } catch (error) {
        console.log(error);
    }
};

export const search = async (q, type = 'less') => {
    try {
        const res = await httpRequest.get('Employees/', {
            params: { q, type },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
