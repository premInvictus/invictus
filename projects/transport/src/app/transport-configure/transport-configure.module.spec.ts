import { TransportConfigureModule } from './transport-configure.module';

describe('TransportConfigureModule', () => {
  let transportConfigureModule: TransportConfigureModule;

  beforeEach(() => {
    transportConfigureModule = new TransportConfigureModule();
  });

  it('should create an instance', () => {
    expect(transportConfigureModule).toBeTruthy();
  });
});
