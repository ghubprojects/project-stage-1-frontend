<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import VIcon from './VIcon.vue';

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
    tooltip: {
        type: Boolean,
        default: true
    },
    itemList: {
        type: Array,
        required: true
    },
    data: {
        type: Array,
        required: true
    },
    label: String,
    value: String,
    required: Boolean,
    firstFocus: Boolean,
    disabled: Boolean,
    class: String,
    title: String,
    placeholder: String,
    showError: Boolean,
    errMsgs: Object,
    pattern: RegExp
});

const emit = defineEmits(['selectItem', 'addErrorMessage', 'removeErrorMessage']);

const isOpening = ref(false);
const isShow = ref(false);

/**
 * Khi mounted, lấy dữ liệu đơn vị và nếu field có prop firstFocus, focus và select input text
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
onMounted(() => {
    if (props.firstFocus) {
        inputRef.value.focus();
        inputRef.value.select();
    }
});

/**
 * Khi focus input, select input đó
 * Created by: ttanh (28/09/2023)
 */
const selectText = () => {
    inputRef.value.select();
};

// mở dropdown items
const showDropdown = () => {
    isOpening.value = true;
    isShow.value = true;
};

// đóng dropdown items
const closeDropdown = () => {
    isOpening.value = false;
    isShow.value = false;
};

// khi click ra ngoài document, đóng dropdown items.
onMounted(() => document.addEventListener('click', closeDropdown));

// khi unmount, loại bỏ sự kiện click khỏi đối tượng document.
onBeforeUnmount(() => document.removeEventListener('click', closeDropdown));

/**
 * Focus vào input khi click expand button
 * Created by: ttanh (09/09/2023)
 */
const inputRef = ref(null);
const handleFocusInput = () => {
    inputRef.value.focus();
};

/**
 * Hiện dropdown items khi focus vào input hoặc click expand button
 * @param {event} event
 * Created by: ttanh (09/09/2023)
 */
const handleToggleItemList = (event) => {
    event.stopPropagation();
    isOpening.value = !isOpening.value;
};

// overflow text
const isOverflowInput = ref(false);

const direction = ref('down');
const comboboxRef = ref(null);

/**
 * Khi mở dropdown, lấy tọa độ dưới của dropdown menu và bảng dữ liệu,
 * nếu tọa độ dropdown > tọa độ bảng, hiển thị menu theo hướng lên trên;
 * ngược lại, hiển thị menu theo hướng xuống dưới
 * Created by: ttanh (15/08/2023)
 */
watch([isOpening], () => {
    if (
        comboboxRef.value.getBoundingClientRect().bottom + 183 >
        document.documentElement.getBoundingClientRect().bottom - 20
    )
        direction.value = 'up';
    else direction.value = 'down';

    isShow.value = isOpening.value;
});

const selectedValue = ref(props.value);

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

/**
 * Xử lý chọn item và đóng dropdown
 * @param {string} item
 * Created by: ttanh (26/09/2023)
 */
const handleSelectItem = (item) => {
    selectedValue.value = item;
    emit('selectItem', item);

    updateErrorMessage();
    closeDropdown();
};

/**
 * Two-way binding và hiện dropdown
 * @param {event} event
 * Created by: ttanh (26/09/2023)
 */
const handleInput = (event) => {
    const inputValue = event.target.value;
    selectedValue.value = inputValue;
    showDropdown();

    if (isEmpty.value || isInvalid.value) {
        showErrorInput.value = true;
        showErrorMessage.value = true;
    }

    // nếu input vượt quá width, gán isOverflowInput = true để hiển thị tooltip khi hover.
    if (inputRef.value.scrollWidth > inputRef.value.clientWidth) isOverflowInput.value = true;
    else isOverflowInput.value = false;
};

/**
 * === CHỨC NĂNG VALIDATE INPUT ===
 */
// Flag kiểm tra input rỗng
const isEmpty = computed(() => {
    return props.required && (!selectedValue.value || !selectedValue.value.trim());
});

// Flag kiểm tra input không hợp lệ
const isInvalid = computed(() => {
    return !props.data.includes(selectedValue.value);
});

// trả về thông báo lỗi dựa vào isEmpty / isInvalid
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
const showErrorInput = ref(props.showError);
const showErrorMessage = ref(props.showError);

//Khi thay đổi giá trị input, emit event addErrorMessage và thông báo lỗi
const handleChange = () => {
    updateErrorMessage();
};

// Khi mounted, reset thông báo lỗi
onMounted(() => {
    updateErrorMessage();
});

// nếu trạng thái isEmpty / isInvalid thay đổi, thay đổi giá trị showErrorMessage
watch([isEmpty, isInvalid], () => (showErrorMessage.value = isEmpty.value || isInvalid.value));

/**
 * === XỬ LÝ PHÍM TẮT ===
 * @param {event} event
 */
const selectedIndex = ref(-1);

/**
 * Xử lý lựa chọn item bằng bàn phím
 * @param {event} event
 * Created by: ttanh (28/09/2023)
 * Modified by: ttanh (29/09/2023)
 */
const handleSelectItemByKeyboard = (event) => {
    console.log(event);
    if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
        event.preventDefault();

        if (isOpening.value) {
            const currentIndex = props.itemList.indexOf(selectedValue.value);

            if (event.code === 'ArrowUp') {
                // Move down
                selectedIndex.value =
                    currentIndex < props.itemList.length - 1 ? currentIndex + 1 : 0;
            } else if (event.code === 'ArrowDown') {
                // Move up
                selectedIndex.value =
                    currentIndex > 0 ? currentIndex - 1 : props.itemList.length - 1;
            }

            selectedValue.value = props.itemList[selectedIndex.value];
        }
    } else if (event.code === 'Enter') {
        // Handle Enter key press
        event.preventDefault();
        if (!isOpening.value) {
            handleToggleItemList(event);
        } else handleSelectItem(selectedValue.value);
    }
};

/**
 * === COMPONENT STYLE ===
 */
const inputClass = computed(() => [
    `input-${props.size}`,
    `input-width-${props.width}`,
    { 'input-error': showErrorInput.value && (isEmpty.value || isInvalid.value) },
    { 'input-overflow': props.tooltip && isOverflowInput.value },
    props.class
]);

const dropdownClass = computed(() => {
    return [
        'dropdown-menu',
        direction.value === 'up' && `position-${direction.value}-${props.size}`
    ];
});
</script>

<template>
    <div
        class="combobox"
        ref="comboboxRef"
        @keydown.enter="handleSelectItemByKeyboard($event)"
        @keydown.down="handleSelectItemByKeyboard($event)"
        @keydown.up="handleSelectItemByKeyboard($event)"
    >
        <div class="label-group" v-if="label">
            <label :for="id">
                {{ label }}
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>

        <div class="input-group" @click="handleToggleItemList($event)">
            <input
                type="text"
                :id="id"
                :placeholder="placeholder"
                :disabled="disabled"
                :class="inputClass"
                :value="selectedValue"
                @input="handleInput($event)"
                @change="handleChange"
                @focus="selectText"
                ref="inputRef"
            />

            <div class="expand-button" @click="handleFocusInput">
                <div class="icon-arrow-down">
                    <VIcon class="arrow-down-img" />
                </div>
            </div>
        </div>

        <span class="tooltip" v-if="showErrorMessage || (tooltip && isOverflowInput)">
            {{ errorMessage ? errorMessage : selectedValue }}
        </span>

        <div v-if="isShow && itemList.length > 0" :class="dropdownClass">
            <div
                v-for="(item, index) in itemList"
                :key="index"
                :class="['dropdown-item', { selected: selectedValue === item }]"
                @click="handleSelectItem(item)"
            >
                {{ item }}
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

$--input-padding-left: 12px;
$--input-padding-right: 44px;
$--input-border-color: rgb(var(--c-gray-300));
$--input-placeholder-color: rgb(var(--c-gray-500));
$--input-hover-bg-color: rgb(var(--c-gray-100));
$--input-error-border-color: rgb(var(--c-red-500));

$--error-message-color: rgb(var(--c-white));
$--error-message-bg-color: rgb(var(--c-gray-900));

.combobox {
    cursor: pointer;
}

.input-small {
    height: $--input-small-height;
    padding: $--input-small-padding-y $--input-padding-right $--input-small-padding-y
        $--input-padding-left;
}
.input-medium {
    height: $--input-medium-height;
    padding: $--input-medium-padding-y $--input-padding-right $--input-medium-padding-y
        $--input-padding-left;
}
.input-large {
    height: $--input-large-height;
    padding: $--input-medium-padding-y $--input-padding-right $--input-medium-padding-y
        $--input-padding-left;
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
    &:focus {
        border-color: rgb(var(--c-primary));
    }
    input {
        @include font(14);
        font-family: var(--font-family-system);
        text-overflow: ellipsis;

        border-radius: 4px;
        border: 1px solid $--input-border-color;
        outline: none;
        cursor: pointer;

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
            & + .expand-button {
                border-color: $--input-error-border-color !important;
            }
        }

        &:not(.input-error):hover {
            background-color: $--input-hover-bg-color;
        }

        &:not(.input-error):focus,
        &:not(.input-error):focus + .expand-button {
            border-color: rgb(var(--c-primary));
        }
    }

    .expand-button {
        position: absolute;
        top: 0;
        right: 0;

        @include size(32px);
        border-left: 1px solid $--input-border-color;
        .icon-arrow-down {
            @include size(14px);
            filter: brightness(0);
            top: 50%;
            transform: rotate(90deg) translate(-50%, -50%) scale(0.8);
            cursor: pointer;
            .arrow-down-img {
                width: 8px;
                height: 14px;
                background-position: -84px -361px;
            }
        }
    }
}

/* Style tooltip */
.tooltip {
    position: absolute;
    left: 16px;
    display: none;
    top: 52px;
    z-index: 50;

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

.dropdown-menu {
    @include font(14);
    position: absolute;
    padding: 8px;

    display: flex;
    flex-direction: column-reverse;
    border-radius: 4px;
    width: 100%;

    max-height: 200px;
    background-color: rgb(var(--c-white));
    border: 1px solid rgb(var(--c-gray-300));
    z-index: 20;

    .dropdown-item {
        padding: 8px;
        border-radius: 4px;
        &:hover {
            background-color: rgb(var(--c-light-green-100));
        }
        &.selected {
            background-color: rgb(var(--c-light-green-100));
        }
    }
}

.position-up-large {
    bottom: $--input-large-height;
}
.position-up-medium {
    bottom: $--input-medium-height;
}
.position-up-small {
    bottom: $--input-small-height;
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
