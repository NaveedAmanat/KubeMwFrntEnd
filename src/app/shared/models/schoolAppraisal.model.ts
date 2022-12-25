import {Address} from './address.model';
import {SchoolQA, SchoolQualityCheckDto, SchoolQAArray} from './schoolQA.model';
import { PrimaryIncome } from './PrimaryIncome.model';
import { BusinessExpense } from './BusinessExpense.model';

export class SchoolAppraisal {
  schAprslSeq: number;
  schlSeq: number;
  schNm: string;
  schRegdFlg: number;
  pefSptFlg: number;
  schArea: string;
  schAge: number;
  schOwnTypKey: number;
  relWthOwnKey: number;
  schPpalKey: number;
  bldngOwnKey: number;
  schTypKey: number;
  schLvlKey: number;
  schMedmKey: number;
  schAreaUntKey: number;
  loanAppSeq: number;
  addressDto: Address = new Address();
  schoolGradeDtos: SchoolGradeDto[];
  schoolQualityCheckDtos: SchoolQA[];
  primaryIncome: PrimaryIncome[] = [];
  secondaryIncome: PrimaryIncome[] = []; 
  businessExpense: BusinessExpense[] = [];
  householdExpense: BusinessExpense[] = [];
  schoolAge;
  schRegdAgy;
  SchoolQAArray:SchoolQAArray[];

  hasBasic = false;
  hasAddress = false;
  hasGrade = false;
  hasIncome = false;
  hasExpense = false;
  hasQltyChck = false;
  formComplete = false;
  hasAttend = false;
  // "totMaleTchrs": "1",
  // "totFemTchrs": "2",
  // "lastYrDrop": "3",
}

export class SchoolGradeDto {
  grdSeq: number;
  schGrdSeq;
  totFemStdnt: number;
  totMaleStdnt: number;
  avgFee: number;
  noFeeStdnt: number;
  femStdntPrsnt: number;
  maleStdntPrsnt: number;
  grdKey: number;
  gradeFlag: string;
  classAverageFee;
  girlsAverage;
  totalStudents;
  schoolRevenue =0;
  totalFee = 0;

  totalBusinessincome = 0;
  totalPrimaryIncome = 0;
  totalSecondaryIncome = 0;
  totalhouseholdExpense = 0;
  constructor() {
    this.avgFee = 0;
    this.totMaleStdnt = 0;
    this.totFemStdnt = 0;
    this.noFeeStdnt = 0;
    this.femStdntPrsnt = 0;
    this.maleStdntPrsnt = 0;
    this.gradeFlag = 'a';
    this.totalStudents = 0;
  }
}
