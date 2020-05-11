import { TransactionMasterModule } from './transaction-master.module';

describe('TransactionMasterModule', () => {
  let auxiliariesModule: TransactionMasterModule;

  beforeEach(() => {
    auxiliariesModule = new TransactionMasterModule();
  });

  it('should create an instance', () => {
    expect(auxiliariesModule).toBeTruthy();
  });
});
