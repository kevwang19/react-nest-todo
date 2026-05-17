import type { TodoStatus } from '../entities/todo.entity';
export declare class CreateTodoDto {
    title: string;
    status?: TodoStatus;
}
