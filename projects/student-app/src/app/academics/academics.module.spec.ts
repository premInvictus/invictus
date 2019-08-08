import { AcademicsModule } from './academics.module';

describe('AcademicsModule', () => {
  let academicsModule: AcademicsModule;

  beforeEach(() => {
    academicsModule = new AcademicsModule();
  });

  it('should create an instance', () => {
    expect(academicsModule).toBeTruthy();
  });
});
