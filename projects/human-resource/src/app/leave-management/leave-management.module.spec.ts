import { LeaveManagementModule } from './leave-management.module';

describe('LeaveManagementModule', () => {
  let leaveManagementModule: LeaveManagementModule;

  beforeEach(() => {
    leaveManagementModule = new LeaveManagementModule();
  });

  it('should create an instance', () => {
    expect(leaveManagementModule).toBeTruthy();
  });
});
