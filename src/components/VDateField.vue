<template>
    <div class="datefield">
        <div class="label-group" v-if="hasLabel">
            <label :for="id">
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
            />
            <i class="icon">
                <slot name="icon"></slot>
            </i>
        </div>
        <span class="error-message" v-if="isInvalid">{{ errorMessage }}</span>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import cx from 'classnames';
export default {
    name: 'VDatefield',
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
                return ['extra-large', 'large', 'medium', 'small', 'extra-small'].includes(value);
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
    },
    setup(props, context) {
        /**
         * The variable "hasLabel, hasIcon" checks whether a datefield contains a label, a icon or not.
         * If it does, it adds the class 'has-label' to the label tag, 'has-icon' to the input tag.
         */
        const hasLabel = context.slots.label;

        /**
         * Based on the size and width props passed in,
         * assign classes to style each corresponding size and width of input.
         */
        const inputClass = computed(() =>
            cx(`input-size-${props.size}`, `input-width-${props.width}`, {
                'input-error': isInvalid.value
            })
        );

        const inputValue = ref('');

        const isInvalid = computed(() => {
            return (
                (props.required && !inputValue.value.trim()) ||
                (props.pattern && !props.pattern.test(inputValue.value))
            );
        });
        const errorMessage = computed(() => {
            if (props.required && !inputValue.value.trim()) {
                return 'This field is required';
            } else if (props.pattern && !props.pattern.test(inputValue.value)) {
                return 'Please enter a valid input';
            } else {
                return '';
            }
        });
        return {
            hasLabel,
            inputValue,
            isInvalid,
            errorMessage,
            inputClass
        };
    }
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
        @apply px-3 py-2 rounded;
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
    input.has-icon {
        padding-right: 32px;
    }
    .icon {
        @apply absolute top-1/2 right-2;
        transform: translateY(-50%);
    }
}

/* Change the border-color of textfield input if it's get error */
.input-group > .input-error {
    border-color: var(--red-500) !important;
}

/* Style error message */
.input-group:has(.input-error) + .error-message {
    display: flex;
    margin-top: 8px;
    font-size: var(--font-size-extra-small);
    color: var(--red-500);
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