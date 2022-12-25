export class MFCIBLoan {
    public clientSeq: string;
    public instituteName: string;
    public totalAmount: number;
    public loanPurpose: string;
    public currentOutStandingAmount: number;
    public loanCompletionDate: string;
    public isExpense: boolean;
    public mfcibSeq: string;

    public loanAppSeq: string;
    public formSeq: string;
    public index;
    
    constructor(seq: string, formSeq:string) {
        this.loanAppSeq = seq;
        this.formSeq = formSeq;
    }
}
