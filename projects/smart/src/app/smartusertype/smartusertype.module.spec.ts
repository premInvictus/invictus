import { SmartusertypeModule } from './smartusertype.module';

describe('SmartusertypeModule', () => {
  let smartusertypeModule: SmartusertypeModule;

  beforeEach(() => {
    smartusertypeModule = new SmartusertypeModule();
  });

  it('should create an instance', () => {
    expect(smartusertypeModule).toBeTruthy();
  });
});
