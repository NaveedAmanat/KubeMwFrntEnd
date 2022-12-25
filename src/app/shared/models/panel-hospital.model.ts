import { NullTemplateVisitor } from "@angular/compiler";

/*
Authored by Areeba
Dated 24-2-2022 
Jubliee Panel Hospital List for KSZB clients
*/
export class PanelHospital {
    public id: number;
    public hsptlsNm: string;
    public hsptlsAddr: string;
    public hsptlsPh: string;
    public hsptlsTypSeq: number;
    public hsptlsStsSeq: number;
    public crtdDt: string;
    public crtdBy: string;
    public lastUpdDt: string;
    public lastUpdBy: string;
    public relId: number;
    public brnchSeq: number;
    public hsptlsId: number;
    public distance: number;
    public remarks: string;
    public relCrtdDt: string;
    public relCrtdBy: string;
    public relLastUpdDt: string;
    public relLastUpdBy: string;
    public brnchNm: string;
    public hsptlsTyp: string;
    public hsptlsSts: string;

    constructor() {}
}

// Ended by Areeba