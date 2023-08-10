import { reactive } from 'vue';

const state = reactive({
    previousRow: null,
    currentRow: null,
    showTablePopup: false,
    employeePopupData: {},
});

export default state;
