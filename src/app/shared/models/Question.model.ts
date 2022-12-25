import { Answer } from "./Answer.model";

export class Question{
    public questionKey:number;
    public questionString:string;
    public questionCategory:number;
    public questionCategoryKey:number;
    public questionStatus:number;
    public questionSortOrder:number;
    public questionnaireSequence: number;    
    public answers:Answer[] = [];
    public qstSortOrdr;
    public questionSeq:number;
    public answerSeq:number;
    public loanAppSeq:string;
    public formSeq:string;
    qstSeq;
    qstTypKey;
    qstStr;
    qstCtgryKey;
    qstStsKey;
    qstnrSeq;

    public pscScore;

    answersTest:any[] = [];
    constructor(loanAppSeq:string, formSeq:string){
        this.loanAppSeq = loanAppSeq;
        this.formSeq = formSeq;
    }
 }