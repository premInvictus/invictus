import { StudentUserTypeModule } from './student-user-type.module';

describe('StudentUserTypeModule', () => {
  let studentUserTypeModule: StudentUserTypeModule;

  beforeEach(() => {
    studentUserTypeModule = new StudentUserTypeModule();
  });

  it('should create an instance', () => {
    expect(studentUserTypeModule).toBeTruthy();
  });
});
