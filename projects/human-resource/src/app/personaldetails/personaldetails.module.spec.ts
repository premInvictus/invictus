import { PersonaldetailsModule } from './personaldetails.module';

describe('PersonaldetailsModule', () => {
  let personaldetailsModule: PersonaldetailsModule;

  beforeEach(() => {
    personaldetailsModule = new PersonaldetailsModule();
  });

  it('should create an instance', () => {
    expect(personaldetailsModule).toBeTruthy();
  });
});
