<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    parse,
    startOfMonth,
    subMonths
} from 'date-fns';
import { enGB, vi } from 'date-fns/locale';

import { IconArrowLeft, IconArrowRight } from '@/assets/icons';
import { VButton, VIcon } from '@/components';
import { FieldResources } from '@/resources';
import { useDateFormatStore, useLanguageStore } from '@/stores';
import { DateFormatList, LanguageList } from '@/utils/enum';

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
    label: String,
    value: String,
    disabled: Boolean,
    required: Boolean,
    class: String,
    title: String,
    showError: Boolean,
    errMsgs: Object,
    firstFocus: Boolean
});

const emit = defineEmits(['update:input', 'addErrorMessage', 'removeErrorMessage']);

const DateFormat = useDateFormatStore();
const Language = useLanguageStore();

/**
 * Khi mounted, nếu field có prop firstFocus, focus và select input text
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (27/09/2023)
 */
const inputRef = ref(null);
onMounted(() => {
    if (props.firstFocus) {
        inputRef.value.focus();
        inputRef.value.select();
    }
});

// Biến lưu trữ giá trị input.
const inputValue = ref(props.value === '' ? DateFormat.current : props.value);

// Biến lưu trữ ngày đã chọn
const selectedDate = ref(null);

/**
 * Chuyển đổi từ input sang selected date
 * Created by: ttanh (06/10/2023)
 */
const convertInputToSelectedDate = () => {
    const dateArray = inputValue.value.split('/').map(Number);
    switch (DateFormat.current) {
        case DateFormatList.DMY:
            selectedDate.value = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
            break;

        case DateFormatList.MDY:
            selectedDate.value = new Date(dateArray[2], dateArray[0] - 1, dateArray[1]);
            break;

        case DateFormatList.YMD:
            selectedDate.value = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
            break;
    }
};

/**
 * === CHỨC NĂNG VALIDATE INPUT ===
 */

// Check empty input
const isEmpty = computed(() =>
    props.required ? !inputValue.value || !inputValue.value.trim() : false
);

// Check invalid input
const isInvalid = computed(() => {
    if (inputValue.value === DateFormat.current) return false;
    return (
        String(parse(inputValue.value, DateFormat.current.replace(/mm/g, 'MM'), new Date())) ===
        'Invalid Date'
    );
});

// Check date is greater than now
const isGreaterNow = computed(() => {
    if (inputValue.value === DateFormat.current) return false;

    convertInputToSelectedDate();

    return selectedDate.value.getTime() > new Date().getTime();
});

// Thông báo lỗi tương ứng với isEmpty / isInvalid / isGreaterNow
const errorMessage = computed(() => {
    if (isEmpty.value) {
        return props.errMsgs.isEmpty;
    } else if (isInvalid.value) {
        return props.errMsgs.isInvalid;
    } else if (isGreaterNow.value) {
        return props.errMsgs.isGreaterNow;
    } else {
        return '';
    }
});

const showErrorInput = ref(props.showError);
const showErrorMessage = ref(props.showError);

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
 * Khi thay đổi giá trị input,
 * hiển thị những input bị lỗi (viền đỏ) nếu input trống hoặc không hợp lệ.
 * Created by: ttanh (03/10/2023)
 */
const handleChange = () => {
    emit('update:input', inputValue.value);

    convertInputToSelectedDate();

    if (isEmpty.value || isInvalid.value || isGreaterNow.value) {
        showErrorInput.value = true;
        showErrorMessage.value = true;
    }

    updateErrorMessage();
};

/**
 * Khi mounted, reset thông báo lỗi
 * Created by: ttanh (03/10/2023)
 */
onMounted(() => {
    updateErrorMessage();
});

/**
 * Khi isEmpty hoặc isInvalid thay đổi, cập nhật lại giá trị showErrorMessage tương ứng.
 */
watch([isEmpty, isInvalid, isGreaterNow], () => {
    showErrorMessage.value = isEmpty.value || isInvalid.value || isGreaterNow.value;
});

/**
 * === XỬ LÝ ĐÓNG MỞ DATE PICKER ===
 */
const showDatePicker = ref(false);

const openDatePicker = () => {
    showDatePicker.value = true;
    console.table({
        inputValue: inputValue.value,
        selectedDate: selectedDate.value,
        currentDate: currentDate.value
    });
};

const closeDatePicker = () => (showDatePicker.value = false);

const toggleDatePicker = () => (showDatePicker.value = !showDatePicker.value);

// Reference to input, icon calendar and date picker element
const iconCalendarRef = ref(null);
const datePickerRef = ref(null);

// Event listener for clicks outside the date picker
const handleClickOutside = (event) => {
    if (
        datePickerRef.value &&
        !datePickerRef.value.contains(event.target) &&
        event.target !== inputRef.value && // Exclude the input field
        event.target !== iconCalendarRef.value && // Exclude the icon calendar
        event.target !== iconCalendarRef.value.firstChild // Exclude the icon calendar img
    )
        closeDatePicker();
};

// Add the click event listener when the component is mounted
onMounted(() => document.addEventListener('click', handleClickOutside));

// Remove the click event listener when the component is unmounted
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));

/**
 * === XỬ LÝ LOGIC DATE PICKER ===
 */
// Gán value từ props vào biến currentDate
const currentDate = ref(
    props.value
        ? parse(props.value, DateFormat.current.replace(/mm/g, 'MM'), new Date())
        : new Date()
);

// Định dạng tiêu đề tháng (ví dụ: Tháng 8, 2023)
const formattedMonth = computed(() =>
    format(currentDate.value, 'MMMM, yyyy', {
        locale: Language.current === LanguageList.VI ? vi : enGB
    })
);

// Thay đổi đến tháng trước hoặc tháng tiếp theo khi click vào icon chuyển tháng
const changeMonth = (amount) => {
    currentDate.value =
        amount > 0 ? addMonths(currentDate.value, 1) : subMonths(currentDate.value, 1);
};

// Hiển thị các ngày trong tháng hiện tại
const daysInMonth = computed(() =>
    eachDayOfInterval({
        start: startOfMonth(currentDate.value),
        end: endOfMonth(currentDate.value)
    }).map((date) => date.getDate())
);

/**
 * Khi người dùng chọn ngày:
 * 1. Gán currentDate vào selectedDate.
 * 2. Gán selectedDate vào inputDate để hiển thị trong DateField.
 * 3. Đóng date picker.
 * Nếu không có day, chọn mặc định Today
 * Created by: ttanh (29/09/2023)
 * Updated by: ttanh (08/10/2023)
 */
const handleSelectDay = (event, day) => {
    event.stopPropagation();
    console.log(day);
    if (day)
        selectedDate.value = new Date(
            currentDate.value.getFullYear(),
            currentDate.value.getMonth(),
            day
        );
    else selectedDate.value = new Date();

    inputValue.value = format(selectedDate.value, DateFormat.current.replace(/mm/g, 'MM'), {
        locale: vi
    });

    currentDate.value = selectedDate.value;

    emit('update:input', inputValue.value);

    if (isEmpty.value || isInvalid.value || isGreaterNow.value) {
        showErrorInput.value = true;
        showErrorMessage.value = true;
    }

    updateErrorMessage();

    closeDatePicker();
    inputRef.value.focus();

    console.table({
        inputValue: inputValue.value,
        selectedDate: selectedDate.value,
        currentDate: currentDate.value
    });
};

watch(selectedDate, () => (currentDate.value = selectedDate.value));

//regex ký tự khác số
const nonDigitsRegex = /[^0-9]/g;

// Biến newString lưu trữ chuỗi chữ số
const newString = ref('');

/**
 * Khi người dùng nhập ngày tháng năm:
 * 1. Chuyển giá trị hiện tại input về chuỗi chữ số và gán vào newString.
 * 2. Nếu độ dài vượt quá 8 chữ số, xóa ký tự đầu tiên của chuỗi.
 * 3. Nếu ấn Backspace, xóa ký tự cuối cùng của chuỗi.
 * 4. Định dạng chuỗi chữ số và gán vào inputValue
 */
const handleKeyup = (event) => {
    newString.value = event.target.value.replace(nonDigitsRegex, '');

    const lengthString = newString.value.length;
    if (lengthString > 8) newString.value = newString.value.slice(1);

    if (event.key === 'Backspace') newString.value = newString.value.slice(0, lengthString - 1);

    inputValue.value = handleDateString(newString.value);
};

// Khi độ dài input là 8 chữ số, ngăn cản event mặc định khi backscape và xử lý bằng logic
const handlePreventDelete = (event) => {
    if (event.target.value.replace(nonDigitsRegex, '').length === 8) event.preventDefault();
};

/**
 * Định dạng chuỗi chữ số thành format tương ứng
 * và thay thế tất cả vị trí chưa nhập giá trị bằng chữ cái tương ứng.
 */
const handleDateString = (date) => {
    // loại bỏ dấu / giữa các ký tự
    const placeholder = DateFormat.current.replace(/\//g, '');

    const string = date.replace(nonDigitsRegex, '');
    const result = Array.from(placeholder)
        .map((char, index) => string[index] ?? char)
        .join('');

    switch (DateFormat.current) {
        case DateFormatList.DMY:
        case DateFormatList.MDY:
            return `${result.slice(0, 2)}/${result.slice(2, 4)}/${result.slice(4)}`;
        case DateFormatList.YMD:
            return `${result.slice(0, 4)}/${result.slice(4, 6)}/${result.slice(6)}`;
    }
};

/**
 * === COMPONENT STYLE ===
 */

/**
 * Based on the size and width props passed in,
 * assign classes to style each corresponding size and width of input.
 */
const inputClass = computed(() => {
    return [
        `input-${props.size}`,
        `input-width-${props.width}`,
        {
            'input-error':
                showErrorInput.value && (isEmpty.value || isInvalid.value || isGreaterNow.value)
        }
    ];
});
</script>

<template>
    <div class="date-field" @keydown.enter="toggleDatePicker">
        <div class="label-group" v-if="props.label">
            <label :for="id" :title="title">
                {{ props.label }}
            </label>
            <span class="required-mark" v-if="required">&nbsp;*</span>
        </div>
        <div class="input-group" @click="openDatePicker">
            <input
                type="text"
                :id="id"
                :disabled="disabled"
                :class="inputClass"
                v-model="inputValue"
                ref="inputRef"
                @keyup="handleKeyup"
                @keydown.delete="handlePreventDelete"
                @change="handleChange"
            />
            <span class="icon-calendar" ref="iconCalendarRef">
                <VIcon class="calendar" />
            </span>
            <div v-if="showDatePicker" class="date-picker" ref="datePickerRef">
                <div class="calendar">
                    <div class="header">
                        <div class="month" @click="showMonthYearPicker">
                            <span class="month-text">{{ formattedMonth }}</span>
                            <span class="icon-arrow-down"><VIcon class="arrow-down" /></span>
                        </div>
                        <div class="change-month-buttons">
                            <i>
                                <IconArrowLeft
                                    class="icon-arrow icon-left"
                                    @click="changeMonth(-1)"
                                />
                            </i>
                            <i>
                                <IconArrowRight
                                    class="icon-arrow icon-right"
                                    @click="changeMonth(1)"
                                />
                            </i>
                        </div>
                    </div>
                    <div class="days">
                        <div
                            v-for="day in daysInMonth"
                            :key="day"
                            :class="['day', { 'current-day': currentDate.getDate() === day }]"
                            @click="handleSelectDay($event, day)"
                        >
                            {{ day }}
                        </div>
                    </div>
                </div>
                <VButton
                    type="secondary"
                    size="extra-large"
                    width-full
                    class="pick-today-button"
                    @click="handleSelectDay($event)"
                    @keydown.enter="handleSelectDay($event)"
                    @keydown.tab="closeDatePicker"
                >
                    {{ FieldResources[Language.current].TodayButtonText }}
                </VButton>
            </div>
        </div>
        <span class="error-message" v-if="showErrorMessage">
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

$--change-month-button-hover-bg-color: rgb(var(--c-gray-200));

.date-field {
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

        border-radius: 4px;
        border: 1px solid $--input-border-color;
        outline: none;
        padding-right: 32px;

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

    .icon-calendar {
        @include size(20px);
        position: absolute;
        top: 50%;
        right: 8px;
        transform: translateY(-50%);
        cursor: pointer;
        .calendar {
            @include size(16px);
            background-position: -128px -312px;
        }
    }
}

/* Style error message */
.error-message {
    position: absolute;
    left: 16px;
    bottom: -18px;
    display: none;
    z-index: 5;

    @include font(12);
    padding: 4px;
    border-radius: 2px;
    color: $--error-message-color;
    background-color: $--error-message-bg-color;
    text-wrap: nowrap;

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

.date-picker {
    position: absolute;
    z-index: 2;
    top: 38px;

    @include font(14);
    background-color: white;
    border-radius: 4px;
    border: 1px solid $--input-border-color;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.051));
    .calendar {
        padding: 20px 20px 12px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: 1px solid $--input-border-color;
    }
    .pick-today-button {
        width: 100%;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    .month {
        display: flex;
        align-items: center;
        gap: 4px;
        cursor: pointer;
        .month-text {
            font-weight: 700;
            text-transform: capitalize;
        }
        .icon-arrow-down {
            @include size(20px);
            .arrow-down {
                width: 9px;
                height: 5px;
                transform: scale(1.2) translate(-50%, -50%);
                background-position: -947px -366px;
            }
        }
    }

    .change-month-buttons {
        display: flex;
        gap: 12px;
        i {
            padding: 4px;
            border-radius: 999px;
            cursor: pointer;
            &:hover {
                background-color: $--change-month-button-hover-bg-color;
            }
            .icon-arrow {
                @include size(16px);
                filter: brightness(0);
            }
            .icon-left {
                transform: rotate(180deg) scale(calc(14 / 16));
            }
            .icon-right {
                transform: scale(calc(14 / 16));
            }
        }
    }
}

.days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    .day {
        @include size(32px);
        display: grid;
        place-items: center;

        border-radius: 999px;
        cursor: pointer;
        &:hover {
            color: rgb(var(--c-white));
            background-color: rgb(var(--c-primary));
        }
    }
    .current-day {
        color: rgb(var(--c-white));
        background-color: rgb(var(--c-primary));
    }
}
</style>
