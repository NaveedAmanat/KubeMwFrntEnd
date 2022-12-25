export class vehicleLoan {

   public clntId: string;
   public clntSeq: string;
   public loanAppSeq: string;
   public aprvdAmt: string;
   public cyclNum: string;
   public clntName: string;
   public dsbmtDt: string;
   public prdSeq: string;
   public prdNm: string;
   public prdDscr: string;
   public insurdAmt: number;
   public ownerNm: string;
   public vhcleRegtrnNo: string;
   public refCdVhclMakerSeq: number;
   public vhcleModelYr: string;
   public engnePwrCc: number;
   public engneNo: string;
   public chassisNO: string;
   public prchseDt: string;
   public vhcleSeq: string;
   public vhcleColor: number;
   public brnchNm: string;
   public brnchDscr: string;
   public areaNm: string;
   public areaDscr: string;
   public regNm: string;
   public regDscr: string;

   constructor(modelVals: any, insuredAmt : number) {
      this.clntId = modelVals.clntId;
      this.clntSeq = modelVals.clientSeq;
      this.loanAppSeq = modelVals.loanAppSeq;
      this.aprvdAmt = modelVals.approvedAmount;
      this.cyclNum = modelVals.loanCyclNum;
      this.clntName = modelVals.firstName || ' ' || modelVals.lastName;
      this.dsbmtDt = modelVals.dsbmtDt;
      this.prdSeq =  modelVals.loanProd;
      this.prdNm = modelVals.loanProdDesc;
      this.prdDscr = modelVals.loanProdDesc;
      this.insurdAmt = insuredAmt;
      this.ownerNm = 'NA';
      this.vhcleRegtrnNo = 'NA';
      this.refCdVhclMakerSeq = -1;
      this.vhcleModelYr = 'NA';
      this.engnePwrCc = -1;
      this.engneNo = 'NA';
      this.chassisNO = 'NA';
      this.prchseDt = '01-01-2020';
      this.vhcleColor = -1;
      this.brnchNm = modelVals.branchName;
      this.brnchDscr = modelVals.branchName;
      this.areaNm = modelVals.area;
      this.areaDscr = modelVals.area;
      this.regNm = modelVals.region;
      this.regDscr = modelVals.region;
   }
}
