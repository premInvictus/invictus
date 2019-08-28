import { ExamSharedModule } from './exam-shared.module';

describe('ExamSharedModule', () => {
  let examSharedModule: ExamSharedModule;

  beforeEach(() => {
    examSharedModule = new ExamSharedModule();
  });

  it('should create an instance', () => {
    expect(examSharedModule).toBeTruthy();
  });
});
