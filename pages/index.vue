<template>
  <div>
    <div class="relative overflow-hidden w-11/12 mx-auto">
      <!-- Contenedor del carrusel -->
      <div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <!-- Primera tarjeta -->
        <div class="w-full flex-shrink-0 rounded-[50px] border border-solid p-4 md:p-6 lg:p-8">
          <div>
            <h2 class="text-[#323539] font-roboto text-4xl md:text-6xl lg:text-[84px] font-semibold leading-tight">SPEAK WHIT <br>NO <span class="text-[#FBB715]">LIMITS</span></h2>
            <p class="text-black font-roboto text-xl md:text-2xl lg:text-3xl font-semibold mt-4">¡Descubre la libertad de <br>comunicarte en inglés y conquistar <br> el mundo!</p>
            <button class="bg-[#7660D3] text-white w-full md:w-[300px] h-[60px] rounded-[50px] font-roboto text-lg md:text-xl font-semibold mt-6">NUESTROS CURSOS</button>
            
            <div class="flex flex-col md:flex-row justify-between mt-8 gap-4">
              <p class="text-black font-roboto text-lg md:text-xl font-semibold">Nuestros números <br> dicen más sobre <br> nosotros</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Cursos activos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">20K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Escenarios nuevos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Nuevos estudiantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Segunda tarjeta -->
        <div class="w-full flex-shrink-0 rounded-[50px] border border-solid p-4 md:p-6 lg:p-8">
          <div>
            <h2 class="text-[#000000] font-roboto text-4xl md:text-6xl lg:text-[84px] font-semibold leading-tight">SPEAK FROM <br> DAY <span class="text-[#FBB715]"> ONE</span></h2>
            <p class="text-[#000000] font-roboto text-xl md:text-2xl lg:text-3xl font-semibold mt-4">¡Pruébalo ahora <br> en una lección introductoria <br> gratuita!</p>   
            <button class="bg-[#78CBB6] text-white w-full md:w-[300px] h-[60px] rounded-[50px] font-roboto text-lg md:text-xl font-semibold mt-6">Claim my free Class</button>
            
            <div class="flex flex-col md:flex-row justify-between mt-8 gap-4">
              <p class="text-[#000000] font-roboto text-lg md:text-xl font-semibold">Nuestros números <br> dicen más sobre <br>  nosotros</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Cursos activos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">20K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Escenarios nuevos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Nuevos estudiantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tercera tarjeta -->
        <div class="w-full flex-shrink-0 rounded-[50px] border border-solid p-4 md:p-6 lg:p-8">
          <div>
            <h2 class="text-[#000000] font-roboto text-4xl md:text-6xl lg:text-[84px] font-semibold leading-tight">ENGLISH FOR <br> <span class="text-[#FBB715]">ANYONE</span></h2>
            <p class="text-[#000000] font-roboto text-xl md:text-2xl lg:text-3xl font-semibold mt-4">Encuentra el curso que se adapta a <br> tus necesidades</p>
            <button class="bg-[#7660D3] text-white w-full md:w-[300px] h-[60px] rounded-[50px] font-roboto text-lg md:text-xl font-semibold mt-6">VER PROGRAMAS</button>
            
            <div class="flex flex-col md:flex-row justify-between mt-8 gap-4">
              <p class="text-[#000000] font-roboto text-lg md:text-xl font-semibold">Nuestros números <br> dicen más sobre <br>  nosotros</p>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Cursos activos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">20K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Escenarios nuevos</p>
                </div>
                <div class="text-center">
                  <h3 class="text-[#5EA3E0] font-roboto text-4xl md:text-[65px] font-normal">5K+</h3>
                  <p class="text-[#76787A] font-roboto text-sm md:text-base font-normal">Nuevos estudiantes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de navegación -->
      <button @click="prevSlide" class="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-r z-10">
        ←
      </button>
      <button @click="nextSlide" class="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-gray-800/50 text-white p-2 rounded-l z-10">
        →
      </button>

      <!-- Indicadores -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <button 
          v-for="(_, index) in 3" 
          :key="index"
          @click="goToSlide(index)"
          :class="[
            'w-3 h-3 rounded-full',
            currentSlide === index ? 'bg-white' : 'bg-white/50'
          ]"
        ></button>
      </div>
    </div>
  </div>
  <div class="flex flex-col md:flex-row justify-between w-11/12 mx-auto mt-[100px] gap-[50px]">
    <div class="flex-1">
      <h2 class="text-black font-roboto text-[40px] md:text-[60px] font-semibold">¿Por qué <br>elegir <span class="text-[#7660D3]">Poly</span><span class="text-[#FBB715]">Academy</span>?</h2>
      <p class="text-black font-roboto text-lg md:text-xl font-normal">En My PolyAcademy®, creemos que aprender inglés puede transformar tu vida y abrirte un mundo de posibilidades sin límites. Este curso en línea está diseñado especialmente para principiantes que desean construir una base sólida en el idioma. </p>
      <button class="bg-[#7660D3] text-white w-full md:w-[300px] h-[60px] rounded-[50px] font-roboto text-xl font-semibold">EL METODO POLY</button>
    </div>
    <div class="flex flex-col md:flex-row justify-between bg-[rgba(255,110,115,0.2)] rounded-[50px] p-[20px] md:p-[50px]">
     <div>
      <div>
        <div class="w-[110px] h-[110px] rounded-full bg-[rgba(118,96,211,0.6)] flex items-center justify-center"></div>
        <h2 class="text-black font-roboto text-3xl font-semibold">Horario flexible</h2>
        <p class="text-black font-roboto text-base font-normal">Estudia cuándo y dónde quieras. Avanza a tu velocidad, repite lecciones si lo necesitas y aprende de forma personalizada.</p>
      </div>
      <div>
        <div class="w-[110px] h-[110px] rounded-full bg-[rgba(118,96,211,0.6)] flex items-center justify-center"></div>
        <h2 class="text-black font-roboto text-3xl font-semibold">Inmersión Total</h2>
        <p class="text-black font-roboto text-base font-normal">Sumérgete en el inglés como si estuvieras en el extranjero. Aprende con videos, audios y actividades que te harán pensar y hablar en inglés desde el primer día.</p>
      </div>
     </div>
     <div>
      <div>
        <div class="w-[110px] h-[110px] rounded-full bg-[rgba(118,96,211,0.6)] flex items-center justify-center"></div>
        <h2 class="text-black font-roboto text-3xl font-semibold">Método comunicativo</h2>
        <p class="text-black font-roboto text-base font-normal">Aprende inglés para la vida real. Practica situaciones cotidianas y desarrolla la confianza para comunicarte con fluidez y naturalidad.</p>
      </div>
      <div>
        <div class="w-[110px] h-[110px] rounded-full bg-[rgba(118,96,211,0.6)] flex items-center justify-center"></div>
        <h2 class="text-black font-roboto text-3xl font-semibold">Enfoque integral</h2>
        <p class="text-black font-roboto text-base font-normal">Mejora tus habilidades clave—hablar, escuchar, escribir, pronunciar y dominar la gramática—todo con el enfoque léxico y comunicativo que realmente funciona.</p>
      </div>
     </div>
    </div>
  </div>
  <div class="my-[100px] flex justify-center">
    <h2 class="text-black font-roboto text-[60px] font-semibold">¿Como <span class="text-[#FBB715]">funciona</span>?</h2>
  </div>
  <div style="border: solid; width: 90%; height: 400px; margin: 0 auto; border-radius: 50px; margin-bottom: 100px;"></div>
  <RegisterForm />
  <div class="bg-[#7660D3] w-full h-auto mt-[100px] p-[20px] md:p-[50px]">
    <h2 class="text-white font-roboto text-2xl md:text-4xl font-semibold text-center">Al registrarte, tendrás acceso a capacitación en nuestro <span class="text-[#FBB715]">ecosistema</span></h2>
  </div>
  <div class="flex flex-col justify-center mt-[100px] ">
    <h2 class="text-black font-roboto text-4xl font-semibold text-center">Nuestros <span class="text-[#FBB715]">cursos</span></h2>
    <p class="text-black font-roboto text-s font-semibold text-center mt-[50px]">Seleccionaremos un curso que te llevará a tu objetivo</p>
  </div>
  <div class="flex flex-col md:flex-row justify-center gap-[20px] mt-[100px]">
    <div class="border border-solid w-11/12 md:w-[42%] h-[300px] rounded-[50px] bg-[#D6C0F4] p-[20px] md:p-[50px] mx-auto">
      <h2 class="text-[#6C4CDD] font-roboto text-2xl md:text-3xl font-semibold text-left">Inglés para la vida</h2>
      <p class="text-[#6C4CDD] font-roboto text-base font-normal text-left">Comuniquese con confianza en cualquier situación: cuando viaje, se mueva y en el trabajo.</p>
      <router-link to="/index_2" class="flex items-center justify-center bg-[#7660D3] text-white w-[60px] h-[60px] rounded-full transition-all duration-300 ease-in-out hover:w-[300px]">
        <span class="invisible hover:visible">Conocer más</span>
        <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5-5 5M6 12h12" />
        </svg>
      </router-link>
    </div>
    <div class="border border-solid w-11/12 md:w-[42%] h-[300px] rounded-[50px] bg-[#6C4CDD] p-[20px] md:p-[50px] mx-auto">
      <h2 class="text-[#D6C0F4] font-roboto text-2xl md:text-3xl font-semibold text-left">Inglés para negocios</h2>
      <p class="text-[#D6C0F4] font-roboto text-base font-normal text-left">Comuniquese libremente con personas de su sector, realizar viajes de negocios y dominar reuniones de negocios.</p>
    </div>
  </div>
  <div class="flex justify-center mt-[100px]">
    <h2 class="text-black font-roboto text-4xl font-semibold text-center">¿Tienes preguntas sobre el <span class="text-[#FBB715]">curso</span>?</h2>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import RegisterForm from '../layouts/landing/register_form.vue'

const currentSlide = ref(0)
const totalSlides = 3

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides) % totalSlides
}

const goToSlide = (index) => {
  currentSlide.value = index
}
</script>
