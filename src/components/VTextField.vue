<script setup>
import { EmployeeFields } from '@/utils/enum';
import { computed, onMounted, ref, useSlots, watch, onUpdated } from 'vue';

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
            return [
                'full',
                'extra-extra-large',
                'extra-large',
                'large',
                'medium',
                'small',
                'extra-small'
            ].includes(val);
        }
    },
    id: {
        type: String,
        required: true
    },
    tooltip: {
        type: Boolean,
        default: true
    },
    label: String,
    value: [String, Number],
    required: Boolean,
    maxLength: Number,
    firstFocus: Boolean,
    disabled: Boolean,
    class: String,
    title: String,
    placeholder: String,
    showError: Boolean,
    errMsgs: Object,
    pattern: RegExp
});

const emit = defineEmits(['update:input', 'addErrorMessage', 'removeErrorMessage']);

/**
 * Biến hasIcon kiểm tra xem Textfield có icon không.
 * Nếu có, thêm class 'has-icon' cho input tag.
 */
const slots = useSlots();
const hasIcon = slots.icon;

const inputRef = ref(null);
const inputValue = ref(props.value);

/**
 * Khi mounted, nếu field có prop firstFocus, focus và select input text
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
onMounted(() => {
    if (props.firstFocus || props.id === EmployeeFields.EmployeeCode) {
        inputRef.value.focus();
        inputRef.value.select();
    }
});

/**
 * Khi updated, nếu field có prop firstFocus, focus input text
 * Created by: ttanh (08/10/2023)
 */
onUpdated(() => {
    if (props.firstFocus) {
        inputRef.value.focus();
    }
});

/**
 * Khi focus input, select input đó
 * Created by: ttanh (28/09/2023)
 */
const selectText = () => {
    inputRef.value.select();
};

/**
 * === CHỨC NĂNG VALIDATE INPUT ===
 */
// Flag kiểm tra input rỗng
const isEmpty = computed(() => {
    return props.required && (!inputValue.value || !inputValue.value.trim());
});

// Flag kiểm tra input không hợp lệ
const isInvalid = computed(() => {
    return props.pattern && !props.pattern.test(inputValue.value);
});

// Flag kiểm tra input vượt quá max length
const isOverflow = computed(() => {
    return inputValue.value && inputValue.value.length === props.maxLength;
});

// Thông báo lỗi tương ứng với isEmpty / isInvalid
const errorMessage = computed(() => {
    if (isEmpty.value) {
        return props.errMsgs.isEmpty;
    } else if (isInvalid.value) {
        return props.errMsgs.isInvalid;
    } else if (isOverflow.value) {
        return props.errMsgs.isOverflow;
    } else {
        return '';
    }
});

// Flag kiểm tra khi độ dài input text lớn hơn width
const isOverflowInput = ref(false);

const showErrorInput = ref(props.showError);
const showErrorMessage = ref(props.showError);

/**
 * Emit dữ liệu input.
 * Khi input được nhập, hiển thị errorMessage nếu input trống hoặc không hợp lệ.
 * Created by: ttanh (12/08/2023)
 */
const handleInput = (event) => {
    if (event.target.value.length > props.maxLength) {
        event.target.value = event.target.value.substring(0, props.maxLength);
    }

    emit('update:input', event.target.value);
    inputValue.value = String(inputRef.value.value);

    if (isEmpty.value || isInvalid.value || isOverflow.value) {
        showErrorInput.value = true;
        showErrorMessage.value = true;
    }

    // nếu input vượt quá width, gán isOverflowInput = true để hiển thị tooltip khi hover.
    if (inputRef.value.scrollWidth > inputRef.value.clientWidth) isOverflowInput.value = true;
    else isOverflowInput.value = false;
};

/**
 * Cập nhật thông báo lỗi validate
 */
const updateErrorMessage = () => {
    if (props.errMsgs) {
        emit('removeErrorMessage', props.id);
        if (errorMessage.value)
            emit('addErrorMessage', { id: props.id, message: errorMessage.value, focus: false });
    }
};

//Khi thay đổi giá trị input, emit event addErrorMessage và thông báo lỗi
const handleChange = () => {
    updateErrorMessage();
};

// Khi mounted, reset thông báo lỗi
onMounted(() => {
    updateErrorMessage();
});

// nếu trạng thái isEmpty / isInvalid thay đổi, thay đổi giá trị showErrorMessage
watch(
    [isEmpty, isInvalid, isOverflow],
    () => (showErrorMessage.value = isEmpty.value || isInvalid.value || isOverflow.value)
);

/**
 * Dựa vào props size và width được truyền vào,
 * gán custom class để style cho mỗi size và width của input tương ứng.
 */
const inputGroupClass = computed(() => ['input-group', `input-width-${props.width}`]);
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    { 'input-has-icon': hasIcon },
    {
        'input-error':
            showErrorInput.value && (isEmpty.value || isInvalid.value || isOverflow.value)
    },
    { 'input-overflow': props.tooltip && isOverflowInput.value },
    props.class
]);
</script>

<template>
    <div class="textfield">
        <div class="label-group" v-if="label">
            <label :for="id" :title="title">
                {{ label }}
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div :class="inputGroupClass">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :value="inputValue"
                @input="handleInput($event)"
                @change="handleChange"
                @focus="selectText"
                ref="inputRef"
            />
            <i class="icon" v-if="hasIcon">
                <slot name="icon"></slot>
            </i>
        </div>
        <span class="tooltip" v-if="showErrorMessage || (tooltip && isOverflowInput)">
            {{ errorMessage ? errorMessage : inputValue }}
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

.textfield {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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
        @include font(14);
        font-family: var(--font-family-system);
        text-overflow: ellipsis;

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
        @include size(20px);
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
    }
}

/* Style tooltip */
.tooltip {
    position: absolute;
    left: 16px;
    display: none;
    top: 52px;
    z-index: 5;

    @include font(12);
    padding: 4px;
    border-radius: 2px;
    color: $--error-message-color;
    background-color: $--error-message-bg-color;

    .input-group:has(.input-error:hover) + & {
        display: flex;
    }
    .input-group:has(.input-overflow:hover) + & {
        display: flex;
    }
}

/* === Width of input === */
.input-width-full {
    width: 100%;
}

.input-width-extra-extra-large {
    width: 320px;
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
