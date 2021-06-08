import { TransportSharedModule } from './transport-shared.module';

describe('TransportSharedModule', () => {
  let transportSharedModule: TransportSharedModule;

  beforeEach(() => {
    transportSharedModule = new TransportSharedModule();
  });

  it('should create an instance', () => {
    expect(transportSharedModule).toBeTruthy();
  });
});
