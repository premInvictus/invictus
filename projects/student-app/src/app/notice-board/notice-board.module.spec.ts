import { NoticeBoardModule } from './notice-board.module';

describe('NoticeBoardModule', () => {
  let noticeBoardModule: NoticeBoardModule;

  beforeEach(() => {
    noticeBoardModule = new NoticeBoardModule();
  });

  it('should create an instance', () => {
    expect(noticeBoardModule).toBeTruthy();
  });
});
