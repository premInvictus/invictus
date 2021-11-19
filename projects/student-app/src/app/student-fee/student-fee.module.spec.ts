import { StudentFeeModule } from './student-fee.module';

describe('StudentFeeModule', () => {
  let studentFeeModule: StudentFeeModule;

  beforeEach(() => {
    studentFeeModule = new StudentFeeModule();
  });

  it('should create an instance', () => {
    expect(studentFeeModule).toBeTruthy();
  });
});
