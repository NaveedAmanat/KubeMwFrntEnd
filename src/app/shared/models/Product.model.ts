
export class Product {
  prdSeq: number;
  prdGrpSeq: number;
  prdId;
  prdNm: string;
  prdCmnt: string;
  prdStsKey: number;
  prdTypKey: number;
  irrFlg: number;
  rndngScl: number;
  rndngAdj: number;
  dailyAccuralFlg: boolean;
  fndByKey: number;
  crncyCdKey: number;
  irrVal: number;
  mltLoanFlg: boolean = false;
  productSeq: number;
  productName: string;
  businessSector: number;
  isChecked = false;
  asocPrdRelSeq;
  modal1;
  modal2;
  pdcNum;
  constructor(obj?: any) {
    this.dailyAccuralFlg = false;
    Object.assign(this, obj);
    this.productSeq = this.prdSeq;
    this.productName = this.prdNm;
  }
}

