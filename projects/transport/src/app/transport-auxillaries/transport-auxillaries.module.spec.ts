import { TransportAuxillariesModule } from './transport-auxillaries.module';

describe('TransportAuxillariesModule', () => {
  let transportAuxillariesModule: TransportAuxillariesModule;

  beforeEach(() => {
    transportAuxillariesModule = new TransportAuxillariesModule();
  });

  it('should create an instance', () => {
    expect(transportAuxillariesModule).toBeTruthy();
  });
});
