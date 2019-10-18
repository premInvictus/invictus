import { HrSharedModule } from './hr-shared.module';

describe('HrSharedModule', () => {
  let hrSharedModule: HrSharedModule;

  beforeEach(() => {
    hrSharedModule = new HrSharedModule();
  });

  it('should create an instance', () => {
    expect(hrSharedModule).toBeTruthy();
  });
});
