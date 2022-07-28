import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public $currentCredencial: BehaviorSubject<firebase.auth.AuthCredential> = new BehaviorSubject(null);
  public $currentCredencialData: BehaviorSubject<firebase.User> = new BehaviorSubject(null);
  constructor() { }
}
