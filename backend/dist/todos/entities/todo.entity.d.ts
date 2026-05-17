export type TodoStatus = 'pending' | 'in_progress' | 'completed';
export declare class Todo {
    id: number;
    title: string;
    status: TodoStatus;
    created_at: Date;
    updated_at: Date;
}
