<script setup>
import { VButton } from '@/components';
import { ref } from 'vue';
import DataTable from './DataTable.vue';
import TablePopup from './TablePopup.vue';

const showNewForm = ref(false);
const employeeData = ref({});

const handleShowTablePopup = () => {
    showNewForm.value = true;
    employeeData.value = {};
};
</script>

<template>
    <div id="content">
        <div class="content-header">
            <div class="heading-1">Nhân viên</div>
            <VButton type="primary" size="small" @click="handleShowTablePopup">
                Thêm mới nhân viên
            </VButton>
        </div>
        <DataTable />
        <Teleport to="#app">
            <TablePopup v-if="showNewForm" :employeeData="employeeData" />
        </Teleport>
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
