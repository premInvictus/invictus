import { CirculationManagementModule } from './circulation-management.module';

describe('CirculationManagementModule', () => {
  let circulationManagementModule: CirculationManagementModule;

  beforeEach(() => {
    circulationManagementModule = new CirculationManagementModule();
  });

  it('should create an instance', () => {
    expect(circulationManagementModule).toBeTruthy();
  });
});
