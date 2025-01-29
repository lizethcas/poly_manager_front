<template>
  <div class="flex w-11/12 mx-auto border-solid border rounded-[50px] p-4 md:p-6 lg:p-8">
    <div class="w-2/5">
      <h2 class="text-[#323539] font-roboto text-4xl md:text-6xl lg:text-[84px] font-semibold leading-tight">Inglés por la <span class="text-[#FBB715]">vida</span></h2>
      <p class="text-black font-roboto text-xl md:text-2xl lg:text-3xl font-semibold mt-4">El curso de inglés general para la vida cotidiana, viajes, socialización en el ambienta angloparlante</p>
    </div>
    <div class="w-3/5 ml-auto">
        
    </div>
  </div>

  <div class="flex w-11/12 mx-auto p-4 md:p-6 lg:p-8">
    <div class="w-2/6">
        <h2>¿Para quien es este <span class="text-[#FBB715]">curso</span>?</h2>
    <li>
        los que quieren hablar con confianza en cualquier situación
    </li>
    <li>
        Los que se ezfuersan por alcanzar alturas profesionales
    </li>
    <li>
        Los que viajan y sueñan con comunicarse sin fronterass
    </li>
    </div>
    <div class="w-4/6">
      <div class="flex flex-col h-full">
        <div class="flex flex-row w-full">
          <div class="border-solid border-2 bg-[#FF6E73]/20 rounded-[50px] p-4 w-1/2 group">
            <h3 class="text-[#323539] font-roboto text-2xl md:text-3xl lg:text-4xl font-semibold">¿Quieres hablar con confianza en cualquier situación?</h3>
            <div class="hidden group-hover:block">
              <p class="font-semibold">
                Podrás hablar inglés fácilmente y sin estrés en cualquier situación.
                Gana confianza y aumenta el vocabulario.
              </p>
              <li>
                ¿Quieres comunicarte en inglés con cualquier persona y sobre cualquier tema?
              </li>
              <li>
                ¿Quieres hablar sin acento?
              </li>
              <li>
                ¿Definitivamente has decidido hablar inglés esta vez?
              </li>
              <li>
                ¿Puedes nombrar inmediatamente al menos cinco situaciones en las que necesitas inglés en este momento?
              </li>
            </div>
          </div>
          <div class="border-solid border-2 bg-[#78CBB6]/20 rounded-[50px] p-4 w-1/2 group">
            <p class="text-[#323539] font-roboto text-2xl md:text-3xl lg:text-4xl font-semibold">¿Te esfuerzas por alcanzar alturas profesionales?</p>
            <div class="hidden group-hover:block">
              <p class="font-semibold">
                ¿Te esfuerzas por alcanzar las alturas profesionales?
              </p>
              <p class="font-semibold">
                Domina el inglés de negocios y utilizarás fácilmente en llamadas, grandes conferencias y durante negociaciones importantes.
              </p>
              <li>
                ¿Quieres aumentar tus ingresos actuales en un 30% o más usando el inglés?
              </li>
              <li>
                ¿Estás considerando trabajar en el mercado internacional?
              </li>
              <li>
                ¿Entiendes que el inglés te será útil para avanzar en tu carrera?
              </li>
              <li>
                Esfuércese por entablar relaciones comerciales fácilmente con extranjeros.
              </li>
            </div>
          </div>
        </div>
        <div class="border-solid border-2 bg-[#F7B81C]/20 rounded-[50px] p-4 w-2/4 mx-auto mt-4 group">
          <h3 class="text-[#323539] font-roboto text-2xl md:text-3xl lg:text-4xl font-semibold">¿Te gusta viajar y sueñas con comunicarte sin fronteras?</h3>
          <div class="hidden group-hover:block">
            <p class="font-semibold">
              ¿Te gusta viajar y sueñas con comunicarte sin fronteras?
            </p>
            <p>
              Te sentirás confiado y seguro en cualquier parte del mundo. La comunicación con los locales alcanzará un nuevo nivel.
            </p>
            <li>
              Intenta hablar con fluidez ante mil millones de personas en todo el mundo.
            </li>
            <li>
              Ya planeé varios viajes al extranjero.
            </li>
            <li>
              ¿Quieres comprar billetes y reservar hoteles en el extranjero fácilmente?
            </li>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center">
    <h2 class="text-[#323539] font-roboto text-4xl mb-12 md:text-6xl lg:text-[40px] font-semibold leading-tight">Escoge tu nivel para <span class="text-[#FBB715]">empezar</span></h2>
  </div>
  <div class="flex justify-center">
    <div class="mr-4">
        <ul @click="seleccionarNivel('a0')" :class="{'bg-[#F2FEBD]': nivelSeleccionado === 'a0', 'bg-[#FFFFFF]': nivelSeleccionado !== 'a0'}" class="rounded-[12px] mb-4 p-4 font-semibold">A0 (True Beginner)</ul>
        <ul @click="seleccionarNivel('a1')" :class="{'bg-[#F2FEBD]': nivelSeleccionado === 'a1', 'bg-[#FFFFFF]': nivelSeleccionado !== 'a1'}" class="rounded-[12px] mb-4 p-4 font-semibold">A1 (Beginner)</ul>
        <ul @click="seleccionarNivel('a2')" :class="{'bg-[#F2FEBD]': nivelSeleccionado === 'a2', 'bg-[#FFFFFF]': nivelSeleccionado !== 'a2'}" class="rounded-[12px] mb-4 p-4 font-semibold">A2 (Elementary)</ul>
        <ul @click="seleccionarNivel('b1')" :class="{'bg-[#F2FEBD]': nivelSeleccionado === 'b1', 'bg-[#FFFFFF]': nivelSeleccionado !== 'b1'}" class="rounded-[12px] mb-4 p-4 font-semibold">B1 (Pre-Intermediate)</ul>
        <ul @click="seleccionarNivel('b2')" :class="{'bg-[#F2FEBD]': nivelSeleccionado === 'b2', 'bg-[#FFFFFF]': nivelSeleccionado !== 'b2'}" class="rounded-[12px] p-4 font-semibold">B2 (Intermediate)</ul>
    </div>
    <div>
        <div v-show="nivelSeleccionado === 'a0'" id="a0" class="bg-[#F2FEBD] rounded-[12px] p-8 ">
            <p class="font-semibold mb-4 text-[28px]">Este es tu nivel si...</p>
            <li class="font-semibold">Nunca has aprendido inglés antes.</li>
            <li class="font-semibold">Sabes solo algunas frases básicas.</li>
            <li class="font-semibold">No entiendes el inglés conversado o escrito.</li>
            <li class="font-semibold mb-4">Es tu primera vez tomando clases de inglés.</li>
            <div class="bg-[#FFFFFF] rounded-[36px] p-4 w-12/12">
                <p class="font-semibold mb-4 text-[28px]">Después de terminar este nivel,</p>
                <li class="font-semibold">Comprenderás los conceptos básicos del idioma inglés.</li>
                <li class="font-semibold">Conocerás la gramática básica y entre 500 y 600 palabras.</li>
                <li class="font-semibold">Hablarás inglés con fluidez</li>
                <li class="font-semibold">Podrás comunicarte con frases simples en un número limitado de situaciones.</li>
            </div>
        </div>
        <div v-show="nivelSeleccionado === 'a1'" id="a1" class="bg-[#F2FEBD] rounded-[12px] p-8 ">
            <p class="font-semibold mb-4 text-[28px]">Este es tu nivel si...</p>
            <li class="font-semibold">Comprendes los conceptos básicos del idioma inglés.</li>
            <li class="font-semibold">Conoces la gramática básica y entre 500 y 600 palabras.</li>
            <li class="font-semibold">Puedes comunicarte con frases simples en un número limitado de situaciones.</li>
            <div class="bg-[#FFFFFF] rounded-[36px] p-4 w-12/12">
                <p class="font-semibold mb-4 text-[28px]">Después de terminar este nivel,</p>
                <li class="font-semibold">Ampliarás tu vocabulario.</li>
                <li class="font-semibold">Te familiarizarás con estructuras gramaticales más complejas.</li>
                <li class="font-semibold">Te sentirás más seguro comunicándote en inglés en diferentes situaciones.</li>
                <li class="font-semibold">Aprenderás unos cientos de palabras más.</li>
            </div>
        </div>
        <div v-show="nivelSeleccionado === 'a2'" id="a2" class="bg-[#F2FEBD] rounded-[12px] p-8 ">
            <p class="font-semibold mb-4 text-[28px]">Este es tu nivel si...</p>
            <li class="font-semibold">Comprendes frases básicas.</li>
            <li class="font-semibold">Puedes comunicarte en inglés en situaciones cotidianas.</li>
            <li class="font-semibold">Lees textos sencillos.</li>
            <li>Conoces y puedes utilizar varios tiempos verbales.</li>
            <li>Sabes alrededor de 1000 palabras.</li>
            <div class="bg-[#FFFFFF] rounded-[36px] p-4 w-12/12">
                <p class="font-semibold mb-4 text-[28px]">Después de terminar este nivel,</p>
                <li class="font-semibold">Aprenderás a hablar más libremente.</li>
                <li class="font-semibold">Te familiarizarás con estructuras gramaticales más complejas.</li>
                <li class="font-semibold">Te sentirás más seguro comunicándote en inglés en diferentes situaciones.</li>
                <li class="font-semibold">Aprenderás unos cientos de palabras más.</li>
            </div>
        </div>
    </div>
    <div v-show="nivelSeleccionado === 'b1'" id="b1" class="bg-[#F2FEBD] rounded-[12px] p-8 ">
        <p class="font-semibold mb-4 text-[28px]">Este es tu nivel si...</p>
        <li class="font-semibold">Te comunicas fácilmente sobre temas familiares.</li>
        <li class="font-semibold">Capaz de describir brevemente impresiones y eventos.</li>
        <li class="font-semibold">Puedes leer y escribir textos cortos.</li>
        <li>Sabes más de 2000 palabras.</li>
        <div class="bg-[#FFFFFF] rounded-[36px] p-4 w-12/12">
            <p class="font-semibold mb-4 text-[28px]">Después de terminar este nivel,</p>
            <li class="font-semibold">Aprenderás a comunicarte y construir oraciones coherentes incluso en situaciones inesperadas.</li>
            <li class="font-semibold">Comprenderás las ideas principales de textos complejos.</li>
            <li class="font-semibold">Comprenderás incluso los tiempos verbales difíciles en inglés.</li>
            <li class="font-semibold">Sabrás entre 3000 y 5000 palabras.</li>
        </div>
    </div>
    <div v-show="nivelSeleccionado === 'b2'" id="b2" class="bg-[#F2FEBD] rounded-[12px] p-8 ">
        <p class="font-semibold mb-4 text-[28px]">Este es tu nivel si...</p>
        <li class="font-semibold">Comprendes la esencia de textos complejos.</li>
        <li class="font-semibold">Te comunicas libremente incluso sobre temas abstractos.</li>
        <li class="font-semibold">Puedes improvisar en inglés.</li>
        <li>Miras películas y programas en inglés sin subtítulos.</li>
        <div class="bg-[#FFFFFF] rounded-[36px] p-4 w-12/12">
            <p class="font-semibold mb-4 text-[28px]">Después de terminar este nivel,</p>
            <li class="font-semibold">Podrás expresar tus pensamientos de varias maneras a la vez.</li>
            <li class="font-semibold">Comprenderás textos complejos por completo, hasta el más mínimo detalle.</li>
            <li class="font-semibold">Empezarás a comunicarte fácilmente en inglés en el trabajo.</li>
            <li class="font-semibold">Sabrás más de 5000 palabras.</li>
        </div>
    </div>
  </div>

  <div class="bg-[#7660D3] p-8 mt-12">
    <h3 class="text-[#FFFFFF] font-roboto mb-4 text-4xl md:text-6xl lg:text-[40px] font-semibold leading-tight">Lo que te espera en el curso</h3>
    <div class="pl-16">
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Lecciones interesantes respaldadas por guías en video</p>
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Numerosas prácticas de conversación</p>
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Abundante práctica y ejercicios</p>
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Acceso gratuito a actualizaciones del curso</p>
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Segimiento constante de tu progreso y retroalimentación</p>
      <p class="text-[#323539] border-solid border-2 mb-4 bg-[#D7C0F4] rounded-[12px] p-4 font-roboto text-2xl md:text-3xl lg:text-[20px] font-semibold">Bot conversacional ChatGPT</p>
    </div>
  </div>

  <div class="flex justify-center mt-12">
    <h2 class="text-center text-[#000000] font-roboto text-4xl mb-12 md:text-6xl lg:text-[40px] font-semibold leading-tight">El curso desarrollado por los mejores expertos con experiencias colosales en <span class="text-[#FBB715]">sector de enseñanza</span></h2>
  </div>

  <div class="flex justify-center">
    <div>
      <div class="flex bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
        <img src="" alt="img">
        <div>
          <p>Name Surname</p>
          <p>The description</p>
          <p>Their experience</p>
          <p>some recent</p>
        </div>
      </div>
      <div class="flex bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
        <img src="" alt="img">
        <div>
          <p>Name Surname</p>
          <p>The description</p>
          <p>Their experience</p>
          <p>some recent</p>
        </div>
      </div>
    </div>
    <div>
      <div class="flex bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
       <img src="" alt="img">
       <div>
        <p>Name Surname</p>
        <p>The description</p>
        <p>Their experience</p>
        <p>some recent</p>
       </div>
      </div>
      <div class="flex bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
       <img src="" alt="img">
       <div>
        <p>Name Surname</p>
        <p>The description</p>
        <p>Their experience</p>
        <p>some recent</p>
       </div>
      </div>
    </div>
  </div>

  <div>
    <h3 class="text-center text-[#000000] font-roboto text-4xl mt-12 mb-12 md:text-6xl lg:text-[40px] font-semibold leading-tight">Reseñas y resultados de <span class="text-[#FBB715]">nuestros alumnos.</span></h3>

  </div>

  <div class="flex gap-4 m-12">
    <div class="bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
      <div class="flex gap-4 mb-4 justify-between">
        <img src="" alt="img">
        <div class="flex flex-col">
          <p>2 Febrero 2025</p>
          <p>General english</p>
        </div>
        <div >
          <p>5.0</p>
          <span class="material-icons">star</span>
        </div>
      </div>
      <div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere reprehenderit natus, illum praesentium deleniti esse laborum repudiandae doloribus dicta, quam dolorem aspernatur commodi quos, distinctio placeat aliquid expedita explicabo nulla reiciendis animi quis? Est quis magni rem, facere quidem, maxime nostrum, cum tempore fuga minus delectus aliquid omnis excepturi officia?</p>
      </div>
    </div>
    <div class="bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
      <div class="flex gap-4 mb-4 justify-between">
        <img src="" alt="img">
        <div class="flex flex-col">
          <p>2 Febrero 2025</p>
          <p>General english</p>
        </div>
        <div >
          <p>5.0</p>
          <span class="material-icons">star</span>
        </div>
      </div>
      <div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere reprehenderit natus, illum praesentium deleniti esse laborum repudiandae doloribus dicta, quam dolorem aspernatur commodi quos, distinctio placeat aliquid expedita explicabo nulla reiciendis animi quis? Est quis magni rem, facere quidem, maxime nostrum, cum tempore fuga minus delectus aliquid omnis excepturi officia?</p>
      </div>
    </div>
    <div class="bg-[#D9D9D9] border-solid border-2 rounded-[12px] p-4">
      <div class="flex gap-4 mb-4 justify-between">
        <img src="" alt="img">
        <div class="flex flex-col">
          <p>2 Febrero 2025</p>
          <p>General english</p>
        </div>
        <div >
          <p>5.0</p>
          <span class="material-icons">star</span>
        </div>
      </div>
      <div>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Facere reprehenderit natus, illum praesentium deleniti esse laborum repudiandae doloribus dicta, quam dolorem aspernatur commodi quos, distinctio placeat aliquid expedita explicabo nulla reiciendis animi quis? Est quis magni rem, facere quidem, maxime nostrum, cum tempore fuga minus delectus aliquid omnis excepturi officia?</p>
      </div>
    </div>
  </div>

  <RegisterForm />

  <div class="flex bg-[#7660D3] p-8 mt-12 mb-12 w-10/12 mx-auto rounded-[80px]">
    <div class="w-3/5">
      <h3 class="text-[#FFFFFF] font-roboto text-3xl mb-4 md:text-4xl lg:text-[30px] font-semibold leading-tight">¿Quieres recibir ofertas y actualizaciones?</h3>
      <p class="text-[#FFFFFF] font-roboto text-[16px] mb-4 font-semibold">Suscríbete a nuestra newsletter para recibir las últimas noticias y actualizaciones</p>
    </div>
    <div class="w-2/5 bg-[#FFFFFF] rounded-[50px] p-2 flex justify-center items-center">
      <input type="text" placeholder="Tu correo electrónico" class="h-10">
      <button class="bg-[#7660D3] rounded-[40px] p-2 text-[#FFFFFF] font-roboto text-[16px] md:text-[16px] lg:text-[16px] font-medium" style="height: 40px; width: 100px;">ENVIAR</button>
    </div>
  </div>

  <div class="bg-[#0A394D] p-8 mt-12 mb-12 pl-48 pr-48 mx-auto">
    <h3 class="text-[#FFFFFF] font-roboto text-3xl mb-4 md:text-4xl lg:text-[30px] font-semibold leading-tight">The values that hold us <br> true and to acoount</h3>
    <div class="flex justify-between mb-8 mt-8 ml-2">
      <span class="bg-[#FFFFFF] rounded-[12px] mb-4 p-0" style="height: 40px; width: 40px; display: inline-block;"></span>
      <span class="bg-[#FFFFFF] rounded-[12px] mb-4 p-0" style="height: 40px; width: 40px; display: inline-block;"></span>
      <span class="bg-[#FFFFFF] rounded-[12px] mb-4 p-0" style="height: 40px; width: 40px; display: inline-block;"></span>
      <span class="bg-[#0A394D] rounded-[12px] mb-4 p-0" style="height: 40px; width: 40px; display: inline-block;"></span>
    </div>
    <div class="flex bg-[#7660D3] rounded-[12px] justify-between p-4">
      <div>
        <p class="text-[#FFFFFF] font-roboto text-xl mb-4 md:text-2xl lg:text-[20px] font-semibold">únase a miles de estudiantes felices</p>
        <p>Suscribete a nuestra newsletter y recibe las últimas noticias y actualizaciones</p>
      </div>
      <div class="flex flex-col items-end gap-4">
        <input type="text" placeholder="Tu correo electrónico" class="h-10 bg-[#FFFFFF] text-[#5A5D60] rounded-[16px] p-2 shadow-md">
        <button class="bg-[#FBB715] rounded-[16px] p-2 pr-4 pl-4 text-[#FFFFFF] font-roboto text-[16px] md:text-[16px] lg:text-[16px] font-semibold shadow-md" style="height: 40px;">Suscribirse</button>
      </div>
    </div>
    <div class="flex justify-between text-[#FFFFFF] mt-16">
        <div>
          <p>© 2025</p>
        </div>
        <div>
          <p class="font-semibold mb-4">Company</p>
          <p>About us</p>
          <p>Contact us</p>
          <p>Careers</p>
        </div>
        <div>
          <p class="font-semibold mb-4">Futher info</p>
          <p>Terms & Conditions</p>
          <p>Privacy Policy</p>
          <p>Methodology</p>
        </div>
        <div>
          <p class="font-semibold mb-4">Coustomers</p>
          <p>Buyer</p>
          <p>Supplier</p>
        </div>
        <div>
          <p class="font-semibold mb-4">Follow us</p>
        </div>
        <div></div>
      </div>
   
  </div>
  <div class="bg-[#000000] mt-12 mb-12 flex justify-center">
    <p class="text-[#FFFFFF] font-roboto text-xl mb-4 mt-4 md:text-2xl lg:text-[20px] font-medium">All rights reserved. PolyAcademy © 2025 </p>
  </div>

  <div class="mt-50">
    <a0 />
  </div>

  <PaidForm />
</template>

<script>
import RegisterForm from '../layouts/landing/register_form.vue'
import a0 from '~/layouts/landing/a0.vue';
import PaidForm from '~/layouts/landing/paidform.vue';

export default {
  components: {
    RegisterForm,
    a0,
    PaidForm,
  },
  data() {
    return {
      nivelSeleccionado: 'a0', // Nivel por defecto
    };
  },
  methods: {
    seleccionarNivel(nivel) {
      this.nivelSeleccionado = nivel;
    },
  },
};
</script>

