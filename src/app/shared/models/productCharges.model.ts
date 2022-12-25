export class ProductCharges {
  prdChrgSeq: number;
  prdSeq: number;
  rulSeq: number;
  chrgCalcTypKey: number;
  chrgTypSeq: number; // req
  chrgVal: number; // req
  upfrontFlg: boolean; // req
  sgrtInstNum: number; // req
  adjustRoundingFlg: boolean; // req
  chargeName: string; // req
}
