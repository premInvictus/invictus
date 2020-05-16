import { FaConfigureModule } from './fa-configure.module';

describe('FaConfigureModule', () => {
  let faConfigureModule: FaConfigureModule;

  beforeEach(() => {
    faConfigureModule = new FaConfigureModule();
  });

  it('should create an instance', () => {
    expect(faConfigureModule).toBeTruthy();
  });
});
