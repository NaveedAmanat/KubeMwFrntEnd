import {Deserializable} from './deserializable.model';

export class RecoverySub {
  public paySchedDtlSeq: number;
  public instNum: number;
  public ppalAmtDue: number;
  public totChrgDue: number; // charge due
  public dueDt:string;
  public sts: string;
  public pymtAmt: string;
  public pymtDt: string;
  public rcvryTyp: string;
  public brnchSeq: number;
  public instr: string;
  public trxSeq: string;
  public post:string;
  public trxPymt:string;
  public pymtType:string;
  public prd:string;
  constructor(obj?: any) {
   // Object.assign(this, JSON.parse(JSON.stringify(obj)));
    // this = JSON.parse(JSON.stringify(obj))
   //  this.totalDueAmount = this.ppalAmtDue + this.totChrgDue;
  }
}


