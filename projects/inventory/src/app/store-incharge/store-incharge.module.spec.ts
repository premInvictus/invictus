import { StoreInchargeModule } from './store-incharge.module';

describe('StoreInchargeModule', () => {
  let storeInchargeModule: StoreInchargeModule;

  beforeEach(() => {
    storeInchargeModule = new StoreInchargeModule();
  });

  it('should create an instance', () => {
    expect(storeInchargeModule).toBeTruthy();
  });
});
