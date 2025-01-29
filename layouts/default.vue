<template>
  <div>
    <nav class="flex justify-between items-center p-4 bg-white">
      <ul class="flex gap-4 justify-between w-full text-sm text-gray-500">
        <div class="flex gap-4 items-center">
          <li>
            <NuxtLink to="/">
              <img src="~/assets/images/logo.png" alt="Logo" class="w-48 h-10" />
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/">INICIO</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/how-it-works">¿CÓMO FUNCIONA?</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/courses">CURSOS</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/contact">CONTACTOS</NuxtLink>
          </li>
        </div>
        <div class="flex gap-4 items-center">
          <li class=" text-[#7660D3] px-4 py-2 rounded-md" v-if="route.path !== '/login'">
            <NuxtLink to="/login">SIGN IN</NuxtLink>
          </li>
          <li class="bg-[#7660D3] text-white px-4 py-2 rounded-full" v-if="route.path !== '/register'">
            <NuxtLink to="/register">SIGN UP</NuxtLink>
          </li>
       
        </div>
      </ul>
    </nav>
    <NuxtPage />
  </div>

  <!--   <article class="prose prose-stone">
    <h1>Garlic bread with cheese: What the science tells us</h1>
    <p>
      For years parents have espoused the health benefits of eating garlic bread
      with cheese to their children, with the food earning such an iconic status
      in our culture that kids will often dress up as warm, cheesy loaf for
      Halloween.
    </p>
    <p>
      But a recent study shows that the celebrated appetizer may be linked to a
      series of rabies cases springing up around the country.
    </p>

  </article> -->
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
</script>
