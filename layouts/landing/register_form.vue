<template>
   <div class="flex flex-col md:flex-row justify-center gap-[20px] w-11/12 mx-auto">
    <div class="flex flex-col items-center bg-[rgba(120,203,182,0.3)] rounded-[20px] p-[20px] md:p-[50px] w-full md:w-1/2">
      <div class="border border-solid w-full h-[80px] rounded-[20px]"></div>
      <h2 class="text-black font-roboto text-2xl md:text-3xl font-semibold text-center">Regístrate para comenzar</h2>
      <input type="text" name="nombre" id="nombre" placeholder="Tu nombre" aria-label="Nombre" 
        class="bg-white rounded-lg h-[40px] w-full mb-2">
      <input type="text" name="telefono" id="telefono" placeholder="Tu número de telefono" aria-label="Telefono" 
        class="bg-white rounded-lg h-[40px] w-full mb-2">
      <input type="text" name="email" id="email" placeholder="Tu correo electronico" aria-label="Email" 
        class="bg-white rounded-lg h-[40px] w-full mb-2">
      <button class="bg-[#78CBB6] text-white w-full h-[40px] rounded-[20px] font-roboto text-base font-semibold">Crear mi cuenta</button>
      <div>
        <input type="checkbox" id="aceptacion" aria-label="Acepto el procesamiento de datos personales">
        <label for="aceptacion">Acepto el procesamiento de datos personales de acuerdo con los terminos del acuerdo de usuario</label>
      </div>
    </div>
    <div class="flex flex-col justify-center w-full md:w-1/2">
      <h2 class="text-right text-black font-roboto text-[40px] md:text-[60px] font-semibold">¡Empieza a aprender <br> inglés <span class="text-[#FBB715]">YA</span>!</h2>
      <p class="text-base md:text-lg">Registrate en la platafarma</p>
      <p class="text-base md:text-lg">Recibe tu primera lección completamente gratis</p>
      <p class="text-base md:text-lg">Prueba todas las herramientas del curso y empieza a mejorar tu inglés!</p>
      <button class="bg-[#7660D3] text-white w-full md:w-[300px] h-[60px] rounded-[20px] font-roboto text-base font-semibold">VER LOS CURSOS</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterForm'
}
</script>
