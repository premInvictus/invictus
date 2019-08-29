import { QuestiontemplateModule } from './questiontemplate.module';

describe('QuestiontemplateModule', () => {
  let questiontemplateModule: QuestiontemplateModule;

  beforeEach(() => {
    questiontemplateModule = new QuestiontemplateModule();
  });

  it('should create an instance', () => {
    expect(questiontemplateModule).toBeTruthy();
  });
});
