<template>
    <div class="flex flex-col mb-4">
        <label v-if="label" :for="inputId" class="mb-2 font-semibold text-gray-700">{{ label }}</label>
        <input :id="inputId" :type="type" :value="value" :placeholder="placeholder" :disabled="disabled"
            @input="$emit('input', $event.target.value)"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500" />
    </div>
</template>
<script>
export default {
    name: 'BaseInput',
    props: {
        value: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'text'
        },
        placeholder: {
            type: String,
            default: ''
        },
        label: {
            type: String,
            default: ''
        },
        disabled: {
            type: Boolean,
            default: false
        },
        inputId: {
            type: String,
            default: () => `input-${Math.random().toString(36).substring(7)}`
        }
    }
};
</script>