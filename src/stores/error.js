import { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

import { ErrorResources } from '@/resources';
import { useLanguageStore } from './language';
import { useDialogStore } from './dialog';
import { DialogName } from '@/utils/enum';

/**
 * Quản lí trạng thái lỗi
 */
export const useErrorStore = defineStore('errorState', () => {
    const current = ref('')

    /**
     * Reset thông báo lỗi global
     * Created by: ttanh (30/09/2023)
     */
    const setEmpty = () => {
        current.value = ''
    };

    /**
     * Tạo thông báo lỗi global
     * @param {error} error 
     * Created by: ttanh (30/10/2023)
     */
    const setCurrent = (error) => {
        const Languague = useLanguageStore()
        const Dialog = useDialogStore()

        if (error instanceof AxiosError) {
            if (error.code === "ERR_NETWORK")
                current.value = ErrorResources[Languague.current].ConnectionError
            else if (error.code === "ERR_BAD_REQUEST") {
                current.value = error.response.data.Errors[0]
            } else current.value = error.response.data.UserMessage
            Dialog.show(DialogName.GlobalError)
        }
        else current.value = error
        console.log('set error:', current.value);
    }

    return {
        current,
        setCurrent,
        setEmpty,
    };
});
