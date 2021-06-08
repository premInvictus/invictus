import { TransportusertypeModule } from './transportusertype.module';

describe('TransportusertypeModule', () => {
  let transportusertypeModule: TransportusertypeModule;

  beforeEach(() => {
    transportusertypeModule = new TransportusertypeModule();
  });

  it('should create an instance', () => {
    expect(transportusertypeModule).toBeTruthy();
  });
});
