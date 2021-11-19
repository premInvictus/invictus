import { SmartconfigurationModule } from './smartconfiguration.module';

describe('SmartconfigurationModule', () => {
  let smartconfigurationModule: SmartconfigurationModule;

  beforeEach(() => {
    smartconfigurationModule = new SmartconfigurationModule();
  });

  it('should create an instance', () => {
    expect(smartconfigurationModule).toBeTruthy();
  });
});
