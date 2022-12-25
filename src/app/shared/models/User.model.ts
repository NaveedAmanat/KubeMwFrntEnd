import {FormAssignment} from './FormAssignment.model';
import {DocumentAssignment} from './documentAssignment.model';

export class User {
  public id: number;
  public name: string;
  public username: string;
  public password: string;
  public role: string;
  public id_token: string;
  public formAssignment: FormAssignment;
  public documentAssignment: DocumentAssignment;
  constructor(
  ) {
    this.id = 0;
    this.name = '';
    this.username = "";
    this.password = '';
    this.role = '';
    this.id_token = "";
    this.formAssignment = new FormAssignment();
    this.documentAssignment = new DocumentAssignment();
    }

    public toStringProduct(): string {
      return 'Name: ' + this.name + 'password: ' + this.password +
              'role: ' + this.role ;
    }
}
