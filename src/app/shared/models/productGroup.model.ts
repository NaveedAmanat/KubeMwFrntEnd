export class ProductGroup {
  prdGrpSeq: number;
  prdGrpId: number;
  prdGrpNm: string;
  prdGrpSts: number;

  crtdBy: string;
  crtdDt: string;
  lastUpdBy: string;
  lastUpdDt: string;
  delFlg: boolean;
  effStartDt: string;
  effEndDt: string;
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
