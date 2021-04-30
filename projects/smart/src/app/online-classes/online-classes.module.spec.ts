import { OnlineClassesModule } from './online-classes.module';

describe('OnlineClassesModule', () => {
  let onlineClassesModule: OnlineClassesModule;

  beforeEach(() => {
    onlineClassesModule = new OnlineClassesModule();
  });

  it('should create an instance', () => {
    expect(onlineClassesModule).toBeTruthy();
  });
});
