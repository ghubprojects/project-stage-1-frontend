<script setup>
import { ref, computed, useSlots } from 'vue';
import { IconArrowDown } from '@/assets/icons';

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
            return ['full', 'extra-large', 'large', 'medium', 'small', 'extra-small'].includes(val);
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
    options: {
        type: Array,
        required: true
    }
});

const isOpen = ref(false);
const selectedValue = ref(props.options[0]);

/**
 * The variable "hasLabel" checks whether a Textfield contains the label or not.
 * If it does, it adds the class 'has-label' to the label tag.
 */
const slots = useSlots();
const hasLabel = slots.label;

/**
 * Based on the size and width props passed in,
 * assign classes to style each corresponding size and width of input.
 */
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    'input-has-icon'
]);

const handleOptionClick = (option) => {
    selectedValue.value = option;
    isOpen.value = false;
};
</script>

<template>
    <div class="dropdown-list">
        <div class="label-group" v-if="hasLabel">
            <label :for="id">
                <slot name="label"></slot>
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>

        <div class="input-group" @click="isOpen = !isOpen">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                v-model="selectedValue"
                readonly
            />
            <IconArrowDown class="icon" />
        </div>

        <div v-if="isOpen" class="dropdown-menu">
            <div
                v-for="(option, index) in options"
                :key="index"
                class="dropdown-item"
                :class="{ selected: selectedValue === option }"
                @click="handleOptionClick(option)"
            >
                {{ option }}
            </div>
        </div>
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

.dropdown-list {
    cursor: pointer;
}

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
        @include font(13);
        font-family: var(--font-family-system);

        border-radius: 4px;
        border: 1px solid $--input-border-color;
        outline: none;

        &::placeholder {
            @include font(13);
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
            padding-right: 28px;
        }
    }

    .icon {
        position: absolute;
        top: 50%;
        right: 8px;

        @include size(14px);
        transform: translateY(-50%) scale(calc(16 / 14));
        cursor: pointer;
    }
}
.dropdown-menu {
    position: absolute;
    bottom: 32px;
    padding: 8px;

    display: flex;
    flex-direction: column-reverse;
    border-radius: 4px;
    width: 100%;

    max-height: 200px;
    background-color: rgb(var(--c-white));
    border: 1px solid rgb(var(--c-gray-300));
    .dropdown-item {
        padding: 8px;
        border-radius: 4px;
        &:hover {
            background-color: rgb(var(--c-light-green-100));
        }
    }
}

.selected {
    background-color: rgb(var(--c-light-green-100));
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
