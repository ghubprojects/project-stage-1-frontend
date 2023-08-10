<script setup>
import { ref, computed, useSlots, watch } from 'vue';

const props = defineProps({
    size: {
        type: String,
        default: 'medium',
        validator(val) {
            return ['large', 'medium', 'small'].includes(val);
        }
    },
    width: {
        type: String,
        default: 'medium',
        validator(val) {
            return ['extra-large', 'large', 'medium', 'small', 'extra-small'].includes(val);
        }
    },
    id: {
        type: String,
        required: true
    },
    placeholder: {
        type: String
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    },
    pattern: {
        type: RegExp
    }
});

// Show label if exists
const slots = useSlots();
const hasLabel = slots.label;

// Biến lưu trữ giá trị input.
const inputValue = ref(props.value);

// Check empty input
const isEmpty = computed(() => {
    return props.required ? !inputValue.value || !inputValue.value.trim() : false;
});

// Check invalid input
const isInvalid = computed(() => {
    return props.pattern && !props.pattern.test(inputValue.value);
});

/**
 * Based on the size and width props passed in,
 * assign classes to style each corresponding size and width of input.
 */
const showErrorInput = ref(false);
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    { 'input-error': showErrorInput.value && (isEmpty.value || isInvalid.value) }
]);

const errorMessage = computed(() => {
    if (isEmpty.value) {
        return props.errMsgs.isEmpty;
    } else if (isInvalid.value) {
        return props.errMsgs.isInvalid;
    } else {
        return '';
    }
});

/**
 * Khi thay đổi giá trị input,
 * hiển thị những input bị lỗi (viền đỏ) nếu input trống hoặc không hợp lệ.
 */
const handleChange = () => {
    showErrorInput.value = true;
};

/**
 * Khi isEmpty hoặc isInvalid thay đổi, cập nhật lại giá trị showErrorMessage tương ứng.
 */
const showErrorMessage = ref(false);
watch([isEmpty, isInvalid], () => (showErrorMessage.value = isEmpty.value || isInvalid.value));
</script>

<template>
    <div class="datefield">
        <div class="label-group" v-if="hasLabel">
            <label :for="id" :title="title">
                <slot name="label"></slot>
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div class="input-group">
            <input
                type="date"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                v-model="inputValue"
                @change="handleChange"
            />
        </div>
        <span
            class="error-message"
            v-if="showErrorMessage"
            @mouseenter="showErrorMessage = true"
            @mouseleave="showErrorMessage = false"
        >
            {{ errorMessage }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--label-color: rgb(var(--c-gray-900));
$--label-required-mark-color: rgb(var(--c-red-500));

$--input-small-height: 32px;
$--input-small-padding-y: 6px;

$--input-medium-height: 36px;
$--input-medium-padding-y: 8px;

$--input-large-height: 40px;
$--input-large-padding-y: 10px;

$--input-padding-x: 12px;
$--input-border-color: rgb(var(--c-gray-300));
$--input-placeholder-color: rgb(var(--c-gray-500));
$--input-hover-bg-color: rgb(var(--c-gray-100));
$--input-error-border-color: rgb(var(--c-red-500));

$--error-message-color: rgb(var(--c-white));
$--error-message-bg-color: rgb(var(--c-gray-900));

.input-small {
    height: $--input-small-height;
    padding: $--input-small-padding-y $--input-padding-x;
}
.input-medium {
    height: $--input-medium-height;
    padding: $--input-medium-padding-y $--input-padding-x;
}
.input-large {
    height: $--input-large-height;
    padding: $--input-large-padding-y $--input-padding-x;
}

.label-group {
    margin-bottom: 8px;
    label {
        @include font(14, 500);
        color: $--label-color;
    }
    .required-mark {
        color: $--label-required-mark-color;
    }
}

.input-group {
    input {
        @include font(14);
        font-family: var(--font-family-system);

        border-radius: 4px;
        border: 1px solid $--input-border-color;
        outline: none;

        &::placeholder {
            @include font(14);
            color: $--input-placeholder-color;
        }
        &.input-error {
            border-color: $--input-error-border-color !important;
            &:hover,
            &:focus {
                border-color: $--input-error-border-color !important;
            }
        }

        &:not(.input-error):hover {
            background-color: $--input-hover-bg-color;
        }

        &:not(.input-error):focus {
            border-color: rgb(var(--c-primary));
        }
    }
}

/* Style error message */
.error-message {
    position: absolute;
    left: 16px;
    bottom: -16px;
    display: none;

    @include font(12);
    padding: 4px;
    border-radius: 2px;
    color: $--error-message-color;
    background-color: $--error-message-bg-color;

    .input-group:has(.input-error:hover) + & {
        display: flex;
    }
}

/* === Width of input === */
.input-width-full {
    width: 100%;
}

.input-width-extra-large {
    width: 250px;
}
.input-width-large {
    width: 200px;
}
.input-width-medium {
    width: 180px;
}
.input-width-small {
    width: 150px;
}
.input-width-extra-small {
    width: 120px;
}
</style>
