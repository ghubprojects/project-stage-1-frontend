import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDialogStore = defineStore('dialogState', () => {
    const init = { name: '', }

    const current = ref(init)

    // hiển thị dialog
    const show = (name) => {
        if (name) current.value.name = name
    }

    // ẩn dialog
    const hide = () => {
        current.value = init
    };

    return {
        current,
        show,
        hide,
    };
});
