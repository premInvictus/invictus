import { EassessmentModule } from './eassessment.module';

describe('EassessmentModule', () => {
  let eassessmentModule: EassessmentModule;

  beforeEach(() => {
    eassessmentModule = new EassessmentModule();
  });

  it('should create an instance', () => {
    expect(eassessmentModule).toBeTruthy();
  });
});
