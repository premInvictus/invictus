import { StudentReportsModule } from './student-reports.module';

describe('StudentReportsModule', () => {
  let studentReportsModule: StudentReportsModule;

  beforeEach(() => {
    studentReportsModule = new StudentReportsModule();
  });

  it('should create an instance', () => {
    expect(studentReportsModule).toBeTruthy();
  });
});
