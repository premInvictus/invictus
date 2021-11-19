import { StudentMessagesModule } from './student-messages.module';

describe('StudentMessagesModule', () => {
  let studentMessagesModule: StudentMessagesModule;

  beforeEach(() => {
    studentMessagesModule = new StudentMessagesModule();
  });

  it('should create an instance', () => {
    expect(studentMessagesModule).toBeTruthy();
  });
});
