export class PrincipleAmount {
  prdPpalLmtSeq: number;
  minAmt: number;
  maxAmt: number;
  prdSeq: number;
  rulSeq: number;
  sgrtInstNum: number;
}


export class LoanTerms {
  prdLoanTrmSeq: number;
  prdTrmSeq: number;
  trmKey: number;
  pymtFreqKey: number;
  prdSeq: number;
  rulSeq: number;
}

export class Segregate {
  prdSgrtInstSeq: number;
  sgrtEntySeq: number; // ppamount seq
  entyTypStr: string; // 'princip' 'c'
  instNum: number;
  ischecked: boolean;
  prdSeq;
}

export class SegregateBody {
  instNum: number ;
  ischecked: boolean;
  prdPpalLmtSeq: number;
  prdSgrtInstSeq: number;
  sgrtEntySeq;
}
