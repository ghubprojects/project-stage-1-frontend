<script setup>
import { IconClose, IconDialogWarning } from '@/assets/icons';
import { useDialogStore } from '@/stores/dialog';
import VButton from './VButton.vue';

defineProps({
    data: Object,
    title: String,
    text: String,
    secondaryText: String,
    primaryText: {
        type: String,
        required: true
    },
    colorScheme: {
        type: String,
        default: 'primary',
        validator(val) {
            return ['primary', 'red'].includes(val);
        }
    }
});

const emit = defineEmits(['handlePrimary', 'handleSecondary']);

const Dialog = useDialogStore();
</script>

<template>
    <div class="dialog">
        <div class="dialog-container">
            <div class="dialog-wrapper">
                <div class="dialog-header">
                    <div class="heading-1">{{ title ?? data.title }}</div>
                    <IconClose class="close-icon" @click="Dialog.hide" />
                </div>
                <div class="dialog-content">
                    <IconDialogWarning class="icon-warning" />
                    <div class="dialog-text">{{ text ?? data.text }}</div>
                </div>
            </div>
            <div class="dialog-footer">
                <VButton v-if="secondaryText" type="outline" @click="emit('handleSecondary')" focus>
                    {{ secondaryText }}
                </VButton>
                <VButton
                    type="primary"
                    :colorScheme="colorScheme"
                    @click="emit('handlePrimary')"
                    @keydown.tab="$event.preventDefault()"
                    :focus="!secondaryText"
                >
                    {{ primaryText }}
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
    z-index: 100;
    background-color: var(--modal-background);
}

.dialog-container {
    max-width: 480px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 24px;
    border-radius: 4px;
    background-color: rgb(var(--c-white));
    .dialog-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 24px;
    }
}

.dialog-content {
    display: flex;
    align-items: center;
    gap: 20px;
    .icon-warning {
        @include size(40px);
    }
    .dialog-text {
        @include font(14);
    }
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
    gap: 8px;
}
</style>
