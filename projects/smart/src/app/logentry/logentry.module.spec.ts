import { LogentryModule } from './logentry.module';

describe('LogentryModule', () => {
  let logentryModule: LogentryModule;

  beforeEach(() => {
    logentryModule = new LogentryModule();
  });

  it('should create an instance', () => {
    expect(logentryModule).toBeTruthy();
  });
});
