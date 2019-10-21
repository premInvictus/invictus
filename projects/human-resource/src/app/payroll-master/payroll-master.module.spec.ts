import { PayrollMasterModule } from './payroll-master.module';

describe('PayrollMasterModule', () => {
  let payrollMasterModule: PayrollMasterModule;

  beforeEach(() => {
    payrollMasterModule = new PayrollMasterModule();
  });

  it('should create an instance', () => {
    expect(payrollMasterModule).toBeTruthy();
  });
});
