
export class DisbursementVoucher {
  public loanAppId : string;
  public loanCyclNum: string;  // cycleNumber
  public firstName : string;
  public lastName: string;
  public clientId : string;

  public portSeq : number;
  public portNm : string;
  public brnchSeq : number;
  public brnchNm: string;
  
  public prdNm: string;
  public prdSeq : number;
  public prdGrpSeq: number;
  public aprvdLoanAmt : number;
  public frstInstDt : string;
  public bizActyNm : string;
  public bizSectNm : string;
  public bdoNm : string;
  public totRecv : number;
  public scheduleId:number;
  public preActivity:string;


  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
