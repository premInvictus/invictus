import { TeacherMessagesModule } from './teacher-messages.module';

describe('TeacherMessagesModule', () => {
  let teacherMessagesModule: TeacherMessagesModule;

  beforeEach(() => {
    teacherMessagesModule = new TeacherMessagesModule();
  });

  it('should create an instance', () => {
    expect(teacherMessagesModule).toBeTruthy();
  });
});
