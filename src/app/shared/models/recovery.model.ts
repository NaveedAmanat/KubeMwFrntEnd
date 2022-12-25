import { RecoverySub } from './recovery.subModel';
import { Deserializable } from './deserializable.model';

export class Recovery {
  jvId(jvId: any): any {
    throw new Error("Method not implemented.");
  }
  //public oldClntId: number;
  public clntSeq: number;
  public clntId: string;
  public frstNm: string;
  public lastNm: string;
  public bdo: string;
  public prd: string;
  public totalDue: number;
  public totalRecv: number;
  public nextDue;
  public status:string;
  public prntLoanAppSeq: string;
  public recoverySub: RecoverySub[] = [];

  constructor(obj?: any) {
    //  Object.assign(this, obj);
    //this.recoverySub = [];
  }
  // deserialize(input: any) {
  //   Object.assign(this, input);
  //   this.recoverySub = new RecoverySub().deserialize(input.recoverySub);
  //   return this;
  // }
}

export interface ApplyPayment {
  clientId: string;
  typeId: number;
  instr: number;
  pymtDt: string;
  pymtAmt: string;
  post: boolean;
}

export interface AdjustPayment {
  trxId: string;
  pymtAmt: string;
  chngRsnKey: number;
  chngRsnCmnt:string;
}

export interface JVoucher {
  id: number;
  date: number;
  description: string;
  type: string;
  entitySeq: number;
}

export interface JVoucherDetials {
  ledId: number;
  desc: string;
  dbt: boolean;
  crdt: boolean;
}


export interface AttendanceCheckIn {
  empSeq: number;
  time: any;
  clndrDt: any;
}


export interface AttendanceCheckOut {
  empAtndSeq: number;
  time: any;
  clndrDt: any;
}
