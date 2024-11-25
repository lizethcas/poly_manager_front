export interface OrderingTaskData {
    layout: number;
    instructions: string;
    items: Array<{text: string, order: number}>;
    order: number;
}