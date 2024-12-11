import { reactive } from 'vue';

const EventBus = reactive({
  emit: (event: string, data: any) => {
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  on: (event: string, callback: (data: any) => void) => {
    document.addEventListener(event, (e) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    });
  }
});

export default EventBus;