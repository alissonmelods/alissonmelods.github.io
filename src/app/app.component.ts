import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  todos: Todo[] = [];
  form: FormGroup = new FormGroup({
    description : new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  constructor (
    private service: TodoService
  ) {}

  ngOnInit() {
    this.listarTodos();
  }

  listarTodos() {
    this.service.listar().subscribe(todoList => {
      this.todos = todoList
    });
  }

  submit() {
    const todo: Todo = { ...this.form.value };
    this.service
        .salvar(todo)
        .subscribe(savedTodo => {
          this.todos.push(savedTodo)
          this.form.reset()
        });
  }

  delete(todo: Todo) {
    const id = todo.id === undefined ? 1 : todo.id;
    this.service.deletar(id).subscribe({
      next: (response) => this.listarTodos()
    })
  }

  done(todo: Todo) {
    const id = todo.id === undefined ? 1 : todo.id;
    this.service.marcarComoConcluido(id).subscribe({
      next: (todoAtualizado) => {
        todo.done = todoAtualizado.done
        todo.doneDate = todoAtualizado.doneDate
      }
    })
  }
}
