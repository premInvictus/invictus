import { AuxiliariesModule } from './auxiliaries.module';

describe('AuxiliariesModule', () => {
  let auxiliariesModule: AuxiliariesModule;

  beforeEach(() => {
    auxiliariesModule = new AuxiliariesModule();
  });

  it('should create an instance', () => {
    expect(auxiliariesModule).toBeTruthy();
  });
});
