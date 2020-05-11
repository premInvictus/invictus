import { FinancialStatementModule } from './finanacial-statements.module';

describe('FinancialStatementModule', () => {
  let auxiliariesModule: FinancialStatementModule;

  beforeEach(() => {
    auxiliariesModule = new FinancialStatementModule();
  });

  it('should create an instance', () => {
    expect(auxiliariesModule).toBeTruthy();
  });
});
