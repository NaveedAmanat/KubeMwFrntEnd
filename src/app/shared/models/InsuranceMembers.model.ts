export class InsuranceMember {
    public loanAppSeq:number;
    public clientHlthInsrSeq: string;
    public memberCnicNum: string;
    public memberName: string;
    public dob: string;
    public genderKey: number;
    public relKey: number;
    public maritalStatusKey: number;
    public clntHlthInsrSeq: string;
    public hlthInsrMemberSeq: string;
    constructor(loanAppSeq: number) {
        this.loanAppSeq = loanAppSeq;
    }
  }
