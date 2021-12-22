import { SecondaryreviewModule } from './secondaryreview.module';

describe('SecondaryreviewModule', () => {
  let secondaryreviewModule: SecondaryreviewModule;

  beforeEach(() => {
    secondaryreviewModule = new SecondaryreviewModule();
  });

  it('should create an instance', () => {
    expect(secondaryreviewModule).toBeTruthy();
  });
});
