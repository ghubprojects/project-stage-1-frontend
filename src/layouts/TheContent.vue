<script setup>
import { VButton } from '@/components';
import { DataTable, EmployeeDetails } from '@/features';
import { useEmployeeDetailsStore } from '@/stores/employeeDetails';
import { ref } from 'vue';

const employeeData = ref({});

const employeeDetails = useEmployeeDetailsStore();
</script>

<template>
    <div id="content">
        <div class="content-header">
            <div class="heading-1">Nhân viên</div>
            <VButton type="primary" size="small" @click="employeeDetails.createDetails">
                Thêm mới nhân viên
            </VButton>
        </div>
        <DataTable />
    </div>
</template>

<style lang="scss" scoped>
#content {
    height: calc(100% - var(--header-height));
    padding: 20px 24px 24px;
    background-color: rgb(var(--c-gray-200));
    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
}
</style>
@/stores/employeeDetails
