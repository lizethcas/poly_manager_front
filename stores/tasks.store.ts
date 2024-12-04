import { defineStore } from 'pinia';
import type { Question } from '~/interfaces/components/props.components.interface';

export const useTasksStore = defineStore('tasks', {
    state: () => ({
        questions: [] as Question[]
    }),

    actions: {
        saveTask(value: string) {
            this.questions = [...this.questions, ...JSON.parse(value) as Question[]]
            console.log('saveTask', toRaw(this.questions))
        },

        updateTasks(value: string) {
            this.questions = JSON.parse(value) as Question[]
            console.log('updateTasks', toRaw(this.questions))
        }
    }
})