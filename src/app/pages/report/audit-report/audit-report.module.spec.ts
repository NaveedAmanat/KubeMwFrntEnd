import { AuditReportModule } from './audit-report.module';

describe('AuditReportModule', () => {
  let auditReportModule: AuditReportModule;

  beforeEach(() => {
    auditReportModule = new AuditReportModule();
  });

  it('should create an instance', () => {
    expect(auditReportModule).toBeTruthy();
  });
});
