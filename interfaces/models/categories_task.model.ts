export interface CategoriesTaskData {
    layout: number;
    instructions: string;
    categories: Array<{
        name: string,
        items: Array<string>
    }>;
    order: number;
}