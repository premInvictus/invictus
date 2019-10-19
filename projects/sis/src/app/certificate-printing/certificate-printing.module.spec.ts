import { CertificatePrintingModule } from './certificate-printing.module';

describe('CertificatePrintingModule', () => {
  let certificatePrintingModule: CertificatePrintingModule;

  beforeEach(() => {
    certificatePrintingModule = new CertificatePrintingModule();
  });

  it('should create an instance', () => {
    expect(certificatePrintingModule).toBeTruthy();
  });
});
