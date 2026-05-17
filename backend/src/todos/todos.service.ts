import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todosRepo: Repository<Todo>,
  ) {}

  create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todosRepo.create({
      title: createTodoDto.title,
      status: createTodoDto.status ?? 'pending',
    });
    return this.todosRepo.save(todo);
  }

  findAll(): Promise<Todo[]> {
    return this.todosRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    const todo = await this.todosRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.todosRepo.save(todo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.todosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
  }
}