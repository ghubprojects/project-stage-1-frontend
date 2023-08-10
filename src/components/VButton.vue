<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        default: 'primary',
        validator(val) {
            return ['primary', 'outline'].includes(val);
        }
    },
    size: {
        type: String,
        default: 'medium',
        validator(val) {
            return ['large', 'medium', 'small'].includes(val);
        }
    },
    disabled: Boolean
});

/**
 * Based on the type and size props passed in,
 * assign classes to style each corresponding type and size of button.
 */
const buttonClass = computed(() => ['button', `button-${props.type}`, `button-${props.size}`]);

/**
 * If the disabled prop is passed in, set the disabled state for the button.
 */
const isDisabled = computed(() => props.disabled);
</script>

<template>
    <button :class="buttonClass" :disabled="isDisabled">
        <slot></slot>
    </button>
</template>

<style scoped lang="scss">
$--button-min-width: 80px;
$--button-padding-x: 16px;

$--button-small-height: 32px;
$--button-small-padding-y: 7px;

$--button-medium-height: 36px;
$--button-medium-padding-y: 9px;

$--button-large-height: 40px;
$--button-large-padding-y: 11px;

$--button-primary-color: rgb(var(--c-white));
$--button-primary-bg-color: var(--c-primary);
$--button-primary-hover-bg-color: rgb(var(--c-light-green-500));
$--button-primary-pressed-bg-color: rgb(var(--c-green-600));

$--button-outline-color: rgb(var(--c-gray-900));
$--button-outline-bg-color: rgb(var(--c-white));
$--button-outline-border-color: rgb(230, 230, 230);
$--button-outline-hover-bg-color: rgb(var(--c-gray-100));
$--button-outline-pressed-bg-color: rgb(var(--c-gray-200));

@import '@/styles/mixins.scss';
.button-small {
    height: $--button-small-height;
    padding: $--button-small-padding-y $--button-padding-x;
}
.button-medium {
    height: $--button-medium-height;
    padding: $--button-medium-padding-y $--button-padding-x;
}
.button-large {
    height: $--button-large-height;
    padding: $--button-large-padding-y $--button-padding-x;
}

.button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;

    @include font(14);
    font-family: var(--font-family-system);
    font-weight: 500;
    cursor: pointer;
}

.button-primary {
    min-width: $--button-min-width;
    color: $--button-primary-color;
    background-color: $--button-primary-bg-color;
    border: none;
    &:hover:not(:disabled) {
        background-color: $--button-primary-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-primary-pressed-bg-color;
    }
}

.button-outline {
    min-width: $--button-min-width;
    border: 1px solid $--button-outline-border-color;
    color: $--button-outline-color;
    background-color: $--button-outline-bg-color;
    &:hover:not(:disabled) {
        background-color: $--button-outline-hover-bg-color;
    }
    &:active:not(:disabled) {
        background-color: $--button-outline-pressed-bg-color;
    }
}

.button:disabled {
    cursor: not-allowed;
    opacity: 0.56;
}
</style>
