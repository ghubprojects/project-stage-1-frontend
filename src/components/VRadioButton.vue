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

<script>
import { ref } from 'vue';

export default {
    name: 'BaseRadioButton',
    emits: ['update:radioValue'],
    props: {
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
    },
    setup(props, { emit }) {
        const radioValue = ref(props.value);

        const handleChange = (event) => {
            if (event.target.checked) {
                emit('update:radioValue', event.target.value);
            }
        };

        return {
            radioValue,
            handleChange
        };
    }
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixins.scss';
.radio-button {
    @apply flex items-center;
}

.radio-input {
    @apply flex;
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
    border: 1px solid var(--gray-400);
    background-color: var(--white);
}

/* When input is checked, change background-color of checkmark*/
.radio-input > input[type='radio']:checked + .checkmark {
    border-color: var(--primary);
}

/* When input is checked, display check icon */
.radio-input > input[type='radio']:checked + .checkmark::before {
    @include centerAbsolute('both');
    @include size(10px);

    content: '';
    display: block;
    background: var(--primary);
    border-radius: 999px;
}

/* Style for label */
.radio-button label {
    @apply inline-block pl-2 select-none cursor-pointer;
}
</style>
