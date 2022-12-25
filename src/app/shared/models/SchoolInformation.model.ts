import { SchoolQAArray } from "./schoolQA.model";

export class SchoolInformation {

    public  schAstsSeq;
    
    public  totRms;
    public  totOfcs;
    public  totToilets;
    public  totCmptrs;
    public  totChrs;
    public  totDsks;
    public  totLabs;
    public  totWclrs;
    public  totFans;
    public  totGnrtrs;
    public  totFlrs;
    public othAsts;

    // Added by Zohaib Asim - Dated 14-4-2022 - Fields information missing
    public totMalTolts;
    public totFmalTolts;
    public totCmptrLabs;
    // End
    
    public  loanAppSeq;
    public  formSeq;


	SchoolQAArray:SchoolQAArray[];
	schoolQualityCheckDtos;
	public documentChecklist:SchoolQAArray[];
	
	public mwAnswers;

	
	
	public hasAssets;
	public hasDocChck;
	public hasQltyChck;
	public formComplete;
    constructor(){

    }
}