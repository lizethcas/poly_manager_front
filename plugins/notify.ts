import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default defineNuxtPlugin((nuxtApp) => {
  // Only initialize Notyf on client-side
  if (process.client) {
    const notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' },
      ripple: true,
    });

    // Provide notyf only on client-side
    nuxtApp.provide('notyf', notyf);
  }
});
