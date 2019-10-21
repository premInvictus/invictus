import { HrConfigureModule } from './hr-configure.module';

describe('HrConfigureModule', () => {
  let hrConfigureModule: HrConfigureModule;

  beforeEach(() => {
    hrConfigureModule = new HrConfigureModule();
  });

  it('should create an instance', () => {
    expect(hrConfigureModule).toBeTruthy();
  });
});
