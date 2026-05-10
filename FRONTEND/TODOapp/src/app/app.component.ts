import { Component, signal } from '@angular/core';
import { Tarefa } from "./tarefa";
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    // Removido o READ_tarefas daqui para não tentar carregar antes do login
  }

  CREATE_tarefa(descricaoNovaTarefa: string) {
    var novaTarefa = new Tarefa(descricaoNovaTarefa, false);
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.post<Tarefa>(`${this.apiURL}/api/post`, novaTarefa, { 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
  }

  READ_tarefas() {
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.get<Tarefa[]>(`${this.apiURL}/api/getAll`, { 'headers': idToken }).subscribe(
      (resultado) => { 
        this.arrayDeTarefas.set(resultado); 
        this.usuarioLogado.set(true); 
      },
      (error) => { 
        this.usuarioLogado.set(false); 
      }
    )
  }

  DELETE_tarefa(tarefaAserRemovida: Tarefa) {
    var id = tarefaAserRemovida._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.delete<Tarefa>(`${this.apiURL}/api/delete/${id}`, { 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
  }

  UPDATE_tarefa(tarefaAserModificada: Tarefa) {
    var id = tarefaAserModificada._id;
    const idToken = new HttpHeaders().set("id-token", JSON.parse(this.tokenJWT).token);
    this.http.patch<Tarefa>(`${this.apiURL}/api/update/${id}`, tarefaAserModificada, { 'headers': idToken }).subscribe(
      resultado => { console.log(resultado); this.READ_tarefas(); });
  }

  login(username: string, password: string) {
    var credenciais = { "nome": username, "senha": password }
    this.http.post(`${this.apiURL}/api/login`, credenciais).subscribe(resultado => {
      this.tokenJWT = JSON.stringify(resultado);
      this.READ_tarefas();
    });
  }
}
