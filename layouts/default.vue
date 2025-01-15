<template>
  <div>
    <nav class="flex justify-between items-center p-4 bg-gray-200">
      <ul class="flex gap-4">
        <li>
          <NuxtLink to="/">polyAcademy</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/login">Login in</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/register">register</NuxtLink>
        </li>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
