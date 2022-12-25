import { ToastInjector } from "ngx-toastr";
import { Community } from "./community.model";
import { Portfolio } from "./portfolio.model";
import { Product } from "./Product.model";
import { UC } from "./UC.model";

// Updated by Areeba 
// Branch Setup

export class Branch {

    brnchSeq: number;

    //MW_BRNCH
    brnchNm: string;
    brnchDscr: string;
    brnchStsKey: number;
    brnchTypKey: number;
    brnchPhNum: string;
    areaSeq: number;
    email: string;
    hrLocCd: string;
    mfcibCmpnySeq: number;
    mobStrtDt: Date;
    mobEndDt: Date;

    //MW_BRNCH_ACCT_SET
    brnchAcctSetSeq: number;
    bankNm: number;
    bankBrnch: string;
    acctNm: string;
    acctNum: string;
    iban: string;
    bankCode: string;
    ibftBankCode: string;

    //MW_BRNCH_REMIT_REL
    brnchRemitSeq: number;
    remitBankBrnch: string;
    remitIban: string;
    pymtTypSeq: number;

    //MW_BRNCH_LOCATION_REL
    citySeq: number;

    //MW_BRNCH_PRD_REL
    products: Product[] = [];

    //MW_ADDR
    hseNum: string;
    strt: string;
    ucSeq: number;
    cmntySeq: number;
    vlg: string;
    addrTypKey: number;
    othdtl: string;
    lati: number;
    longi: number;

    ports: Portfolio[] = [];
    communities: Community[] = [];
    ucs: UC[] = [];

    constructor() {
        this.brnchSeq = null;
        this.brnchNm = null;
        this.brnchDscr = null;
        this.brnchStsKey = null;
        this.brnchTypKey = null;
        this.brnchPhNum = null;
        this.areaSeq = null;
        this.email = null;
        this.hrLocCd = null;
        this.mfcibCmpnySeq = null;
        this.brnchAcctSetSeq = null;
        this.bankNm = null;
        this.bankBrnch = null;
        this.acctNm = null;
        this.acctNum = null;
        this.iban = null;
        this.bankCode = null;
        this.ibftBankCode = null;
        this.brnchRemitSeq = null;
        this.pymtTypSeq = null;
        this.remitBankBrnch = null;
        this.remitIban = null;
        this.citySeq = null;
        this.products = [];
        this.hseNum = null;
        this.strt = null;
        this.cmntySeq = null;
        this.vlg = null;
        this.addrTypKey = null;
        this.othdtl = null;
        this.lati = null;
        this.longi = null;
        this.ports = [];
        this.communities = [];
        this.ucs = [];
        this.ucSeq = null;
    }
}
