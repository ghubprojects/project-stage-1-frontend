<script setup>
import { VButton } from '@/components';
import state from '@/store';
import DataTable from './DataTable.vue';

const handleShowTablePopup = () => {
    state.showTablePopup = true;
    state.employeePopupData = {};
};
</script>

<template>
    <div id="content">
        <div class="content-header">
            <div class="heading-1">Nhân viên</div>
            <VButton
                size="small"
                type="primary"
                text="Thêm mới nhân viên"
                class="add-new-employee-button"
                @click="handleShowTablePopup()"
            />
        </div>
        <DataTable />
    </div>
</template>

<style lang="scss" scoped>
#content {
    height: calc(100% - var(--header-height));
    padding: 20px 24px 24px;
    background-color: var(--gray-200);
    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
}
</style>
