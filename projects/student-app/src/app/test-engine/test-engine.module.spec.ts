import { TestEngineModule } from './test-engine.module';

describe('TestEngineModule', () => {
  let testEngineModule: TestEngineModule;

  beforeEach(() => {
    testEngineModule = new TestEngineModule();
  });

  it('should create an instance', () => {
    expect(testEngineModule).toBeTruthy();
  });
});
