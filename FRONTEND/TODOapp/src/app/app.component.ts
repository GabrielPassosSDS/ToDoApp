import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TODOapp';

  arrayDeTarefas = signal<Tarefa[]>([]);

  apiURL: string;
  usuarioLogado = signal(false);
  tokenJWT = '{ "token":""}';

  constructor(private http: HttpClient) {
    this.apiURL = 'https://apitarefasgabriel255751.onrender.com';
    this.READ_tarefas();
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
 var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
 this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa).subscribe(
 resultado => { console.log(resultado); this.READ_tarefas(); });
}

READ_tarefas() {
const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
(resultado) => { this.arrayDeTarefas.set(resultado); this.usuarioLogado.set(true) },
(error) => { this.usuarioLogado.set(false) }
)
}

 DELETE_tarefa(tarefaAserRemovida: Tarefa) {
 var indice = this.arrayDeTarefas().indexOf(tarefaAserRemovida);
 var id = this.arrayDeTarefas()[indice]._id;
 this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`).subscribe(
 resultado => { console.log(resultado); this.READ_tarefas(); });
 }

 UPDATE_tarefa(tarefaAserModificada: Tarefa) {
 var indice = this.arrayDeTarefas().indexOf(tarefaAserModificada);
 var id = this.arrayDeTarefas()[indice]._id;
 this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`,
 tarefaAserModificada).subscribe(
 resultado => { console.log(resultado); this.READ_tarefas(); });
 }

login(username: string, password: string) {
  const credenciais = { "nome": username, "senha": password };
  
  this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe({
    next: (resultado: any) => {
      console.log('Token recebido:', resultado); // Adicione este log para testar
      this.tokenJWT = JSON.stringify(resultado);
      this.READ_tarefas(); // Chama a função que lista as tarefas e muda o login para true
    },
    error: (err) => {
      console.error('Erro no login:', err);
      alert('Usuário ou senha inválidos!');
    }
  });
}

}

