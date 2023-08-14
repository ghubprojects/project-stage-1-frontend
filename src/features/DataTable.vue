<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import { IconExpandMore, IconRefresh, IconSearch } from '@/assets/icons';
import { VDialog, VDropdownlist, VTextField } from '@/components';
import EmployeeDetails from './EmployeeDetails.vue';

// import * as employeeDataService from '@/services/employeeDataService';
// import state from '@/store';
import { useEmployeeDetailsStore } from '@/stores/employeeDetails';

import * as dataHandler from '@/utils/dataHandler';
import { employeeList } from '@/utils/employeeData';
import { tableColumns } from '@/utils/tableColumns';

const employeeDetails = useEmployeeDetailsStore();

const showDialog = ref(false);
const fixedColumns = ['employee-check', 'employee-code', 'full-name'];

const employeesList = ref(employeeList);

/**
 * Lấy dữ liệu của tất cả employees từ API.
 */
const getAllEmployees = async () => {
    try {
        // employeesList.value = await employeeDataService.readAll();
        employeesList.value = employeeList;
    } catch (err) {
        console.log(err);
    }
};

/**
 * Lấy dữ liệu của tất cả employees từ API.
 */
// const getEmployeeById = async (id) => {
//     try {
//         employeeData.value = await employeeDataService.readById(id);
//     } catch (err) {
//         console.log(err);
//     }
// };

/**
 * Reload dữ liệu khi click vào IconRefresh.
 */
const handleReloadData = async () => {
    employeesList.value = [];
    getAllEmployees();
};

/**
 * Định dạng lại dữ liệu nhân viên lấy từ API.
 */
const formatDataCell = (data, property) =>
    property === 'Gender' ? dataHandler.getGender(data[property]) : data[property];

// Hàm xử lý khi click vào ExpandIcon.
// const handleClickExpandIcon = (event, index) => {
//     /**
//      * Nếu click vào ExpandIcon 2 lần, gán currentRow = null.
//      * Nếu không thì, gán previousRow = currentRow và currentRow = index hiện tại.
//      */
//     if (state.currentRow === index) state.currentRow = null;
//     else {
//         state.previousRow = state.currentRow;
//         state.currentRow = index;
//     }

//     // Ngăn chặn nổi bọt sự kiện ra window khi click vào ExpandIcon
//     event.stopPropagation();

//     // Hiển thị trạng thái row đang xử lý
//     console.table({
//         index: index,
//         'state.previousRow': state.previousRow,
//         'state.currentRow': state.currentRow
//     });
// };

// Hàm đóng dropdown, được gọi khi click vào window (blur)
// const closeDropdown = () => {
//     state.currentRow = null;
// };

// // Mở TablePopup, lấy dữ liệu nhân viên theo ID và gán vào employeeData.
// const handleShowTablePopup = async (employee) => {
//     await getEmployeeById(employee.EmployeeId);
//     state.showTablePopup = true;
// };

// onMounted(() => {
//     getAllEmployees();
//     // Click ra ngoài document, đóng dropdown.
//     document.addEventListener('click', closeDropdown);
// });
// onUnmounted(() => {
//     // Khi bị unmount, loại bỏ sự kiện click khỏi đối tượng document.
//     document.removeEventListener('click', closeDropdown);
// });
</script>

<template>
    <div id="data-table">
        <div class="table-tools">
            <VTextField
                size="small"
                width="extra-large"
                placeholder="Tìm theo mã, tên nhân viên"
                id="search-employee"
                class="search-employee-textfield"
            >
                <template #icon><IconSearch class="search-icon" /></template>
            </VTextField>

            <IconRefresh class="refresh-button" @click="handleReloadData()" />
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
                            <component v-else :is="column.content" id="all-employee-check" />
                        </th>
                        <th :class="['th-options', 'cell-small']"><span>chức năng</span></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(employee, index) in employeesList"
                        :key="index"
                        @dblclick="employeeDetails.showDetails(employee)"
                    >
                        <td
                            v-for="(column, index) in tableColumns"
                            :key="index"
                            :class="[
                                `td-${column.name}`,
                                `cell-${column.width}`,
                                { fixed: fixedColumns.includes(column.name) }
                            ]"
                        >
                            <span v-if="column.property">
                                {{ formatDataCell(employee, column.property) }}
                            </span>
                            <component v-else :is="column.content" id="employee-check" />
                        </td>

                        <td class="td-options">
                            <span class="update-button"> Sửa </span>
                            <div class="dropdown">
                                <IconExpandMore
                                    class="expand-more-icon"
                                    @click="handleClickExpandIcon($event, index)"
                                />
                                <div v-if="false" class="dropdown-menu">
                                    <div class="dropdown-menu-item">Nhân bản</div>
                                    <div class="dropdown-menu-item" @click="showDialog = true">
                                        Xóa
                                    </div>
                                    <div class="dropdown-menu-item">Ngừng sử dụng</div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <Teleport to="#app">
                    <VDialog v-if="false" @close-dialog="showDialog = false" />
                </Teleport>
                <Teleport to="#app">
                    <EmployeeDetails v-if="employeeDetails.isShowDetails" />
                </Teleport>
            </table>
            <div class="record-manager">
                <div class="total-record">
                    Tổng số: <b class="record-count">{{ employeesList.length }}</b> bản ghi
                </div>
                <div class="right-column">
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
    height: calc(100% - 48px);

    @include font(13);
    background-color: rgb(var(--c-white));
}

.table-tools {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;

    padding: 12px 20px 12px 16px;
    background-color: rgb(var(--c-white));

    .refresh-button {
        @include size(24px);
        cursor: pointer;
    }
}

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
    }
}

.table-group {
    height: calc(100% - 56px);
    overflow: auto;
    &::-webkit-scrollbar {
        @include size(8px);
    }
    &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background-color: rgb(var(--c-gray-400));
    }
    &::-webkit-scrollbar-track {
        background-color: rgb(var(--c-gray-200));
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
    min-width: 260px;
}
.cell-large {
    min-width: 200px;
}
.cell-medium {
    min-width: 160px;
}
.cell-small {
    min-width: 128px;
}

.cell-extra-small {
    min-width: 40px;
}

/* Align text */
.align-left {
    text-align: left;
}

.align-center {
    text-align: center;
}

.align-right {
    text-align: right;
}

.fixed {
    position: sticky;
    z-index: 50;
}

tr {
    position: sticky;
    top: 0;
    th {
        padding: 0 10px;
        text-transform: uppercase;

        height: var(--table-row-height);
        background-color: rgb(var(--c-gray-200));

        border: 1px solid rgb(var(--c-gray-300));
        border-width: 0 1px 1px 0;
    }
    .th-employee-check {
        left: 0;
    }
    .th-employee-code {
        left: 40px;
    }
    .th-full-name {
        left: 190px;
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

tr.current-row {
    z-index: 20;
}

/* Table Data Row */
td {
    padding: 0 10px;

    height: var(--table-row-height);
    background-color: rgb(var(--c-white));

    border: 1px solid rgb(var(--c-gray-300));
    border-width: 0 1px 1px 0;
}

.td-date-of-birth {
    text-align: center;
}

.td-bank-branch {
    border-width: 0 0 1px 0;
}

.td-options {
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
        font-weight: var(--font-weight-base);
        border: 1px solid rgb(var(--c-gray-300));
        .dropdown-menu-item {
            padding: 6px 10px;
            cursor: pointer;
            &:hover {
                color: var(--primary);
                background-color: rgb(var(--c-gray-200));
            }
        }
    }
}

.fixed {
    position: sticky;
    z-index: 50;
}

.td-employee-check {
    left: 0;
}

.td-employee-code {
    left: 40px;
}

.td-full-name {
    left: 190px;
}

/* Styles for record-manager */
.record-manager {
    position: sticky;
    bottom: 0;
    left: 0;

    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 56px;
    padding: 8px;
    background-color: rgb(var(--c-white));
}

.record-manager .right-column {
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
@/stores/employeeDetails @/utils/employeeField
