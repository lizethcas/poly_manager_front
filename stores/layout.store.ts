import { defineStore } from 'pinia';
import ApiService from '../services/create.layout.api';
import { URL_API } from '../services/api';

interface LayoutData {
  id?: number;
  lesson: number;
  title: string;
  instructions: string;
  img_cover: File | null;
  audio: File | null;
  audio_script: string;
}

interface LayoutState {
    layouts: LayoutData[];
    currentLayout: LayoutData | null;
    loading: boolean;
    error: string | null;
  }

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    layouts: [],
    currentLayout: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createLayout(formData: LayoutData) {
      try {
        this.loading = true;
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && key !== 'id') {
            form.append(key, value);
          }
        });
        
        const response = await ApiService.createLayout(form);
        this.layouts.push(response.data);
        return response.data;
      } catch (error) {
        this.error = 'Error al crear el layout';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchAllLayouts() {
      try {
        this.loading = true;
        const response = await ApiService.getAllLayouts();
        this.layouts = response as LayoutData[];
        return response;
      } catch (error) {
        this.error = 'Error al obtener los layouts';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchLayoutById(id: number) {
      try {
        this.loading = true;
        const response = await ApiService.getLayoutById(id);
        this.currentLayout = response as LayoutData;
        return response;
      } catch (error) {
        this.error = 'Error al obtener el layout';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateLayout(id: number, formData: LayoutData) {
      try {
        this.loading = true;
        const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null) {
            form.append(key, value);
          }
        });
        
        const response = await ApiService.updateLayout(id, formData as LayoutData);
        const index = this.layouts.findIndex(layout => layout.id === id);
        if (index !== -1) {
          this.layouts[index] = response as LayoutData;
        }
        return response;
      } catch (error) {
        this.error = 'Error al actualizar el layout';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteLayout(id: number) {
      try {
        this.loading = true;
        await ApiService.deleteLayout(id);
        this.layouts = this.layouts.filter(layout => layout.id !== id);
      } catch (error) {
        this.error = 'Error al eliminar el layout';
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },

  getters: {
    getLayouts: (state) => state.layouts,
    getCurrentLayout: (state) => state.currentLayout,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
