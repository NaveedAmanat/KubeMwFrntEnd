import {AssignCheck} from './assignCheck.model';

export class PaymentSchedule {
  public paySchedDtlSeq: number;
  public scheduleId: number; // scheduleId
  public instNum: number; // instalmentNumber
  public dueDt: string; // dueDate
  public ppalAmtDue: number; // principalAmountDue
  public totChrgDue: number; // chargedAmountDue
  public totalAmountDue: number; // totalAmoutnDue
  public assignCheck: AssignCheck[];
  constructor(obj?: any) {
    Object.assign(this, obj);
    this.totalAmountDue = this.ppalAmtDue + this.totChrgDue;
  }
}




















