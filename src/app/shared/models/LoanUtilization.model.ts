export class LoanUtilization {
    public utilPlanSeq: number;
    public loanAppSeq: string;
    public loanUtilDesc: string;
    public loanUtilAmount;
    public loanUtilType: string;

    public formSeq: string;
    public index;
    constructor(seq: string, formSeq: string) {
        this.loanAppSeq = seq;
        this.formSeq = formSeq;
    }
}