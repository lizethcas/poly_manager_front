export interface MultipleChoiceData {
    layout: number;
    instructions: string;
    question: string;
    answers: Array<{text: string, is_correct: boolean}>;
    order: number;
}