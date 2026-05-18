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

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    console.log('[TodosService] create', createTodoDto);
    const todo = this.todosRepo.create({
      title: createTodoDto.title,
      status: createTodoDto.status ?? 'pending',
    });
    return await this.todosRepo.save(todo);
  }

  async findAll(): Promise<Todo[]> {
    console.log('[TodosService] findAll');
    return await this.todosRepo.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Todo> {
    console.log('[TodosService] findOne', { id });
    const todo = await this.todosRepo.findOneBy({ id });
    if (!todo) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    console.log('[TodosService] update', { id, updateTodoDto });
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return await this.todosRepo.save(todo);
  }

  async remove(id: number): Promise<void> {
    console.log('[TodosService] remove', { id });
    const result = await this.todosRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Todo #${id} not found`);
    }
  }
}