export class SanctionList {
    public sancSeq: number;
    public nationalId: string;
    public cnicNum: string;
    public frstNm: string;
    public lastNm: string;
    public fatherNm: string;

    public cntry: string;
    public prvnce: string;
    public dstrct: string;
    public dob: string;
    public dobFrmt: string;
    public refNo: string;
    public sancType: string;

    public isValidCnic: number;
    public isMtchFound: number;
    public remarks: string;
    public crntRecFlg: number;
    public delFlg: number;

    public procesdRecFlg: number;
    public tagClntFlg: number;

    constructor() {}
}
