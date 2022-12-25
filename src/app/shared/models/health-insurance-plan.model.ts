export class HealthInsurancePlan  {
    public hlthInsrPlanSeq: number;
    public planId: string;
    public planNm: string;
    public planStsKey: number;
    public anlPremAmt: number;
    public maxPlcyAmt: number;
    public glAcctNum: string;
    public dfrdAcctNum: string;

    //Added by Areeba - 15-9-2022
    public bddtAcctNum: string;
    public plnDscr: string;
    public hlthCardFlg: boolean;
    public mnthFlg: boolean;
    //Ended by Areeba

    constructor() {}
  }