import { TestReportsModule } from './test-reports.module';

describe('TestReportsModule', () => {
  let testReportsModule: TestReportsModule;

  beforeEach(() => {
    testReportsModule = new TestReportsModule();
  });

  it('should create an instance', () => {
    expect(testReportsModule).toBeTruthy();
  });
});
