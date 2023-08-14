<script setup>
import { TheContent, TheHeader, TheSidebar } from '@/layouts';
</script>

<template>
    <div id="main">
        <TheSidebar />
        <div id="content-container">
            <TheHeader />
            <TheContent />
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/global.scss';

#main {
    display: flex;
    #content-container {
        width: var(--content-width);
        height: 100vh;
    }
}
</style>
