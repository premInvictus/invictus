import { SmartSharedModule } from './smart-shared.module';

describe('SmartSharedModule', () => {
  let smartSharedModule: SmartSharedModule;

  beforeEach(() => {
    smartSharedModule = new SmartSharedModule();
  });

  it('should create an instance', () => {
    expect(smartSharedModule).toBeTruthy();
  });
});
