import { AuxillariesModule } from './auxillaries.module';

describe('AuxillariesModule', () => {
  let auxillariesModule: AuxillariesModule;

  beforeEach(() => {
    auxillariesModule = new AuxillariesModule();
  });

  it('should create an instance', () => {
    expect(auxillariesModule).toBeTruthy();
  });
});
