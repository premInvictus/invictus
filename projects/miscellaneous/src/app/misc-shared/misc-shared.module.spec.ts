import { MiscSharedModule } from './misc-shared.module';

describe('MiscSharedModule', () => {
  let miscSharedModule: MiscSharedModule;

  beforeEach(() => {
    miscSharedModule = new MiscSharedModule();
  });

  it('should create an instance', () => {
    expect(miscSharedModule).toBeTruthy();
  });
});
