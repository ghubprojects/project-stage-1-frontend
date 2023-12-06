<script setup>
import { VButton } from '@/components';
import { DataTable } from '@/features';
import { onBeforeUnmount, onMounted } from 'vue';

import { ButtonResources, TableResources } from '@/resources';
import { useLanguageStore } from '@/stores';
import { useEmployeeStore } from '@/stores/employee';

const Language = useLanguageStore();
const Employee = useEmployeeStore();

/**
 * === XỬ LÝ PHÍM TẮT ===
 */

/**
 * Khi ấn phím tắt INSERT, khởi tạo và hiển thị form trống
 * @param {event} event
 * Created by: ttanh (27/09/2023)
 */
const handleKeyDownContent = (event) => {
    if (event.code === 'Insert') {
        Employee.form.create();
    }
};

// Khi mounted, thêm event listener
onMounted(() => {
    document.addEventListener('keydown', handleKeyDownContent);
});

// Khi unMounted, thêm event listener
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeyDownContent);
});
</script>

<template>
    <div id="content">
        <div class="content-header">
            <div class="heading-1">{{ TableResources[Language.current].Title }}</div>

            <VButton
                type="primary"
                size="medium"
                :title="ButtonResources[Language.current].AddEmployeeTooltip"
                @click="Employee.form.create"
            >
                {{ ButtonResources[Language.current].AddEmployee }}
            </VButton>
        </div>
        <DataTable />
    </div>
</template>

<style lang="scss" scoped>
#content {
    max-height: var(--main-content-height);
    height: 100%;
    padding: var(--main-content-padding-top) var(--main-content-padding-x)
        var(--main-content-padding-bottom);
    background-color: rgb(var(--c-gray-100));
    .content-header {
        height: var(--main-content-header-height);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>
