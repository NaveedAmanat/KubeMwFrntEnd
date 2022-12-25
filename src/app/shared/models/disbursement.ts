export class Disbursement {
  public loanAppSeq: number;
  public loanId: string; // loanNumber
  public cycleNumber: string;
  public clientId: number; // clntId
  public clientName: string; // frstNm + lastNm
  // public branch: string;
  public portfolioId: number;
  public appDate: string;
  public approvalDate: string;
  public aprvdLoanAmt: number; // amount
  public product: string;
  public isChecked = false;
  crtdDt;
  lastUpdDt;
  portSeq;

}

export class PaymentMode {
  public typSeq: number;
  public typStr: string;
}
