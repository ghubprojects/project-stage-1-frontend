<script setup>
import { VButton } from '@/components';
import { IconClose } from '@/assets/icons';
</script>

<template>
    <div class="dialog">
        <div class="dialog-container">
            <div class="dialog-header">
                <div class="heading heading-1">Cảnh báo</div>
                <IconClose class="close-icon" @click="$emit('closeDialog')" />
            </div>
            <div class="dialog-description">
                Mã nhân viên &lt;NV-0001&gt; đã tồn tại trong hệ thống, vui lòng kiểm tra lại.
            </div>
            <div class="dialog-footer">
                <VButton
                    size="medium"
                    type="primary"
                    text="Đồng ý"
                    class="agree-button"
                    @click="$emit('closeDialog')"
                />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.dialog {
    @apply fixed inset-0 flex items-center justify-center z-50;
    background-color: var(--modal-background);
}

.dialog-container {
    @apply flex flex-col gap-6 p-6 rounded;
    background-color: var(--white);
}

.dialog-header {
    @apply flex items-center justify-between;
    .close-icon {
        @include size(24px);
        cursor: pointer;
        transform: scale(20/24);
    }
}
.dialog-footer {
    @apply flex justify-end;
}
</style>
