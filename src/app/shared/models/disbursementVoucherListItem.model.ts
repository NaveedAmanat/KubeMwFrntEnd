export class DisbursementVoucherListItem {
  public loanAppSeq: number;
  public dsbmtDtlKey: number;
  public pymtTypSeq: any;
  public instrNum: number;
  public amt: number;
  public dsbmtHdrSeq: number;
  public delFlg = false;
  // modified By Naveed - Date - 23-01-2022
  // SCR Mobile Wallet Control
  public mobWalChnl: any;
  public mobWalNum: any;
  public mobInvalid: any
  // Ended By Naveed - Date - 23-01-2022
  constructor() {
  }
}

export class AgencyVoucher {
  public dsbmtHdrSeq: number;
  public disbursementVoucherDetailDTOs: DisbursementVoucherListItem[];
}
