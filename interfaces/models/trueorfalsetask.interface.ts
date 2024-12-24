export interface TrueOrFalseData {
    layout: number;
    instructions: string;
    questions: {
        questions: Array<{
            statement: string;
            state: 1 | 2 | 3;
        }>;
    };
    order: number;
}