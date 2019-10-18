import { HrusertypeModule } from './hrusertype.module';

describe('HrusertypeModule', () => {
  let hrusertypeModule: HrusertypeModule;

  beforeEach(() => {
    hrusertypeModule = new HrusertypeModule();
  });

  it('should create an instance', () => {
    expect(hrusertypeModule).toBeTruthy();
  });
});
