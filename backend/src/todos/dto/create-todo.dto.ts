import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import type { TodoStatus } from '../entities/todo.entity';

const STATUSES: TodoStatus[] = ['pending', 'in_progress', 'completed'];

export class CreateTodoDto {
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: TodoStatus;
}