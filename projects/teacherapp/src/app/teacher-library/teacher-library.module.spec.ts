import { TeacherLibraryModule } from './teacher-library.module';

describe('TeacherLibraryModule', () => {
  let teacherLibraryModule: TeacherLibraryModule;

  beforeEach(() => {
    teacherLibraryModule = new TeacherLibraryModule();
  });

  it('should create an instance', () => {
    expect(teacherLibraryModule).toBeTruthy();
  });
});
