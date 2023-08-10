<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'default',
        validator: (value) => ['default', 'primary', 'link', 'icon'].includes(value)
    },
    size: {
        size: String,
        default: 'medium',
        validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    icon: {
        type: Node,
        default: null
    }
});

console.log(props);

const buttonClass = computed(() => {
    const classNames = ['button', `button-${props.type}`, `button-${props.size}`];
    return classNames.join(' ');
});

const iconClass = computed(() => {
    return 'icon';
});
</script>

<template>
    <button :class="buttonClass">
        <component :is="props.icon" v-if="icon" :class="iconClass"></component>
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
@import '@/styles/mixins.scss';
.button {
    /* Common button styles */
    @include font(14);
    border-radius: 4px;
    border: none;
    cursor: pointer;

    &.button-default {
        /* Default button styles */
        background-color: #f0f0f0;
        color: #333;
    }

    &.button-primary {
        /* Primary button styles */
        background-color: var(--c-blue-500);
        color: #fff;

        min-width: 80px;
        padding: 0 16px;
    }

    &.button-link {
        /* Link button styles */
        background-color: transparent;
        color: #007bff;
        text-decoration: underline;
    }

    &.button-icon {
        /* Icon button styles */
        background-color: transparent;
        color: #333;

        &:hover {
            background-color: #f0f0f0;
        }
    }

    &.button-icon i {
        /* Icon styles */
        margin-right: 8px;
    }

    &.button-small {
        /* small button size */
        height: 32px;
    }
    &.button-medium {
        /* medium button size */
        height: 36px;
    }
    &.button-large {
        /* large button size */
        height: 40px;
    }
}
</style>
