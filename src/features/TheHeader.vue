<script setup>
import { IconArrowDown, IconArrowRight, IconBell, IconMenu } from '@/assets/icons';
import { VImage } from '@/components';

const branchName = 'công ty cổ phần misa';
const userName = 'tăng thế anh';
</script>

<template>
    <header id="header">
        <div class="left-column">
            <IconMenu class="menu-icon" />

            <div class="branch">
                <div class="name">{{ branchName }}</div>
                <IconArrowRight class="arrow-right-icon" />
            </div>
        </div>

        <div class="right-column">
            <IconBell class="bell-icon" />

            <div class="current-user">
                <VImage src="src/assets/images/avatar.jpg" alt="avatar-image" class="avatar-image" />
                <div class="name">{{ userName }}</div>
                <IconArrowDown class="arrow-down-icon" />
            </div>
        </div>
    </header>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
/* === Styles for header === */
#header {
    height: var(--header-height);
    display: flex;
    padding: 12px 16px;
    justify-content: space-between;
    align-items: center;
}

#header .left-column {
    display: flex;
    gap: 16px;
    .menu-icon {
        @include size(24px);
        cursor: pointer;
    }
    .branch {
        display: flex;
        gap: 10px;
        align-items: center;
        cursor: pointer;
        .name {
            font-weight: 500;
            text-transform: uppercase;
        }
        .arrow-right-icon {
            @include size(14px);
            transform: rotate(90deg);
        }
    }
}
#header .right-column {
    display: flex;
    align-items: center;
    .bell-icon {
        margin-right: 26px;
        @include size(24px);
        cursor: pointer;
    }
    .current-user {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        .avatar-image {
            @include size(32px);
            border-radius: 999px;
        }
        .name {
            font-weight: 500;
            text-transform: capitalize;
        }
        .arrow-down-icon {
            @include size(14px);
        }
    }
}
</style>
