<script setup>
import { ref, computed, useSlots } from 'vue';
const props = defineProps({
    id: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    },
    required: {
        type: Boolean,
        default: false
    }
});

/**
 * The variable "hasLabel, hasIcon" checks whether a radiofield contains a label, a icon or not.
 * If it does, it adds the class 'has-label' to the label tag, 'has-icon' to the input tag.
 */
const slots = useSlots();
const hasLabel = slots.label;

// Biến lưu trữ giá trị input.
const inputValue = ref('');

// Check empty input
const isEmpty = computed(() => {
    return props.required ? !inputValue.value || !inputValue.value.trim() : false;
});

// Check invalid input
const isInvalid = computed(() => {
    return props.pattern && !props.pattern.test(inputValue.value);
});

const errorMessage = computed(() => {
    if (isEmpty.value) {
        return props.errMsgs.isEmpty;
    } else if (isInvalid.value) {
        return props.errMsgs.isInvalid;
    } else {
        return '';
    }
});
</script>

<template>
    <div class="radiofield">
        <div class="label-group" v-if="hasLabel">
            <label :for="id">
                <slot name="label"></slot>
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div class="input-group">
            <slot name="input"></slot>
        </div>
        <span class="error-message" v-if="isInvalid">{{ errorMessage }}</span>
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

        &.input-has-icon {
            padding-right: 32px;
        }
    }

    .icon {
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
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

/* === Size of input ===*/
.input-size-large {
    height: 40px;
}
.input-size-medium {
    height: 36px;
}
.input-size-small {
    height: 32px;
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
/* Input-group */
.radiofield > .input-group {
    display: flex;
    gap: 12px;
}
</style>
