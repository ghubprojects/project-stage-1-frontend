<script setup>
import { VButton } from '@/components';
import { IconClose } from '@/assets/icons';
import IconWarning from '@/assets/icons/IconWarning.vue';

const emit = defineEmits(['closeDialog']);
</script>

<template>
    <div class="dialog">
        <div class="dialog-container">
            <div class="dialog-wrapper">
                <IconWarning class="warning-icon" />
                <div class="dialog-content">
                    <div class="dialog-header">
                        <div class="heading heading-1">Cảnh báo</div>
                        <IconClose class="close-icon" @click="emit('closeDialog')" />
                    </div>
                    <div class="dialog-description">
                        Mã nhân viên &lt;1001&gt; đã tồn tại trong hệ thống, vui lòng kiểm tra lại.
                    </div>
                </div>
            </div>
            <div class="dialog-footer">
                <VButton
                    size="medium"
                    type="primary"
                    class="agree-button"
                    @click="emit('closeDialog')"
                >
                    Đồng ý
                </VButton>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    background-color: var(--modal-background);
}

.dialog-container {
    max-width: 480px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    border-radius: 4px;
    background-color: rgb(var(--c-white));
    .dialog-wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

.warning-icon {
    @include size(60px);
    color: rgb(var(--c-red-400));
}

.dialog-content {
    max-width: 348px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .close-icon {
        @include size(24px);
        transform: scale(20/24);
        cursor: pointer;
    }
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
</style>
