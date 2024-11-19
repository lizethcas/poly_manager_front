<script setup>
import { useCounterStore } from "@/stores/count.store";

const counter = useCounterStore()


</script>

<template>
    
    <!-- Access the state directly from the store -->
    <div class="flex items-center gap-4">
      <div>Current Count: {{ counter.count }}</div>
      <button @click="counter.increment()">Increment</button>
    </div>
</template>