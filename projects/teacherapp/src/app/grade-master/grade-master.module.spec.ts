import { GradeMasterModule } from './grade-master.module';

describe('GradeMasterModule', () => {
  let gradeMasterModule: GradeMasterModule;

  beforeEach(() => {
    gradeMasterModule = new GradeMasterModule();
  });

  it('should create an instance', () => {
    expect(gradeMasterModule).toBeTruthy();
  });
});
