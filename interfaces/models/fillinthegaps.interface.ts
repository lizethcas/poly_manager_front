export interface FillInTheGapsData {
    layout: number;
    instructions: string;
    text: string;
    gaps: Array<{
        word: string,
        position: number
    }>;
    order: number;
}