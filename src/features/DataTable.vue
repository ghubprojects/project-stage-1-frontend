<script setup>
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { IconExpandMore, IconSearch } from '@/assets/icons';
import { VButton, VCheckbox, VDialog, VIcon, VLoading, VTextField } from '@/components';
import EmployeeForm from './EmployeeForm.vue';
import TablePagination from './TablePagination.vue';

import {
    useDepartmentStore,
    useDialogStore,
    useEmployeeStore,
    useLanguageStore,
    useTableStore,
    useToastMessageStore
} from '@/stores';

import {
    ButtonResources,
    DialogResources,
    FieldResources,
    TableResources,
    ToastMessageResources
} from '@/resources';
import * as dataHandler from '@/utils/datahandler';
import { DialogName, EmployeeFields, FormMode, Gender, ToastMessageType } from '@/utils/enum';
import { columnInfos, table } from '@/utils/table';

// global states
const Employee = useEmployeeStore();
const Department = useDepartmentStore();

const Table = useTableStore();
const Dialog = useDialogStore();
const ToastMessage = useToastMessageStore();
const Language = useLanguageStore();

/**
 * === XỬ LÝ LẤY DANH SÁCH NHÂN VIÊN TỪ API ===
 */

/**
 * Load dữ liệu từ API:
 * 1. Trong khi loading, hiển thị spinner và lấy dữ liệu theo số bản ghi mỗi trang và hàng bắt đầu truy xuất.
 * 2. Nếu gặp exception, hiển thị Dialog thông báo lỗi.
 * Created by: ttanh (01/09/2023)
 * Modified by: ttanh (05/09/2023)
 */
const handleLoadData = async () => {
    try {
        Employee.isLoading = true;
        if (Employee.isSearching) {
            await Employee.getFilteringAndPaginationAsync(
                debouncedSearchText.value,
                Table.recordPerPage,
                Table.offsetValue
            );
        } else await Employee.getPaginationAsync(Table.recordPerPage, Table.offsetValue);

        Employee.isLoading = false;
        await Department.getAllAsync();
    } catch (err) {
        console.log(err);
        Employee.isLoading = false;
    }
};

/**
 * Khi recordPerPage hoặc currentPage thay đổi, load lại dữ liệu
 * Created by: ttanh (07/09/2023)
 */
const { recordPerPage, currentPage } = storeToRefs(Table);
watch([recordPerPage, currentPage], () => {
    handleLoadData();
});

// load dữ liệu khi được mount
onMounted(async () => {
    await handleLoadData();
});

/**
 * Định dạng lại dữ liệu nhân viên lấy từ API.
 * @param {object} data dữ liệu nhân viên
 * @param {string} property trường dữ liệu cần định dạng lại
 * Created by: ttanh (20/08/2023)
 * Modified by: ttanh (03/09/2023)
 */
const formatDataCell = (data, property) => {
    switch (property) {
        /**
         * Hiển thị giới tính trong bảng dữ liệu
         * (0 là Nam, 1 là Nữ, 2 là Khác, các giá trị khác là Không hợp lệ)
         * Created by: ttanh (19/08/2023)
         * Modified by: ttanh (20/08/2023)
         */
        case EmployeeFields.Gender:
            if (data[EmployeeFields.Gender] === null) return '';
            switch (data[EmployeeFields.Gender]) {
                case Gender.Male:
                    return FieldResources[Language.current].GenderMale;
                case Gender.Female:
                    return FieldResources[Language.current].GenderFemale;
                case Gender.Other:
                    return FieldResources[Language.current].GenderOther;
                default:
                    return FieldResources[Language.current].GenderInvalid;
            }
        case EmployeeFields.DateOfBirth:
            return dataHandler.DtoToEmployeeConverter.convertDate(data[EmployeeFields.DateOfBirth]);
        default:
            return data[property];
    }
};

/**
 * === TÌM KIẾM NHÂN VIÊN THEO MÃ NHÂN VIÊN, TÊN NHÂN VIÊN ===
 */

// lưu trữ từ khóa tìm kiếm
const searchText = ref('');
const handleSearchInput = (event) => {
    searchText.value = event.target.value;
};

/**
 * Sử dụng debouncing để tối ưu gọi API khi thay đổi từ khóa tìm kiếm
 */
let debounceTimeout;
const debouncedSearchText = ref('');

/**
 * Khi searchText thay đổi, cứ mỗi sau 500ms mới cập nhật và request API 1 lần
 */
watch(searchText, (newValue) => {
    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
        debouncedSearchText.value = newValue;
    }, 500);
});

/**
 * Thực hiện tìm kiếm nhân viên theo mã nhân viên hoặc tên nhân viên
 * Created by: ttanh (18/08/2023)
 * Modified by: ttanh (04/09/2023)
 */
watch(debouncedSearchText, async () => {
    Employee.isSearching = debouncedSearchText.value !== '';
    Table.reset();
    console.log('searching: ', Employee.isSearching, 'search for: ', debouncedSearchText.value);
    await handleLoadData();
});

/**
 * === XỬ LÝ EXPAND DROPDOWN OPTIONS ===
 */

const isOpenDropdownOptions = ref(false);

/**
 * Ngăn chặn nổi bọt sự kiện ra window khi click vào ExpandIcon và mở dropdown options
 * @param {event} event sự kiện click
 * @param {object} employee nhân viên có dropdown được mở
 * Created by: ttanh (12/08/2023)
 * Modified by: ttanh (15/08/2023)
 */
const handleClickExpandIcon = (event, employee) => {
    event.stopPropagation();
    isOpenDropdownOptions.value = true;
    Employee.current = employee;
};

// đóng dropdown options
const closeDropdownOptions = () => (isOpenDropdownOptions.value = false);

// khi click ra ngoài document, đóng dropdown options.
onMounted(() => document.addEventListener('click', closeDropdownOptions));

// khi unmount, loại bỏ sự kiện click khỏi đối tượng document.
onBeforeUnmount(() => document.removeEventListener('click', closeDropdownOptions));

/**
 * === XÓA 1 NHÂN VIÊN ===
 */

const isDeleting = ref(false);

// hiển thị Dialog Xóa nhân viên
const handleShowDeleteEmployeeDialog = () => {
    isDeleting.value = true;
    Dialog.show(DialogName.DeleteEmployee);
};

/**
 * Thực hiện xóa nhân viên theo ID
 * 1. nếu thành công, reset employee current và employee checklist và hiện message thông báo thành công
 * 2. nếu thất bại, hiện message thông báo lỗi
 * @param {object} employee nhân viên bị xóa
 * Created by: ttanh (15/08/2023)
 * Modified by: ttanh (05/09/2023)
 */
const handleDeleteEmployee = async (employee) => {
    const result = await Employee.removeByIdAsync(employee.EmployeeID);

    // check affected rows is 1
    if (result.Succeeded && result.Data === 1) {
        try {
            handleLoadData();

            Employee.current = {};
            Employee.checklist = [];
            // Employee.removeCheckById(employee[EmployeeFields.EmployeeID]);

            ToastMessage.show(
                ToastMessageType.Success,
                ToastMessageResources[Language.current].DeleteEmployee.success(
                    employee.EmployeeCode
                )
            );
        } catch (err) {
            ToastMessage.show(
                ToastMessageType.Error,
                ToastMessageResources[Language.current].DeleteEmployee.error(employee.EmployeeCode)
            );
            console.log(err);
        }
    }

    isDeleting.value = false;
};

// Hủy xóa nhân viên và đóng Dialog
const cancelDeleteEmployee = () => {
    isDeleting.value = false;
    Employee.current = {};
    Dialog.hide();
};

/**
 * === XÓA NHIỀU NHÂN VIÊN ===
 */

// Nếu có từ 2 nhân viên trở lên được chọn, hiện Dialog Xóa nhiều nhân viên
const handleShowBulkDeleteDialog = () => {
    isDeleting.value = true;
    Dialog.show(DialogName.DeleteMultipleEmployees);
};

/**
 * Xử lý xóa nhiều nhân viên
 * 1. lấy tất cả ID của nhân viên trong checklist
 * 2. xóa tất cả nhân viên có ID trong checklist
 * 3. nếu thành công, reset employee checklist và hiện message thông báo thành công
 * 4. nếu thất bại, hiện message thông báo lỗi
 * Created by: ttanh (12/08/2023)
 * Modified by: ttanh (15/08/2023)
 */
const handleBulkDeleteAction = async () => {
    try {
        console.log('page checked ids:', Employee.getPageCheckIds(Table.currentPage));

        const result = await Employee.removeMultipleAsync(
            Employee.getPageCheckIds(Table.currentPage)
        );

        // check affected rows is page checked ids length
        if (
            result.Succeeded &&
            result.Data === Employee.getPageCheckIds(Table.currentPage).length
        ) {
            try {
                handleLoadData();
                Employee.checklist = [];
                // Employee.uncheckPage(Table.currentPage);

                ToastMessage.show(
                    ToastMessageType.Success,
                    ToastMessageResources[Language.current].DeleteMultipleEmployees.success
                );
            } catch (err) {
                ToastMessage.show(
                    ToastMessageType.Error,
                    ToastMessageResources[Language.current].DeleteMultipleEmployees.error
                );
                console.log(err);
            }
        }
    } catch (err) {
        ToastMessage.show(
            ToastMessageType.Error,
            ToastMessageResources[Language.current].DeleteMultipleEmployees.error
        );
        console.log(err);
    }

    isDeleting.value = false;
};

// Hủy xóa nhiều nhân viên và đóng Dialog
const cancelBulkDeleteAction = () => {
    isDeleting.value = false;
    Dialog.hide();
};

/**
 * === SỬA DỮ LIỆU NHÂN VIÊN ===
 */

const isUpdating = ref(false);

/**
 * Hiển thị thông tin chi tiết nhân viên
 * @param {object} employee nhân viên đang được chọn
 * Created by: ttanh (18/08/2023)
 */
const handleShowEmployeeDetails = async (employee) => {
    isUpdating.value = true;
    const result = await Employee.getByIdAsync(employee.EmployeeID);
    if (result.Succeeded) {
        console.log('response:', result.Data);
        Employee.form.show(result.Data);
    }
};

/**
 * === NHÂN BẢN DỮ LIỆU NHÂN VIÊN ===
 */
const duplicateEmployee = (employee) => {
    console.log('duplicate', employee);
    Employee.form.duplicate(employee);
};

/**
 * === FIXED COLUMNS
 */
const tableColumns = ref([...columnInfos]);
const paddingX = 10;

/**
 * Lấy mảng left position cho các cột cố định
 * @param {int} paddingX padding chiều ngang của 1 ô
 * @returns Mảng left position
 * Created by: ttanh (04/10/2023)
 */
const leftPositionsForFixedCols = computed(() => {
    const widthArray = tableColumns.value.map((column) => column.width);
    const leftPositionArray = widthArray.reduce(
        (acc, currentValue, index) => {
            const currentWidth = currentValue + 2 * paddingX + 0.8;
            if (index === 0) acc.push(currentWidth);
            else acc.push(acc[index] + currentWidth);
            return acc;
        },
        [0]
    );
    return leftPositionArray;
});

/**
 * === RESIZE TABLE CELL ===
 */
const resizingColumnIndex = ref(null);
const startX = ref(null);

/**
 * Khi mousedown tại viền phải của table heading
 * Created by: ttanh (03/10/2023)
 */
const startResize = (event, columnIndex) => {
    resizingColumnIndex.value = columnIndex;
    startX.value = event.clientX;
};

/**
 * Khi mousedown và di chuyển chuột để resize cột
 * @param {event} event
 * Created by: ttanh (03/10/2023)
 */
const onMouseMove = (event) => {
    if (resizingColumnIndex.value) {
        const deltaX = event.clientX - startX.value;
        const newWidth = tableColumns.value[resizingColumnIndex.value].width + deltaX;

        if (newWidth > tableColumns.value[resizingColumnIndex.value].minWidth) {
            // Minimum column width
            tableColumns.value[resizingColumnIndex.value].width = newWidth;
            startX.value = event.clientX;
        }
    }
};

/**
 * Khi mouseup, kết thúc resize
 * Created by: ttanh (03/10/2023)
 */
const stopResize = () => (resizingColumnIndex.value = null);

// Khi mounted, thêm event listener
onMounted(() => document.addEventListener('mouseup', stopResize));

// Trước khi unmount, loại bỏ event listener
onBeforeUnmount(() => document.removeEventListener('mouseup', stopResize));

/**
 * === XỬ LÝ PHÍM TẮT ===
 */

const isFocusSearchInput = ref(false);

// Khi search text thay đổi, bỏ focus search input
watch(debouncedSearchText, () => {
    isFocusSearchInput.value = false;
});

/**
 * Khi ấn phím CTRL F3, thực hiện focus vào input tìm kiếm
 * @param {event} event
 * Created by: ttanh (08/10/2023)
 */
const handleKeyDownTable = async (event) => {
    if (event.ctrlKey && event.code === 'F3') {
        event.preventDefault();
        isFocusSearchInput.value = true;
    } else if (event.code === 'Delete') {
        event.preventDefault();
        const checkedEmployees = Employee.getPageCheckIds(Table.currentPage);
        if (checkedEmployees.length === 1) {
            try {
                const result = await Employee.getByIdAsync(checkedEmployees[0]);
                if (result.Succeeded) {
                    Employee.current = result.Data;
                    handleShowDeleteEmployeeDialog();
                }
            } catch (err) {
                console.log(err);
            }
        } else if (checkedEmployees.length > 1) {
            handleShowBulkDeleteDialog();
        }
    } else if (event.code === 'Enter') {
        event.preventDefault();
        const checkedEmployees = Employee.getPageCheckIds(Table.currentPage);
        if (checkedEmployees.length === 1) {
            try {
                const result = await Employee.getByIdAsync(checkedEmployees[0]);
                if (result.Succeeded) {
                    Employee.current = result.Data;
                    handleShowEmployeeDetails(Employee.current);
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
};

// Khi mounted, thêm event listener
onMounted(() => {
    document.addEventListener('keydown', handleKeyDownTable);
});

// Khi unMounted, thêm event listener
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDownTable);
});
</script>

<template>
    <div
        id="data-table"
        :class="{ 'not-allowed-cursor': Employee.isLoading }"
        @keydown.stop="handleKeyDownTable"
    >
        <!-- Header của bảng dữ liệu -->
        <div class="data-table-header">
            <!-- Các hành động thực hiện hàng loạt -->
            <div class="bulk-actions" v-if="Employee.getPageCheck(Table.currentPage).length > 1">
                <span class="checked-count">
                    {{ TableResources[Language.current].Selected }}
                    <b> {{ Employee.getPageCheck(Table.currentPage).length }} </b>
                </span>
                <span class="uncheck-all-button" @click="Employee.uncheckPage(Table.currentPage)">
                    {{ TableResources[Language.current].Unselect }}
                </span>
                <span
                    class="check-all-pages-button"
                    v-if="Employee.getPageCheck(Table.currentPage).length === Employee.list.length"
                >
                    {{ TableResources[Language.current].SelectAllPages }}
                </span>
                <VButton
                    type="outline"
                    size="medium"
                    colorScheme="red"
                    class="bulk-delete-button"
                    @click="handleShowBulkDeleteDialog"
                >
                    <template #icon>
                        <div class="icon-delete">
                            <VIcon class="delete-img" />
                        </div>
                    </template>
                    {{ ButtonResources[Language.current].BulkDelete }}
                </VButton>

                <!-- Dialog xóa nhiều nhân viên -->
                <VDialog
                    v-if="isDeleting && Dialog.current === DialogName.DeleteMultipleEmployees"
                    colorScheme="red"
                    :data="DialogResources[Language.current].DeleteMultipleEmployees"
                    :primary-text="ButtonResources[Language.current].DeleteMultipleEmployees"
                    :secondary-text="ButtonResources[Language.current].Cancel"
                    @handle-primary="handleBulkDeleteAction"
                    @handle-secondary="cancelBulkDeleteAction"
                    @keydown.stop
                />
            </div>

            <!-- Các công cụ thao tác với bảng (tìm kiếm, xuất khẩu excel, reload,...) -->
            <div class="tools">
                <!-- Thanh tìm kiếm -->
                <VTextField
                    size="medium"
                    width="extra-extra-large"
                    id="search-employee"
                    class="search-employee-textfield"
                    :tooltip="false"
                    :maxLength="100"
                    :placeholder="TableResources[Language.current].SearchEmployeePlaceholder"
                    :input="searchText"
                    @input="handleSearchInput($event)"
                    :firstFocus="isFocusSearchInput"
                >
                    <template #icon>
                        <IconSearch class="search-icon" />
                    </template>
                </VTextField>

                <!-- Button lấy lại dữ liệu -->
                <VButton
                    type="icon"
                    class="reload-button"
                    :title="ButtonResources[Language.current].ReloadTooltip"
                    @click="handleLoadData"
                >
                    <div class="icon-reload">
                        <VIcon class="reload-img" />
                    </div>
                </VButton>

                <!-- Button xuất khẩu dữ liệu sang excel -->
                <VButton
                    type="icon"
                    class="export-button"
                    :title="ButtonResources[Language.current].ExportTooltip"
                    :href="`https://localhost:7244/api/v1/Employees/export?keyword=${searchText}`"
                >
                    <div class="icon-export">
                        <VIcon class="export-img" />
                    </div>
                </VButton>
            </div>
        </div>

        <!-- Bảng dữ liệu -->
        <VLoading v-if="Employee.isLoading" />
        <div v-else class="table-group">
            <table>
                <thead>
                    <tr @mousemove="onMouseMove">
                        <th
                            v-for="(column, index) in columnInfos"
                            :key="column.name"
                            :title="column.title"
                            :class="[
                                `th-${column.name}`,
                                { fixed: table.fixedColumns.includes(column.name) }
                            ]"
                            :style="
                                table.fixedColumns.includes(column.name) &&
                                `left: ${leftPositionsForFixedCols[index]}px`
                            "
                        >
                            <div
                                v-if="column.property"
                                class="cell-data"
                                :style="`width: ${tableColumns[index].width}px`"
                            >
                                {{ TableResources[Language.current][column.property] }}
                            </div>
                            <VCheckbox
                                v-else
                                id="multiple-employees-checkbox"
                                :checked="
                                    Employee.list.length > 0 &&
                                    Employee.getPageCheck(Table.currentPage).length ===
                                        Employee.list.length
                                "
                                @click="Employee.toggleCheckPage(Table.currentPage)"
                            />
                            <div class="resize" @mousedown="startResize($event, index)"></div>
                        </th>
                        <th class="th-options">
                            <div style="width: 100px">
                                {{ TableResources[Language.current].Option }}
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="employee in Employee.list"
                        :key="employee.EmployeeCode"
                        :class="[
                            {
                                'selected-row': Employee.findCheck(
                                    employee[EmployeeFields.EmployeeID]
                                )
                            },
                            {
                                'higher-elevation':
                                    isOpenDropdownOptions && Employee.current === employee
                            }
                        ]"
                        @dblclick="handleShowEmployeeDetails(employee)"
                    >
                        <td
                            v-for="(column, index) in columnInfos"
                            :key="column.name"
                            :class="[
                                `td-${column.name}`,
                                { fixed: table.fixedColumns.includes(column.name) }
                            ]"
                            :style="
                                table.fixedColumns.includes(column.name) &&
                                `left: ${leftPositionsForFixedCols[index]}px`
                            "
                        >
                            <div v-if="column.property" class="cell-data">
                                {{ formatDataCell(employee, column.property) }}
                            </div>
                            <div v-else class="checkbox">
                                <div class="checkbox-input">
                                    <input
                                        type="checkbox"
                                        :value="{
                                            id: employee.EmployeeID,
                                            page: Table.currentPage
                                        }"
                                        v-model="Employee.checklist"
                                    />
                                    <span class="checkmark"></span>
                                </div>
                            </div>
                        </td>

                        <td class="td-options">
                            <span class="update-button" @click="Employee.form.show(employee)">
                                {{ TableResources[Language.current].Edit }}
                            </span>
                            <div class="dropdown">
                                <IconExpandMore
                                    class="expand-more-icon"
                                    @click="handleClickExpandIcon($event, employee)"
                                />
                                <div
                                    v-if="isOpenDropdownOptions && Employee.current === employee"
                                    class="dropdown-menu"
                                >
                                    <div
                                        class="dropdown-menu-item"
                                        @click="duplicateEmployee(employee)"
                                    >
                                        {{ TableResources[Language.current].Duplicate }}
                                    </div>
                                    <div
                                        class="dropdown-menu-item"
                                        @click="handleShowDeleteEmployeeDialog"
                                    >
                                        {{ TableResources[Language.current].Delete }}
                                    </div>
                                    <div class="dropdown-menu-item">
                                        {{ TableResources[Language.current].CeaseUsing }}
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Dialog xóa 1 nhân viên -->
                        <Teleport to="#main">
                            <VDialog
                                v-if="
                                    isDeleting &&
                                    Employee.current.EmployeeID === employee.EmployeeID
                                "
                                colorScheme="red"
                                :title="DialogResources[Language.current].DeleteEmployee.title"
                                :text="
                                    DialogResources[Language.current].DeleteEmployee.text(
                                        Employee.current.EmployeeCode
                                    )
                                "
                                :primary-text="ButtonResources[Language.current].DeleteEmployee"
                                :secondary-text="ButtonResources[Language.current].Cancel"
                                @handle-primary="() => handleDeleteEmployee(Employee.current)"
                                @handle-secondary="cancelDeleteEmployee"
                                @keydown.stop
                            />
                        </Teleport>
                    </tr>
                </tbody>

                <EmployeeForm v-if="Employee.formMode != FormMode.Hide" />
            </table>
        </div>

        <!-- Công cụ phân trang của bảng -->
        <TablePagination />
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

#data-table {
    @include font(13);
    max-height: var(--data-table-height);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.data-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    min-height: var(--data-table-header-height);
    margin: 16px 0;
    @include font(14);
    &:not(:has(.bulk-delete-button)) {
        justify-content: flex-end;
    }
}

.data-table-header .bulk-actions {
    display: flex;
    align-items: center;
    gap: 16px;

    .uncheck-all-button {
        color: rgb(var(--c-red-500));
        cursor: pointer;
    }

    .check-all-pages-button {
        color: rgb(var(--c-blue-600));
        cursor: pointer;
    }

    .bulk-delete-button {
        margin: 0 4px;
        .icon-delete {
            @include size(18px);
            transform: scale(calc(18 / 15));
            margin-right: 4px;
            margin-left: -4px;
            .delete-img {
                @include size(15px);
                background-position: -464px -313px;
                filter: brightness(0) invert(1);
            }
        }
    }
}

.data-table-header .tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    input.search-employee-textfield {
        @include font(13);
        height: 60px;
        font-style: italic !important;

        &::placeholder {
            @include font(13);
            font-style: italic !important;
        }
        & + i > .search-icon {
            @include size(20px);
            cursor: pointer;
        }
    }

    .export-button {
        .icon-export {
            @include size(20px);
            transform: scale(calc(20 / 24));
            .export-img {
                width: 23px;
                height: 20px;
                background-position: -705px -202px;
                filter: sepia(1) hue-rotate(100deg) brightness(0.5) saturate(10) grayscale(0.4);
            }
        }
        &:active {
            .export-img {
                filter: sepia(1) hue-rotate(101deg) brightness(0.6) saturate(10) grayscale(0.5);
            }
        }
    }

    .reload-button {
        .icon-reload {
            @include size(20px);
            transform: scale(calc(20 / 24));
            .reload-img {
                width: 22px;
                height: 23px;
                background-position: -424px -201px;
                filter: sepia(1) hue-rotate(100deg) brightness(0.5) saturate(10) grayscale(0.4);
            }
        }
        &:active {
            .reload-img {
                filter: sepia(1) hue-rotate(101deg) brightness(0.6) saturate(10) grayscale(0.5);
            }
        }
    }
}

.table-group {
    max-height: var(--data-table-group-table-height);
    height: 100%;
    border: 1px solid rgb(var(--c-gray-300));
    border-bottom: 0;
    background-color: rgb(var(--c-white));
    overflow: auto;
}

table {
    @include font(13);
    width: 100%;
    border-spacing: 0px;
    thead {
        position: sticky;
        top: 0;
        z-index: 10;
        background-color: rgb(var(--c-gray-200));
    }
    tbody {
        z-index: 0;
    }
}

tr {
    &.selected-row > td {
        background-color: rgb(var(--c-light-green-100));
    }
    &.higher-elevation {
        z-index: 20;
    }
}

th {
    padding: 6px 10px;
    text-transform: uppercase;

    height: var(--table-row-height);
    background-color: rgb(var(--c-gray-200));

    border: 1px solid rgb(var(--c-gray-300));
    border-width: 0 1px 1px 0;

    .resize {
        width: 6px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        cursor: col-resize;
        resize: both;
    }
}

.th-bank-branch {
    border-width: 0 0 1px 0;
}
.th-options {
    position: sticky;
    right: 0;
    border-width: 0 0 1px 1px;
}

/* Table Data Row */
td {
    padding: 0 10px;

    height: var(--table-row-height);
    background-color: rgb(var(--c-white));

    border: 1px solid rgb(var(--c-gray-300));
    border-width: 0 1px 1px 0;
    &.td-date-of-birth {
        text-align: center;
    }
    &.td-bank-branch {
        border-width: 0 0 1px 0;
    }
    &.td-options {
        position: sticky;
        right: 0;
        z-index: 10;

        padding-left: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 4px;

        font-weight: 500;
        border-width: 0 0 1px 1px;
        .update-button {
            color: rgb(var(--c-blue-600));
            cursor: pointer;
        }
    }

    .cell-data {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}

.fixed {
    position: sticky;
    z-index: 50;
}

.dropdown {
    .expand-more-icon {
        @include size(16px);
        cursor: pointer;
    }
    .expand-more-icon-border {
        border: 1px solid rgb(var(--c-blue-600));
    }
    .dropdown-menu {
        position: absolute;
        right: -8px;
        width: max-content;

        background-color: rgb(var(--c-white));
        font-weight: 400;
        border: 1px solid rgb(var(--c-gray-300));
        .dropdown-menu-item {
            padding: 6px 10px;
            cursor: pointer;
            &:hover {
                color: rgb(var(--c-primary));
                background-color: rgb(var(--c-gray-200));
            }
        }
    }
}

// Checkbox style
/* Styles for checkbox */
.checkbox {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Styles for checkbox-input */
.checkbox-input {
    position: relative;
    display: flex;
}

/* Styles for default input */
.checkbox-input > input[type='checkbox'] {
    margin: 0;
    opacity: 0;

    @include size(19px);
    z-index: 3;
    cursor: pointer;
}

/* Style for checkmark */
.checkbox-input > .checkmark {
    @include centerAbsolute('both');
    @include size(18px);
    border: 1px solid rgb(var(--c-gray-400));
    border-radius: 4px;
}

/* When input is checked, change background-color of checkmark*/
.checkbox-input > input[type='checkbox']:checked + .checkmark {
    background-color: rgb(var(--c-primary));
    border: none;
}

/* When input is checked, display check icon */
.checkbox-input > input[type='checkbox']:checked + .checkmark::before {
    @include centerAbsolute('both');

    content: '';
    display: block;
    transform: translate(-50%, -50%) scale(80%);

    /* Get check icon in file sprites */
    background: url('@/assets/images/sprites.svg') no-repeat -1273px -363px;
    width: 14px;
    height: 11px;
    filter: brightness(200%);
}

/* Style for label */
.checkbox label {
    display: inline-block;
    position: relative;
    padding-left: 8px;
    cursor: pointer;
    -webkit-user-select: none;
    user-select: none;
}
</style>
