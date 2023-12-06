<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';

import { useDateFormatStore, useLanguageStore } from './stores';
import { DateFormatList, LanguageList } from './utils/enum';

const Language = useLanguageStore();
const DateFormat = useDateFormatStore();

/**
 * Khi mounted,
 * lấy language từ session storage và lưu trữ trong global state Language
 * và lấy dateformat từ session storage và lưu trữ trong global state DateFormat
 * Ngôn ngữ mặc định là: VI (Tiếng Việt)
 * Định dạng thời gian mặc định là: DMY (dd/mm/yyyy)
 * Created by: ttanh (04/10/2023)
 * Modified by: ttanh (06/10/2023)
 */
onMounted(() => {
    Language.current = localStorage.getItem('language') ?? LanguageList.VI;
    DateFormat.current = localStorage.getItem('dateformat') ?? DateFormatList.DMY;
});
</script>

<template>
    <RouterView />
</template>
