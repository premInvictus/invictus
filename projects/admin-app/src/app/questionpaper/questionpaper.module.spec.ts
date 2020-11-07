import { QuestionpaperModule } from './questionpaper.module';

describe('QuestionpaperModule', () => {
  let questionpaperModule: QuestionpaperModule;

  beforeEach(() => {
    questionpaperModule = new QuestionpaperModule();
  });

  it('should create an instance', () => {
    expect(questionpaperModule).toBeTruthy();
  });
});
