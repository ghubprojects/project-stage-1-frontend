<script setup>
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import { VDialog, VToastMessage } from '@/components';
import { TheContent, TheHeader, TheSidebar } from '@/layouts';

import { useDialogStore } from '@/stores/dialog';
import { useErrorStore } from '@/stores/error';
import { useToastMessageStore } from '@/stores/toastmessage';

import { ButtonResources, DialogResources } from '@/resources';
import { useLanguageStore } from '@/stores/language';
import { DialogName } from '@/utils/enum';

const Error = useErrorStore();
const Dialog = useDialogStore();
const ToastMessage = useToastMessageStore();
const Language = useLanguageStore();

const isShowError = ref(false);
const { current: errorCurrent } = storeToRefs(Error);
const { current: dialogCurrent } = storeToRefs(Dialog);

/**
 * Khi Error.current hoặc Dialog.current thay đổi, cập nhật lại giá trị flag hiển thị lỗi
 */
watch([errorCurrent, dialogCurrent], () => {
    isShowError.value = errorCurrent.value && dialogCurrent.value;
});
</script>

<template>
    <div id="main">
        <TheSidebar />
        <div id="content-container">
            <TheHeader />
            <TheContent />
        </div>
        <VToastMessage v-if="ToastMessage.isShow" :type="ToastMessage.current.type" />
        <VDialog
            v-if="isShowError && dialogCurrent === DialogName.GlobalError"
            :title="DialogResources[Language.current].GlobalError.title"
            :text="errorCurrent"
            :primary-text="ButtonResources[Language.current].Close"
            @handle-primary="Dialog.hide"
        />
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';

#main {
    display: flex;
    #content-container {
        width: calc(100% - var(--sidebar-width));
        height: 100vh;
    }
}
</style>
