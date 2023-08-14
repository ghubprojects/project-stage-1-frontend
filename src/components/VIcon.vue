<script setup>
import { computed } from 'vue';

const props = defineProps({
    class: { type: String, required: true }
});

const iconClass = computed(() => ['icon', props.class]);
</script>

<template>
    <i :class="iconClass"></i>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';

$--icon-size-default: 24px;
.icon {
    @include centerAbsolute();
    @include size($--icon-size-default);
    background: url('@/assets/images/sprites.svg') no-repeat;
}
</style>
