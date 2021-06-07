import { FleetMasterModule } from './fleet-master.module';

describe('FleetMasterModule', () => {
  let fleetMasterModule: FleetMasterModule;

  beforeEach(() => {
    fleetMasterModule = new FleetMasterModule();
  });

  it('should create an instance', () => {
    expect(fleetMasterModule).toBeTruthy();
  });
});
