import { EmployeeMessagesModule } from './employee-messages.module';

describe('EmployeeMessagesModule', () => {
  let empoyeeMessagesModule: EmployeeMessagesModule;

  beforeEach(() => {
    empoyeeMessagesModule = new EmployeeMessagesModule();
  });

  it('should create an instance', () => {
    expect(empoyeeMessagesModule).toBeTruthy();
  });
});
