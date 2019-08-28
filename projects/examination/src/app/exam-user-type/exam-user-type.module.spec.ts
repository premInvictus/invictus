import { ExamUserTypeModule } from './exam-user-type.module';

describe('ExamUserTypeModule', () => {
  let examUserTypeModule: ExamUserTypeModule;

  beforeEach(() => {
    examUserTypeModule = new ExamUserTypeModule();
  });

  it('should create an instance', () => {
    expect(examUserTypeModule).toBeTruthy();
  });
});
