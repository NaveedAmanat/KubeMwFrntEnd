import { InsuranceMember } from './InsuranceMembers.model';
import { Nominee } from './Nominee.model';
import { Address } from './address.model';
import { BusinessAppraisal } from './BusinessAppraisal.model';
import { PrimaryIncome } from './PrimaryIncome.model';
import { BusinessExpense } from './BusinessExpense.model';
import { LoanUtilization } from './LoanUtilization.model';
import { MFCIBLoan } from './mfcib.model';
import { Question } from './Question.model';
import { LoanProduct } from './LoanProduct.model';
import { Form } from './Form.model';
import { SchoolInformation } from './SchoolInformation.model';

export class LoanApplicant {

    public clntSeq: string;
    public formSeq: string;

    public portKey: string;
    public portfolioSeq: string;
    public portSeq;

    public cnicNum: string;
    public expiryDate: string;
    public clientSeq: string;


    //  Personal-Info
    public addresSeq: string;
    public firstName: string;
    public lastName: string;
    public nickName: string;
    public motherMaidenName: string;
    public phone: string;
    public dob: string;
    public clntAge: string;
    public genderKey: string;
    public maritalStatusKey: string;
    public eduLvlKey: string;
    public disableFlag = false;
    public natureDisabilityKey: string;
    public occupationKey: string;
    public residenceTypeKey: string;
    public houseHoldMember: string;
    public numOfDependts: string;
    public numOfChidren: string;
    public earningMembers: string;
    public fathrFirstName: string;
    public fathrLastName: string;
    public spzFirstName: string;
    public spzLastName: string;
    public houseNum: string;
    public sreet_area: string;
    public community: string;
    public village: string;
    public otherDetails: string;
    public tehsil: string;
    public district: string;
    public city: string;
    public uc: string;
    public yearsOfResidence: number;
    public mnthsOfResidence: number;
    public isPermAddress = true;
    public tokenNum:number;
    public tokenDate;
    public prdSeq;
    // Added by Areeba - Dated - 13-05-2022
    public membrshpDt;
    public refCdLeadTypSeq: string;
    // Ended by Areeba

    // Loan-Info
    public loanProd: string;
    public reqAmount: string;
    public recAmount: string;
    public loanSeq: string;
    public loanAppSeq: string;
    public loan_app_sts_seq;
    public loanCyclNum;
    public previousAmount;
    public totIncmOfErngMemb;
    public bizDtl;
    public tblScrn = false;
    public loan_app_sts_dt;
    public loanProduct: LoanProduct;
    public forms: Form[] = [];

    // MFCI
    public mfcibArray: MFCIBLoan[] = [];

    //  Insurance-Info
    public hlthInsrFlag = false;
    public healthInsrPlanSeq: string;
    public exclusionCategoryKey: string;
    public clntHlthInsrSeq: string;

    // Insurance-Members
    public insuranceMembers: InsuranceMember[] = [];

    // Nominee
    public nominee: Nominee = new Nominee();
    
    // Co-borrower
    public coBorrower: Nominee = new Nominee();
    public coBorrowerAddress: Address = new Address();

    // Next of Kin
    public nextOfKin: Nominee = new Nominee();

    // Client Relative
    public clientRel: Nominee = new Nominee();
    public clientRelAddress: Address = new Address();

    // Business-Appraisal
    public businessAppraisal: BusinessAppraisal;
    public primaryIncome: PrimaryIncome[] = [];
    public secondaryIncome: PrimaryIncome[] = [];
    public businessExpense: BusinessExpense[] = [];
    public householdExpense: BusinessExpense[] = [];


    // Expected-Loan-Utlization
    public loanUtilization: LoanUtilization[] = [];

    // PSC
    public questions: Question[] = [];

    // Submit App
    public comment: string;

    public isNomDetailAvailable:boolean;


    public schoolInformation: SchoolInformation;

    public previousPscScore;
    public status: string;
    public relAddrAsClntFlg = false;
    constructor() {
        if (sessionStorage.getItem('portfolioSeq')) {
            this.portfolioSeq = sessionStorage.getItem('portfolioSeq');
            this.portKey = sessionStorage.getItem('portfolioSeq');
        }
    }
}
