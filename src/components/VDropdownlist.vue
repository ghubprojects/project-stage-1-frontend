<template>
    <div class="dropdown">
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
            <IconArrowDown class="arrow-down-icon" />
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

<script>
import { ref, computed } from 'vue';
import cx from 'classnames';
import { IconArrowDown } from '@/assets/icons';
export default {
    name: 'BaseDropdownlist',
    props: {
        size: {
            type: String,
            default: 'medium',
            validator(value) {
                return ['large', 'medium', 'small'].includes(value);
            }
        },
        width: {
            type: String,
            default: 'medium',
            validator(value) {
                return ['full', 'extra-large', 'large', 'medium', 'small', 'extra-small'].includes(
                    value
                );
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
    },
    setup(props, context) {
        const isOpen = ref(false);
        const selectedValue = ref(props.options[0]);

        /**
         * The variable "hasLabel" checks whether a Textfield contains the label or not.
         * If it does, it adds the class 'has-label' to the label tag.
         */
        const hasLabel = context.slots.label;

        /**
         * Based on the size and width props passed in,
         * assign classes to style each corresponding size and width of input.
         */
        const inputClass = computed(() => cx(`input-size-${props.size}`, `input-width-${props.width}`));

        const handleOptionClick = (option) => {
            selectedValue.value = option;
            isOpen.value = false;
        };

        return { inputClass, isOpen, selectedValue, handleOptionClick, hasLabel };
    },
    components: { IconArrowDown }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
label,
input,
input::placeholder {
    @include font('base');
}

label {
    font-weight: var(--font-weight-medium);
}

.label-group {
    @apply flex mb-2;
    .required-mark {
        color: var(--red-500);
        line-height: 18px;
    }
}

.input-group {
    input {
        @apply px-3 py-2 rounded cursor-pointer;
        @include font('small');
        border: 1px solid var(--gray-300);
        &::placeholder {
            color: var(--gray-500);
        }
        &:focus {
            border-color: var(--primary);
            outline: none;
        }
    }
    &:hover input {
        background-color: var(--gray-200);
    }
    .arrow-down-icon {
        @apply absolute top-1/2 right-2 cursor-pointer;
        @include size(14px);
        transform: translateY(-50%) scale(calc(16 / 14));
    }
}

.dropdown-menu {
    @apply absolute bottom-8 w-full p-2 rounded flex flex-col-reverse;
    max-height: 200px;
    background-color: var(--white);
    border: 1px solid var(--gray-300);
    .dropdown-item {
        @apply p-2 rounded cursor-pointer;
        &:hover {
            background-color: var(--lightgreen-100);
        }
    }
}

.selected {
    background-color: var(--lightgreen-100);
}

/* Change the border-color of textfield input if it's get error */
.input-group > .input-error {
    border-color: var(--red-500) !important;
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
</style>
