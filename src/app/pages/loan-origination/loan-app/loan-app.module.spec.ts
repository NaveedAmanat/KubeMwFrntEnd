import { LoanAppModule } from './loan-app.module';

describe('LoanAppModule', () => {
  let loanAppModule: LoanAppModule;

  beforeEach(() => {
    loanAppModule = new LoanAppModule();
  });

  it('should create an instance', () => {
    expect(loanAppModule).toBeTruthy();
  });
});
