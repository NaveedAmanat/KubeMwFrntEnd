export class SchoolQA {
  questionCategory: string;
  schoolQuestions: SchoolQuestion[];
}
export class SchoolQuestion {
  questionString: string;
  questionKey: number;
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}
export class SchoolQualityCheckDto {
  qstSeq: number;
  answrSeq: number;
  schQltyChkFlag: string;
  constructor(obj?: any) {
    Object.assign(this, obj);
  }
}

export class SchoolQAArray{
  group;
  key;
  questions: SchoolQARaw;
}
export class SchoolQARaw {
  questionCategory: string;
  questionString: string;
  questionKey: number;
  questionCategoryKey: number;
  answerSeq;
}
