import { SyllabusModule } from './syllabus.module';

describe('SyllabusModule', () => {
  let syllabusModule: SyllabusModule;

  beforeEach(() => {
    syllabusModule = new SyllabusModule();
  });

  it('should create an instance', () => {
    expect(syllabusModule).toBeTruthy();
  });
});
