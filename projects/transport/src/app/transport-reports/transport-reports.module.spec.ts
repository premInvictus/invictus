import { TransportReportsModule } from './transport-reports.module'

describe('TransportReportsModule', () => {
  let transportReportsModule: TransportReportsModule;

  beforeEach(() => {
    transportReportsModule = new TransportReportsModule();
  });

  it('should create an instance', () => {
    expect(transportReportsModule).toBeTruthy();
  });
});
