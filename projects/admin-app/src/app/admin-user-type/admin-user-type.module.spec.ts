import { AdminUserTypeModule } from './admin-user-type.module';

describe('AdminUserTypeModule', () => {
  let adminUserTypeModule: AdminUserTypeModule;

  beforeEach(() => {
    adminUserTypeModule = new AdminUserTypeModule();
  });

  it('should create an instance', () => {
    expect(adminUserTypeModule).toBeTruthy();
  });
});
