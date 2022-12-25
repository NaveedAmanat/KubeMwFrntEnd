import { Address } from "./address.model";
import { PrimaryIncome } from './PrimaryIncome.model';
import { BusinessExpense } from './BusinessExpense.model';
import { EstimatedLivestock } from "./EstimatedLivestock.model";
import { ExistingLivestock } from "./ExistingLivestock.model";

export class BusinessAppraisal {
    public clientSeq: string;
    public loanAppSeq: string;
    public sectorKey: string;
    public activityKey: string;
    public businessDetailStr: string;
    public personRunningBusinessKey: string;
    public businessOwnerShip: string;
    public yearsInBusiness: string;
    public monthsInBusiness: string;
    public businessPropertyOwnerShip: string;
    public phoneNumber: number;
    public remarks: string;

    public lat: string;
    public lon: string;

    public expAmount: string;
    public maxMonthSale: string;
    public maxSaleMonth: string;
    public minMonthSale: string;
    public minSaleMonth: string;

    // Address
    public businessAddress: Address = new Address();

    public incomeHdrSeq: string;
    public bizAprslSeq: string;
    public bizAddressSeq: string;

    public bizPhoneNum:string;
    public bizPropertyOwnKey:number;
    public isbizAddrSAC:boolean = false;

    public primaryIncome: PrimaryIncome[] = [];
    public secondaryIncome: PrimaryIncome[] = [];
    public businessExpense: BusinessExpense[] = [];
    public householdExpense: BusinessExpense[] = [];

    // livestock
    public estLvStk:EstimatedLivestock[] = [];
    public extngLvStk:ExistingLivestock[] = [];
    
    public formSeq: string;
    constructor(loanAppSeq:string, formSeq:string) {
        this.loanAppSeq = loanAppSeq;
        this.formSeq = formSeq;
    }

}
