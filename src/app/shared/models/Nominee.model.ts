export class Nominee{

    public clntRelSeq: string;
    public fatherFirstName;
    public fatherLastName;
    public fatherSpzFlag:boolean = false;
    public typFlg:number;

    public nomineeSeq: string;
    public clientSeq: string;
    public cnicNum: string;
    public isSAN = false;
    public isSACS = false;
    public cnicExpryDate: string;
    public cnicIssueDate: string;
    public firstName: string;
    public lastName: string;
    public phone: string;
    public dob: string;
    public genderKey: string;
    public occupationKey: string;
    public relationKey: string;
    public maritalStatusKey: string;

    public loanAppSeq: string;
    public formSeq: string;
    isValidated:boolean;
    history:History;
    cobFormSeq;
    public clientRelSeq;
    // constructor(clientSeq: string){
    //     this.clientSeq = clientSeq;
    // }
    constructor(){
    }
    setSeq(loanAppSeq:string, formSeq:string){
        this.formSeq = formSeq;
        this.loanAppSeq = loanAppSeq;
    }
}
