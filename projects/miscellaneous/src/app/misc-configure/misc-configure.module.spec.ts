import { MiscConfigureModule } from './misc-configure.module';

describe('MiscConfigureModule', () => {
  let miscConfigureModule: MiscConfigureModule;

  beforeEach(() => {
    miscConfigureModule = new MiscConfigureModule();
  });

  it('should create an instance', () => {
    expect(miscConfigureModule).toBeTruthy();
  });
});
