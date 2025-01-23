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

  <article class="prose prose-stone">
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
    <!-- ... -->
  </article>
</template>
