import { EmployeeMasterModule } from './employee-master.module';

describe('EmployeeMasterModule', () => {
  let employeeMasterModule: EmployeeMasterModule;

  beforeEach(() => {
    employeeMasterModule = new EmployeeMasterModule();
  });

  it('should create an instance', () => {
    expect(employeeMasterModule).toBeTruthy();
  });
});
