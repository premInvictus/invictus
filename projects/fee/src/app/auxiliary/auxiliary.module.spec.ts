import { AuxiliaryModule } from './auxiliary.module';

describe('AuxiliaryModule', () => {
  let auxiliaryModule: AuxiliaryModule;

  beforeEach(() => {
    auxiliaryModule = new AuxiliaryModule();
  });

  it('should create an instance', () => {
    expect(auxiliaryModule).toBeTruthy();
  });
});
