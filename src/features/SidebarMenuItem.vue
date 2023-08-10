<script setup>
defineProps({
    icon: {
        type: Object,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});
</script>

<template>
    <div class="menu-item">
        <component :is="icon" class="icon" />
        <div class="title">{{ title }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

/* Styles for menu-item */
.menu-item {
    display: flex;
    padding: 10px 12px;
    gap: 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background-color: rgba(var(--c-gray-600), 0.9);
    }

    .icon {
        @include size(24px);
    }

    .title {
        @include font('14');
        font-weight: 500;
        color: rgb(var(--c-white));
    }
}
</style>
