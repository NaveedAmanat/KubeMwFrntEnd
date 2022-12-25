export class Pdc {
  public pdcHdrSeq: number;
  public loanAppSeq: number;
  public bankNm: string; // bankName
  public brnchNm: string; // branch
  public acctNum: string; // accountNumber
  public mwPdcDtlDTOs: MwPdcDtlDTOs[];
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export class MwPdcDtlDTOs {
  public pdcHdrSeq: number;
  public pdcDtlSeq: number;
  public pdcId: number; // id
  public collDt: string; // collectionDate
  public cheqNum: number; // checkNumber
  public amt: number; // amount
  public delFlg = false;
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
