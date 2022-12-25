import { Charge } from "./Charge.model";

export class LoanProduct{

    public calcType:string;
public condition:string;
public installments:number;
public maxAmount:number;
public minAmount:number;
public productName:string;
public productSeq:number;
public prdGrpSeq:number;
public serviceCharges:number;
public charges: Charge[];
public prdRul;
limitRule;
termRule;
// for UI
public chargesStr:string;
public totalRecieveable: number;
public installmentAmount:number;

    constructor(){

    }
}

export class LoanProductAssoc{

    public calcType:string;
public condition:string;
public installments:number;
public maxAmount:number;
public minAmount:number;
public productName:string;
public productSeq:number;
public serviceCharges:number;
public charges: Charge[];
public prdRul;
limitRule;
termRule;
// New Fields
clientSeq;
loanProd;
approvedAmount;
prntLoanAppSeq;

// for UI
public chargesStr:string;
public totalRecieveable: number;
public installmentAmount:number;

    constructor(){

    }
}