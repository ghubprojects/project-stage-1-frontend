<template>
    <div class="textfield">
        <div class="label-group" v-if="hasLabel">
            <label :for="id" :title="title">
                <slot name="label"></slot>
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div class="input-group">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                v-model="inputValue"
                @change="handleChange()"
                ref="inputRef"
            />
            <i class="icon">
                <slot name="icon"></slot>
            </i>
        </div>
        <span class="error-message" v-if="showErrorMessage && (isEmpty || isInvalid)">{{
            errorMessage
        }}</span>
    </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import cx from 'classnames';
export default {
    name: 'VTextfield',
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
        title: {
            type: String
        },
        placeholder: {
            type: String
        },
        value: {
            type: String,
            default: null
        },
        required: {
            type: Boolean,
            default: false
        },
        errMsgs: {
            type: Object
        },
        firstFocus: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        pattern: {
            type: RegExp
        }
    },
    emits: ['textValue'],
    setup(props, context) {
        const showErrorMessage = ref(false);

        /**
         * Biến hasLabel và hasIcon kiểm tra xem Textfield có label và icon không.
         * Nếu có, thêm class 'has-label' cho label tag và 'has-icon' cho input tag.
         */
        const hasLabel = context.slots.label;
        const hasIcon = context.slots.icon;

        /**
         * Dựa vào props size và width được truyền vào,
         * gán custom class để style cho mỗi size và width của input tương ứng.
         */
        const inputClass = computed(() =>
            cx(
                `input-size-${props.size}`,
                `input-width-${props.width}`,
                { 'input-has-icon': hasIcon },
                { 'input-error': showErrorMessage.value && isInvalid.value }
            )
        );

        // Biến lưu trữ giá trị input.
        const inputValue = ref(props.value);

        const isEmpty = computed(() => {
            return props.required && !inputValue.value.trim();
        });

        const isInvalid = computed(() => {
            return (
                (props.required && !inputValue.value.trim()) ||
                (props.pattern && !props.pattern.test(inputValue.value))
            );
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

        /**
         * Khi thay đổi giá trị input,
         * cho phép có thể hiển thị errorMessage nếu input trống hoặc không hợp lệ.
         * Emit dữ liệu inputValue lên TablePopup component.
         */
        const handleChange = () => {
            showErrorMessage.value = true;
            context.emit('textValue', inputValue.value);
        };

        const inputRef = ref(null);
        onMounted(() => {
            if (props.firstFocus) inputRef.value.focus();
        });

        return {
            inputRef,
            hasLabel,
            hasIcon,
            showErrorMessage,
            inputValue,
            isEmpty,
            isInvalid,
            errorMessage,
            inputClass,
            handleChange
        };
    }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
label,
input,
input::placeholder {
    @include font(14);
}

label {
    font-weight: 500;
}

.label-group {
    @apply flex mb-2;
    .required-mark {
        color: rgb(var(--c-red-500));
        line-height: 18px;
    }
}

.input-group {
    input {
        @apply px-3 py-2 rounded;
        border: 1px solid rgb(var(--c-gray-300));
        &::placeholder {
            color: rgb(var(--c-gray-500));
        }
        &:focus {
            border-color: rgb(var(--c-primary));
            outline: none;
        }
    }
    &:hover input {
        background-color: rgb(var(--c-gray-200));
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
    border-color: rgb(var(--c-red-500) !important);
}

/* Style error message */
.input-group:has(.input-error) + .error-message {
    display: flex;
    margin-top: 8px;
    font-size: rgb(var(--font-size-extra-small));
    color: rgb(var(--c-red-500));
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
