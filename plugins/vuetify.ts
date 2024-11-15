// plugins/vuetify.ts
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { defineNuxtPlugin } from "#app";
import "vuetify/styles"; // Importa los estilos de Vuetify

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: "light", 
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
