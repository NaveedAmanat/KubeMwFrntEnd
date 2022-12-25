import { User } from "./User.model";
import { Screen } from "./Screen.model";

export class Auth {
  public user: User;
  public emp_portfolio: string;
  public id_token: string;
  public screens: Screen[] = [];
  public role;
  public emp_branch;
  public emp_area;
  public emp_reg;
  public loginId;
  public modules = [];
  public emp_name: string;
  public manage: {}

  constructor(
  ) {
    this.id_token = "";
  }
}
