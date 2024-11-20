import { defineStore } from 'pinia';
import ApiService from '../services/create.textblockmodel.api';

interface TextBlock {
    id?: number;
    lesson: number;
    title: string;
    instructions: string;
    content: string;
}

export const useTextBlockStore = defineStore('textblock', {
    state: () => ({
        textBlocks: [] as TextBlock[],
        currentTextBlock: null as TextBlock | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async createTextBlock(textBlockData: TextBlock) {
            try {
                this.loading = true;
                const response = await ApiService.createTextBlock(textBlockData);
                this.textBlocks.push(response as TextBlock);
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllTextBlocks() {
            try {
                this.loading = true;
                const response = await ApiService.getAllTextBlocks();
                this.textBlocks = response as TextBlock[];
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchTextBlockById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getTextBlockById(id);
                this.currentTextBlock = response as TextBlock;
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateTextBlock(id: number, textBlockData: TextBlock) {
            try {
                this.loading = true;
                const response = await ApiService.updateTextBlock(id, textBlockData);
                const index = this.textBlocks.findIndex(block => block.id === id);
                if (index !== -1) {
                    this.textBlocks[index] = response as TextBlock;
                }
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteTextBlock(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteTextBlock(id);
                this.textBlocks = this.textBlocks.filter(block => block.id !== id);
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
