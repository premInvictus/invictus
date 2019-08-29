import { QuestionPaperSetupModule } from './question-paper-setup.module';

describe('QuestionPaperSetupModule', () => {
  let questionPaperSetupModule: QuestionPaperSetupModule;

  beforeEach(() => {
    questionPaperSetupModule = new QuestionPaperSetupModule();
  });

  it('should create an instance', () => {
    expect(questionPaperSetupModule).toBeTruthy();
  });
});
