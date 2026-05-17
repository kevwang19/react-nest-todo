import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
  } from 'typeorm';
  
  export type TodoStatus = 'pending' | 'in_progress' | 'completed';
  
  @Entity('todos')
  export class Todo {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 200 })
    title: string;
  
    @Column({ type: 'varchar', length: 20, default: 'pending' })
    status: TodoStatus;
  
    @CreateDateColumn({ name: 'created_at' })
    created_at: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: Date;
  }