<template>
    <div id="sidebar">
        <div class="logo">
            <IconOption class="option-icon" />
            <VImage :src="logoSrc" alt="logo-image" class="logo-image" />
        </div>
        <div class="menu">
            <TheMenuItem
                v-for="(menuItem, index) in menuItemList"
                :key="index"
                :icon="menuItem.icon"
                :title="menuItem.title"
            />
        </div>
    </div>
</template>

<script setup>
import { IconOption } from '@/assets/icons';
import { VImage } from '@/components';
import { menuItemList } from '@/utils/menuItemList';
import { ref } from 'vue';
import TheMenuItem from './SidebarMenuItem.vue';

const logoSrc = ref('src/assets/images/logo.svg');
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
#sidebar {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(var(--c-gray-900), 0.9);
}

.logo {
    display: flex;
    gap: 20px;
    align-items: center;
    height: var(--header-height);
    .option-icon {
        @include size(24px);
        cursor: pointer;
    }

    .logo-image {
        height: 32px;
        cursor: pointer;
    }
}

.menu {
    display: flex;
    padding: 12px;
    flex-direction: column;
    gap: 4px;

    width: var(--sidebar-width);
    height: calc(100vh - var(--header-height));
    overflow-y: overlay;
}
</style>
