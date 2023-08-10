<template>
    <img :src="imageUrl" :alt="altText" />
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'VImage',
    props: {
        src: String,
        alt: String,
    },
    setup(props) {
        const imageUrl = ref(props.src);
        const altText = ref(props.alt);

        return {
            imageUrl,
            altText,
        };
    },
};
</script>
