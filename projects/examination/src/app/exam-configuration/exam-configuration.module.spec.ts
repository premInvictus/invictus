import { ExamConfigurationModule } from './exam-configuration.module';

describe('ExamConfigurationModule', () => {
  let examConfigurationModule: ExamConfigurationModule;

  beforeEach(() => {
    examConfigurationModule = new ExamConfigurationModule();
  });

  it('should create an instance', () => {
    expect(examConfigurationModule).toBeTruthy();
  });
});
