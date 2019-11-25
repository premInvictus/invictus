import { MiscusertypeModule } from './miscusertype.module';

describe('MiscusertypeModule', () => {
  let miscusertypeModule: MiscusertypeModule;

  beforeEach(() => {
    miscusertypeModule = new MiscusertypeModule();
  });

  it('should create an instance', () => {
    expect(miscusertypeModule).toBeTruthy();
  });
});
