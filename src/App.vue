<script setup>
import { TheContent, TheHeader, TheSidebar } from '@/layouts';
import { VToastMessage } from './components';
import { useToastMessageStore } from './stores/toastMessage';

const ToastMessage = useToastMessageStore();
</script>

<template>
    <div id="main">
        <TheSidebar />
        <div id="content-container">
            <TheHeader />
            <TheContent />
        </div>
        <VToastMessage v-if="ToastMessage.isShow" :type="ToastMessage.current.type" />
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
