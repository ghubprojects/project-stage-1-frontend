import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useEmployeeDetailsStore = defineStore('employeeDetailsState', () => {
    const currentEmployee = ref({})
    const isShowDetails = ref(false);


    const createDetails = () => {
        isShowDetails.value = true;
        currentEmployee.value = {}
    };

    const showDetails = (employee) => {
        isShowDetails.value = true
        currentEmployee.value = employee
    }

    const hideDetails = () => {
        isShowDetails.value = false;
    };

    return {
        currentEmployee,
        isShowDetails,
        createDetails,
        showDetails,
        hideDetails,
    };
});
