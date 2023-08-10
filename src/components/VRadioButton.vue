<script setup>
defineProps({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    value: {
        type: Boolean,
        required: true,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:radioValue']);

const handleChange = (event) => {
    if (event.target.checked) {
        emit('update:radioValue', event.target.value);
    }
};
</script>

<template>
    <div class="radio-button">
        <div class="radio-input">
            <input
                type="radio"
                :name="name"
                :id="id"
                v-model="selected"
                @change="handleChange($event)"
            />
            <span class="checkmark"></span>
        </div>
        <label :for="id">
            <slot name="label"></slot>
        </label>
    </div>
</template>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.radio-button {
    display: flex;
    align-items: center;
}

.radio-input {
    display: flex;
}

/* Styles for default input */
.radio-input > input[type='radio'] {
    @include size(18px);
    margin: 0;

    /* hide but also checked default input */
    opacity: 0;
    z-index: 3;
    cursor: pointer;
}

/* Style for checkmark */
.radio-input > .checkmark {
    @include size(18px);
    @include centerAbsolute('both');

    border-radius: 999px;
    border: 1px solid rgb(var(--c-gray-400));
    background-color: rgb(var(--c-white));
}

/* When input is checked, change background-color of checkmark*/
.radio-input > input[type='radio']:checked + .checkmark {
    border-color: rgb(var(--c-primary));
}

/* When input is checked, display check icon */
.radio-input > input[type='radio']:checked + .checkmark::before {
    @include centerAbsolute('both');
    @include size(10px);

    content: '';
    display: block;
    background: rgb(var(--c-primary));
    border-radius: 999px;
}

/* Style for label */
.radio-button label {
    display: inline-block;
    padding-left: 8px;
    user-select: none;
    cursor: pointer;
}
</style>
