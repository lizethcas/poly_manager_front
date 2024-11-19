import { defineStore } from 'pinia';
import ApiService from '../services/create.multiplechoicetask.api';

interface MultipleChoiceData {
    layout: number;
    instructions: string;
    question: string;
    answers: Array<{text: string, is_correct: boolean}>;
    order: number;
}

export const useMultipleChoiceStore = defineStore('multipleChoice', {
    state: () => ({
        multipleChoiceQuestions: [] as MultipleChoiceData[],
        currentQuestion: null as MultipleChoiceData | null,
        loading: false,
        error: null as string | null,
    }),

    actions: {
        async createMultipleChoice(formData: MultipleChoiceData) {
            try {
                this.loading = true;
                const response = await ApiService.createMultipleChoice(formData);
                this.multipleChoiceQuestions.push(response as MultipleChoiceData);
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getAllMultipleChoice() {
            try {
                this.loading = true;
                const response = await ApiService.getAllMultipleChoice();
                this.multipleChoiceQuestions = response as MultipleChoiceData[];
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getMultipleChoiceById(id: number) {
            try {
                this.loading = true;
                const response = await ApiService.getMultipleChoiceById(id);
                this.currentQuestion = response as MultipleChoiceData;
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateMultipleChoice(id: number, formData: MultipleChoiceData) {
            try {
                this.loading = true;
                const response = await ApiService.updateMultipleChoice(id, formData);
                const index = this.multipleChoiceQuestions.findIndex(q => q.layout === id);
                if (index !== -1) {
                    this.multipleChoiceQuestions[index] = response as MultipleChoiceData;
                }
                return response;
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteMultipleChoice(id: number) {
            try {
                this.loading = true;
                await ApiService.deleteMultipleChoice(id);
                this.multipleChoiceQuestions = this.multipleChoiceQuestions.filter(
                    q => q.layout !== id
                );
            } catch (error: any) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
