import { defineStore } from 'pinia';
import { ref } from 'vue';

import { employeeData } from '@/utils/employeeData';

// tạo 1 empty object để lưu trữ các trường dữ liệu nhân viên
const getEmptyEmployeeData = () => {
    const emptyObject = {}
    for (const key in employeeData[0]) {
        emptyObject[key] = ''
    }
    return emptyObject
};

export const useEmployeeStore = defineStore('employeeState', () => {
    const initEmployeeFields = getEmptyEmployeeData()

    const current = ref(initEmployeeFields)
    const employeeList = ref([])
    const isShowDetails = ref(false);
    const isShowNewDetails = ref(false);

    // Lấy dữ liệu danh sách nhân viên từ API
    const getAllEmployees = () => {
        try {
            employeeList.value = employeeData
        } catch (err) {
            console.log(err);
        }
    }

    const getCurrentEmployee = () => current.value;
    const setCurrentEmployee = (employee) => current.value = employee;

    const getEmployeeByCode = (code) => {
        const index = employeeList.value.findIndex(employee => employee.EmployeeCode === code);
        return index
    }

    // thêm nhân viên
    const addEmployee = (data) => {
        try {
            console.log('add:', data);
            employeeList.value.unshift(data)
        } catch (err) {
            console.log(err);
        }
    };

    // sửa nhân viên
    const updateEmployee = (id, data) => {
        try {
            console.log('update:', id, data);
            if (current.value) {
                // tìm index của nhân viên có EmployeeID = tham số id đầu vào
                const index = employeeList.value.findIndex(employee => employee.EmployeeID === id);

                // cập nhật nhân viên nếu tìm thấy
                if (index !== -1) {
                    employeeList.value[index] = { ...employeeList.value[index], ...data };
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Tìm kiếm employee theo mã nhân viên hoặc tên nhân viên
    const searchEmployee = (searchText) => {
        // Chuyển searchText sang định dạng lowercase
        const keyword = searchText.toLowerCase()

        // Tìm kiếm trong employeeList, trả về những employee có chứa keyword
        return employeeList.value.filter((employee) => {
            return (
                // chuyển EmployeeCode và FullName sang lowercase và thực hiện tìm kiếm
                employee.EmployeeCode.toString().includes(keyword) ||
                employee.FullName.toLowerCase().includes(keyword)
            );
        })
    }

    // xóa nhân viên
    const deleteEmployee = (employeeCode) => {
        try {
            if (employeeCode) {
                // trả về mảng gồm những nhân viên có ID khác tham số đầu vào
                employeeList.value = employeeList.value.filter((el) =>
                    employeeCode !== (el.EmployeeCode)
                )
            }

        } catch (err) {
            console.log(err);

        }
    }

    // xóa nhiều nhân viên
    const deleteMultipleEmployees = (employeeIDs) => {
        try {
            if (employeeIDs.length) {
                employeeList.value = employeeList.value.filter((el) =>
                    !employeeIDs.includes(el.EmployeeID)
                )
            }
        } catch (err) {
            console.log(err);

        }
    }

    // tạo form nhân viên mới
    const createDetails = () => {
        isShowDetails.value = false;
        isShowNewDetails.value = true;
        current.value = initEmployeeFields
    };

    // hiển thị thông tin nhân viên
    const showDetails = (employee) => {
        isShowDetails.value = true
        current.value = employee
    }

    // ẩn thông tin nhân viên
    const hideDetails = () => {
        isShowDetails.value = false;
        isShowNewDetails.value = false;
        current.value = initEmployeeFields;
    };

    return {
        initEmployeeFields,
        current,
        employeeList,
        isShowDetails,
        isShowNewDetails,
        getAllEmployees,
        getCurrentEmployee,
        setCurrentEmployee,
        getEmployeeByCode,
        addEmployee,
        updateEmployee,
        searchEmployee,
        deleteEmployee,
        deleteMultipleEmployees,
        createDetails,
        showDetails,
        hideDetails,
    };
});
