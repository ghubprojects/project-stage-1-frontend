<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { IconExpandMore, IconSearch } from '@/assets/icons';
import { VButton, VCheckbox, VDialog, VDropdownlist, VIcon, VTextField } from '@/components';
import EmployeeForm from './EmployeeForm.vue';

import { useDialogStore } from '@/stores/dialog';
import { useEmployeeStore } from '@/stores/employee';
import { useToastMessageStore } from '@/stores/toastMessage';

import * as dataHandler from '@/utils/dataHandler';
import { DialogName, ToastMessageType } from '@/utils/enums';
import { tableColumns } from '@/utils/tableColumns';
import { resources } from '@/utils/resources';

// biến lưu trữ global states
const Employee = useEmployeeStore();
const Dialog = useDialogStore();
const ToastMessage = useToastMessageStore();

const VNDialogResources = resources.VN.Dialog;
const VNToastMessageResources = resources.VN.ToastMessage;

// các cột được cố định khi scroll
const fixedColumns = ['employee-check', 'employee-code', 'full-name'];

// lấy dữ liệu danh sách nhân viên từ API
const employeeData = ref([]);
onMounted(() => {
    try {
        Employee.getAllEmployees();
        employeeData.value = Employee.employeeList;
    } catch (err) {
        console.log(err);
    }
});

// định dạng lại dữ liệu nhân viên lấy từ API.
const formatDataCell = (data, property) =>
    property === 'Gender' ? dataHandler.getGender(data[property]) : data[property];

// reload dữ liệu khi click vào IconRefresh.
const handleReloadData = async () => {
    Employee.getAllEmployees();
};

/**
 * === CHỨC NĂNG TÌM KIẾM NHÂN VIÊN THEO MÃ NHÂN VIÊN, TÊN NHÂN VIÊN ===
 */
const isSearching = ref(false);

// lưu keyword và kết quả tìm kiếm
const searchText = ref('');
const searchResults = ref([]);

// khi searchText rỗng, gán isSearching = false
watch([searchText], () => {
    if (!searchText.value) {
        isSearching.value = false;
        employeeData.value = Employee.employeeList;
    }
});

// xử lý tìm kiếm input
const handleSearchInput = (event) => {
    searchText.value = event.target.value;
    isSearching.value = false;
};

// tìm kiếm nhân viên
const handleSearchEmployee = () => {
    try {
        console.log('searchText:', searchText.value);
        isSearching.value = true;
        searchResults.value = Employee.searchEmployee(searchText.value);
    } catch (err) {
        console.log(err);
    }
};

// nếu đang tìm kiếm, employeeData là kết quả tìm kiếm, ngược lại là danh sách nhân viên đầy đủ
watch([isSearching], () => {
    employeeData.value = isSearching.value ? searchResults.value : Employee.employeeList;
});

/**
 * === XỬ LÝ EXPAND DROPDOWN OPTIONS ===
 */
const isOpenDropdownOptions = ref(false);
const handleClickExpandIcon = (event, employee) => {
    // Ngăn chặn nổi bọt sự kiện ra window khi click vào ExpandIcon
    event.stopPropagation();

    isOpenDropdownOptions.value = true;
    Employee.setCurrentEmployee(employee);
};

//Hàm đóng dropdown, được gọi khi blur
const closeDropdownOptions = () => {
    isOpenDropdownOptions.value = false;
};

// Click ra ngoài document, đóng dropdown options.
onMounted(() => document.addEventListener('click', closeDropdownOptions));

// Khi bị unmount, loại bỏ sự kiện click khỏi đối tượng document.
onUnmounted(() => document.removeEventListener('click', closeDropdownOptions));

/**
 * === CHỨC NĂNG XÓA 1 NHÂN VIÊN ===
 */
const isDeleting = ref(false);

// hiển thị Dialog Xóa nhân viên
const handleShowDeleteEmployeeDialog = () => {
    isDeleting.value = true;
    Dialog.show(DialogName.DeleteEmployee);
};

// xử lý xóa 1 nhân viên
const handleDeleteEmployee = (emp) => {
    try {
        // delete by code
        Employee.deleteEmployee(emp.EmployeeCode);

        employeeData.value = Employee.employeeList;
        // set currentEmp empty
        Employee.setCurrentEmployee({});
        // làm rỗng checklist
        employeeChecklist.value = [];
        // show success message
        ToastMessage.show(
            ToastMessageType.Success,
            VNToastMessageResources.DeleteEmployee.success(emp.EmployeeCode)
        );
    } catch (err) {
        ToastMessage.show(
            ToastMessageType.Error,
            VNToastMessageResources.DeleteEmployee.error(emp.EmployeeCode)
        );
        console.log(err);
    }
    isDeleting.value = false;
};

// hủy xóa nhân viên
const cancelDeleteEmployee = () => {
    isDeleting.value = false;
    // set currentEmp empty
    Employee.setCurrentEmployee({});
    Dialog.hide();
};

/**
 * === CHỨC NĂNG XÓA NHIỀU NHÂN VIÊN ===
 */
// lưu trữ danh sách nhân viên đã chọn
const employeeChecklist = ref([]);

// xử lý check 1 nhân viên
const checkEmployee = (event, employee) => {
    // khi checkbox được check, thêm nhân viên đó vào checklist.
    if (event.target.checked) employeeChecklist.value.push(employee);
    // nếu không, tìm index của nhân viên đó và loại bỏ khỏi checklist
    else {
        const removeIndex = employeeChecklist.value.indexOf(employee);
        if (removeIndex !== -1) employeeChecklist.value.splice(removeIndex, 1);
    }
};

// xử lý check tất cả nhân viên
const toggleCheckAllEmployee = (event) => {
    // khi checkbox được check, làm rỗng checklist và thêm tất cả nhân viên
    if (event.target.checked) {
        employeeChecklist.value = [];
        employeeChecklist.value.push(...employeeData.value);
    } // nếu không, làm rỗng checklist
    else employeeChecklist.value = [];
};

// trả về true nếu có từ 2 nhân viên trở lên được chọn
const isShowBulkDeleteAction = computed(() => employeeChecklist.value.length > 1);

const handleShowBulkDeleteDialog = () => {
    isDeleting.value = true;
    Dialog.show(DialogName.DeleteMultipleEmployees);
};

// xử lý xóa nhiều nhân viên
const handleBulkDeleteAction = () => {
    try {
        // lấy tất cả ID của nhân viên trong checklist
        const employeeIDChecklist = employeeChecklist.value.map((el) => el.EmployeeID);
        console.log('employeeIDChecklist:', employeeIDChecklist);
        // xóa tất cả nhân viên có ID trong checklist
        Employee.deleteMultipleEmployees(employeeIDChecklist);
        employeeData.value = Employee.employeeList;
        // làm rỗng checklist
        employeeChecklist.value = [];
        //
        isDeleting.value = false;
        Dialog.hide();
        // gửi message xóa thành công
        ToastMessage.show(
            ToastMessageType.Success,
            VNToastMessageResources.DeleteMultipleEmployees.success
        );
    } catch (err) {
        isDeleting.value = false;
        Dialog.hide();
        // nếu gặp lỗi, gửi message lỗi
        ToastMessage.show(
            ToastMessageType.Error,
            VNToastMessageResources.DeleteMultipleEmployees.error
        );
        console.log(err);
    }
};

// hủy xóa nhiều nhân viên
const cancelBulkDeleteAction = () => {
    employeeChecklist.value = [];
    isDeleting.value = false;
    Dialog.hide();
};

/**
 * === CHỨC NĂNG SỬA DỮ LIỆU NHÂN VIÊN ===
 */
const isUpdating = ref(false);
const handleShowEmployeeDetails = (employee) => {
    isUpdating.value = true;
    Employee.setCurrentEmployee(employee);
    Employee.showDetails(employee);
};

// Mở TablePopup, lấy dữ liệu nhân viên theo ID và gán vào employeeData.
// const handleShowTablePopup = async (employee) => {
//     await getEmployeeById(employee.EmployeeId);
//     state.showTablePopup = true;
// };
</script>

<template>
    <div id="data-table">
        <div class="data-table-header">
            <div class="bulk-actions" v-if="isShowBulkDeleteAction">
                <span class="checked-count">
                    Đã chọn <b>{{ employeeChecklist.length }}</b>
                </span>
                <span class="uncheck-all-button" @click="employeeChecklist = []">Bỏ chọn</span>
                <VButton
                    type="outline"
                    size="medium"
                    class="bulk-delete-button"
                    @click="handleShowBulkDeleteDialog"
                >
                    <template #icon>
                        <div class="icon-delete">
                            <VIcon class="delete-img" />
                        </div>
                    </template>
                    Xóa hàng loạt
                </VButton>

                <!-- bulk delete dialog -->
                <VDialog
                    v-if="
                        isDeleting &&
                        Dialog.current.name === DialogName.DeleteMultipleEmployees
                    "
                >
                    <template #title>
                        {{ VNDialogResources.DeleteMultipleEmployees.title }}
                    </template>
                    <template #text>
                        {{ VNDialogResources.DeleteMultipleEmployees.text }}
                    </template>
                    <template #primaryAction>
                        <VButton
                            type="primary"
                            colorScheme="red"
                            @click="handleBulkDeleteAction"
                        >
                            {{ VNDialogResources.DeleteMultipleEmployees.primaryAction }}
                        </VButton>
                    </template>
                    <template #secondaryAction>
                        <VButton type="outline" @click="cancelBulkDeleteAction">
                            {{ VNDialogResources.DeleteMultipleEmployees.secondaryAction }}
                        </VButton>
                    </template>
                </VDialog>
            </div>
            <div class="tools">
                <VTextField
                    size="medium"
                    width="extra-large"
                    placeholder="Tìm theo mã, tên nhân viên"
                    id="search-employee"
                    class="search-employee-textfield"
                    :input="searchText"
                    @input="handleSearchInput($event)"
                    :tooltip="false"
                >
                    <template #icon>
                        <IconSearch class="search-icon" @click="handleSearchEmployee" />
                    </template>
                </VTextField>

                <VButton type="icon" @click="handleReloadData">
                    <div class="icon-refresh">
                        <VIcon class="refresh-img" />
                    </div>
                </VButton>
            </div>
        </div>
        <div class="table-group">
            <table>
                <thead>
                    <tr>
                        <th
                            v-for="(column, index) in tableColumns"
                            :key="index"
                            :title="column.title"
                            :class="[
                                `th-${column.name}`,
                                `cell-${column.width}`,
                                { fixed: fixedColumns.includes(column.name) }
                            ]"
                        >
                            <span v-if="column.header">
                                {{ column.header }}
                            </span>
                            <VCheckbox
                                v-else
                                id="multiple-employees-checkbox"
                                :checked="
                                    employeeData.length !== 0 &&
                                    employeeChecklist.length === employeeData.length
                                "
                                @click="toggleCheckAllEmployee($event)"
                            />
                        </th>
                        <th class="th-options"><div class="cell-small">chức năng</div></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="employee in employeeData"
                        :key="employee.EmployeeCode"
                        :class="[
                            { 'selected-row': employeeChecklist.includes(employee) },
                            {
                                'higher-elevation':
                                    isOpenDropdownOptions && Employee.current === employee
                            }
                        ]"
                        @dblclick="handleShowEmployeeDetails(employee)"
                    >
                        <td
                            v-for="(column, index) in tableColumns"
                            :key="index"
                            :class="[
                                `td-${column.name}`,
                                { fixed: fixedColumns.includes(column.name) }
                            ]"
                        >
                            <div
                                v-if="column.property"
                                :class="['cell-data', `cell-${column.width}`]"
                            >
                                {{ formatDataCell(employee, column.property) }}
                            </div>
                            <VCheckbox
                                v-else
                                id="employee-checkbox"
                                :checked="employeeChecklist.includes(employee)"
                                @change="checkEmployee($event, employee)"
                            />
                        </td>

                        <td class="td-options">
                            <span
                                class="update-button"
                                @click="Employee.showDetails(employee)"
                            >
                                Sửa
                            </span>
                            <div class="dropdown">
                                <IconExpandMore
                                    class="expand-more-icon"
                                    @click="handleClickExpandIcon($event, employee)"
                                />
                                <div
                                    v-if="
                                        isOpenDropdownOptions && Employee.current === employee
                                    "
                                    class="dropdown-menu"
                                >
                                    <div class="dropdown-menu-item">Nhân bản</div>
                                    <div
                                        class="dropdown-menu-item"
                                        @click="handleShowDeleteEmployeeDialog"
                                    >
                                        Xóa
                                    </div>
                                    <div class="dropdown-menu-item">Ngừng sử dụng</div>
                                </div>
                            </div>
                        </td>
                        <!-- delete employee dialog -->
                        <Teleport to="#main">
                            <VDialog v-if="isDeleting && Employee.current === employee">
                                <template #title>
                                    {{ VNDialogResources.DeleteEmployee.title }}
                                </template>
                                <template #text>
                                    {{
                                        VNDialogResources.DeleteEmployee.text(
                                            employee.EmployeeCode
                                        )
                                    }}
                                </template>
                                <template #primaryAction>
                                    <VButton
                                        type="primary"
                                        @click="handleDeleteEmployee(employee)"
                                    >
                                        {{ VNDialogResources.DeleteEmployee.primaryAction }}
                                    </VButton>
                                </template>
                                <template #secondaryAction>
                                    <VButton type="outline" @click="cancelDeleteEmployee">
                                        {{ VNDialogResources.DeleteEmployee.secondaryAction }}
                                    </VButton>
                                </template>
                            </VDialog>
                        </Teleport>
                    </tr>
                </tbody>
                <EmployeeForm v-if="Employee.isShowDetails" />
            </table>
            <div class="data-table-footer">
                <span>
                    Tổng số: <b>{{ employeeData.length }}</b> bản ghi
                </span>
                <div class="paging-group">
                    <VDropdownlist
                        size="small"
                        width="large"
                        id="record-per-page"
                        :options="[
                            '10 bản ghi trên 1 trang',
                            '20 bản ghi trên 1 trang',
                            '30 bản ghi trên 1 trang',
                            '50 bản ghi trên 1 trang',
                            '100 bản ghi trên 1 trang'
                        ]"
                    />
                    <div class="page-switcher">
                        <div class="before-page">Trước</div>
                        <div class="page-list">
                            <div class="page current-page">1</div>
                            <div class="page">2</div>
                            <div class="page">3</div>
                            <div class="page">...</div>
                            <div class="page">10</div>
                        </div>
                        <div class="after-page">Sau</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

#data-table {
    max-height: var(--data-table-height);
    height: 100%;
    @include font(13);
}

.data-table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    min-height: var(--data-table-header-height);
    padding: 16px 0;
    @include font(14);
    &:not(:has(.bulk-delete-button)) {
        justify-content: flex-end;
    }
}

.data-table-header .bulk-actions {
    display: flex;
    align-items: center;
    .checked-count {
        margin-right: 16px;
    }
    .uncheck-all-button {
        margin-right: 24px;
        color: rgb(var(--c-red-500));
        cursor: pointer;
    }
    .bulk-delete-button {
        .icon-delete {
            @include size(18px);
            transform: scale(calc(18 / 15));
            margin-right: 4px;
            margin-left: -4px;
            .delete-img {
                @include size(15px);
                background-position: -464px -313px;
                filter: brightness(0);
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
    .icon-refresh {
        @include size(20px);
        transform: scale(calc(20 / 24));
        .refresh-img {
            width: 22px;
            height: 23px;
            background-position: -424px -201px;
        }
    }
}

.table-group {
    max-height: var(--data-table-group-table-height);
    height: 100%;
    border: 1px solid rgb(var(--c-gray-300));
    background-color: rgb(var(--c-white));
    overflow: auto;
    &::-webkit-scrollbar {
        @include size(8px);
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgb(var(--c-gray-400));
    }
    &::-webkit-scrollbar-track {
        background-color: rgb(var(--c-gray-100));
    }
}

table {
    @include font('small');
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

/* Table Header Row */
/* Width of cell */
.cell-extra-large {
    width: 220px;
}
.cell-large {
    width: 180px;
}
.cell-medium {
    width: 140px;
}
.cell-small {
    width: 100px;
}

.cell-extra-small {
    width: 20px;
}

tr {
    position: sticky;
    top: 0;
    &.selected-row > td {
        background-color: rgb(var(--c-light-green-100));
    }
    &.higher-elevation {
        z-index: 5;
    }

    th {
        padding: 0 10px;
        text-transform: uppercase;

        height: var(--table-row-height);
        background-color: rgb(var(--c-gray-200));

        border: 1px solid rgb(var(--c-gray-300));
        border-width: 0 1px 1px 0;
    }

    .th-bank-branch {
        border-width: 0 0 1px 0;
    }
    .th-options {
        position: sticky;
        right: 0;
        border-width: 0 0 1px 1px;
    }
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

.td-employee-check,
.th-employee-check {
    left: 0;
}

.td-employee-code,
.th-employee-code {
    left: 39px;
}

.td-full-name,
.th-full-name {
    left: 199.5px;
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

/* Styles for data-table-footer */
.data-table-footer {
    position: sticky;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 56px;
    padding: 12px;
    background-color: rgb(var(--c-white));
    border-top: 1px solid rgb(var(--c-gray-300));
}
.paging-group {
    display: flex;
    align-items: center;
    gap: 16px;
    .page-switcher {
        display: flex;
        .before-page,
        .after-page {
            color: rgb(var(--c-gray-600));
            cursor: pointer;
        }
        .page-list {
            display: flex;
            align-items: center;
            margin: 0 12px;
            .page {
                padding: 0 6px;
                cursor: pointer;
            }
            .current-page {
                font-weight: 700;
                border: 1px solid rgb(var(--c-gray-300));
            }
        }
    }
}
</style>
