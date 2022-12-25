export class FormAssignment {
  formSeq: number;
  formId: string;
  formNm: string;
  formUrl: string;
  formCls: null;
  formStsKey: null;
  ischecked: boolean;
  prdFormRelSeq: number;
  formSortOrdr;
  isSaved;
  constructor() {
  }
}
export class FormAssignmentBody {
  formSeq: number;
  prdSeq: number;
  prdFormRelSeq;
  formSortOrdr;
}

export class AccountingSetup {
  prdAcctSetSeq: number;
  acctCtgryKey: number;
  glAcctNum: string;
  prdSeq: number;
  // 255,256
}

export class AdjustmnentSequence {
  prdChrgAdjOrdrSeq: number;
  adjOrdr: number;
  prdSeq: number;
  prdChrgSeq: number; // typSeq
}

export class BusinessSector {
  prdSeq: number;
  bizSectSeq: number;
  bizSectId: number;
  bizSectNm: string;
  bizSectStsKey: number;
  ischecked: boolean;
  prdBizSectRelSeq: number;
}

export class ProductDocuments {
  docSeq: number;
  docId: number;
  docNm: number;
  docCtgryKey: number;
  docTypKey: number;
  ischecked: boolean;
  prdDocRelSeq: number;
  prdSeq: number;
  mndtryFlg:boolean = false;
}

export class AsocProduct{
  asocPrdRelSeq;
  prdSeq;
  asocPrdSeq;
}
