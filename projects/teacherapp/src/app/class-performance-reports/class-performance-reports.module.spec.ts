import { ClassPerformanceReportsModule } from './class-performance-reports.module';

describe('ClassPerformanceReportsModule', () => {
  let classPerformanceReportsModule: ClassPerformanceReportsModule;

  beforeEach(() => {
    classPerformanceReportsModule = new ClassPerformanceReportsModule();
  });

  it('should create an instance', () => {
    expect(classPerformanceReportsModule).toBeTruthy();
  });
});
