<script setup>
import { computed } from 'vue';

const props = defineProps({
    size: {
        type: String,
        default: 'medium',
        validator(value) {
            return ['large', 'medium', 'small'].includes(value);
        }
    },

    type: {
        type: String,
        default: 'primary',
        validator(value) {
            return ['primary', 'outline'].includes(value);
        }
    },

    disabled: {
        type: Boolean,
        default: false
    },

    text: {
        type: String,
        required: true
    }
});

/**
 * Based on the size and type props passed in,
 * assign classes to style each corresponding size and type of button.
 */
const buttonClass = computed(() => `button button-${props.size} button-${props.type}`);

/**
 * If the disabled prop is passed in, set the disabled state for the button.
 */
const isDisabled = computed(() => props.disabled);
</script>

<template>
    <button :class="buttonClass" :disabled="isDisabled">
        <span class="button-text">{{ text }}</span>
    </button>
</template>

<style scoped lang="scss">
@import '@/styles/mixins.scss';
.button-large {
    height: 40px;
}
.button-medium {
    height: 36px;
}
.button-small {
    height: 32px;
}

.button {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    padding: 8px 16px 8px 12px;
    border-radius: 4px;
    .button-text {
        padding-left: 4px;
        font-size: var(--font-size-14);
        font-weight: 500;
        font-family: var(--font-family-system);
    }
}

.button-primary {
    min-width: 80px;
    background-color: rgb(var(--c-primary));
    border: none;
    &:hover {
        background-color: rgb(var(--c-light-green-500));
    }
    .button-text {
        color: rgb(var(--c-white));
    }
}

.button-outline {
    min-width: 80px;
    border: 2px solid rgb(var(--c-gray-300));
    background-color: transparent;
    &:hover {
        border: none;
        background-color: rgb(var(--c-gray-400));
    }
    .button-text {
        color: rgb(var(--c-gray-900));
    }
}

.button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>
