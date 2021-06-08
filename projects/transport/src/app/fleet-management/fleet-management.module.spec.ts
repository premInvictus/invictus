import { FleetManagementModule } from './fleet-management.module';

describe('FleetManagementModule', () => {
  let fleetManagementModule: FleetManagementModule;

  beforeEach(() => {
    fleetManagementModule = new FleetManagementModule();
  });

  it('should create an instance', () => {
    expect(fleetManagementModule).toBeTruthy();
  });
});
