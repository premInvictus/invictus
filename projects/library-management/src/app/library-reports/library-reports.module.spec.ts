import { LibraryReportsModule } from './library-reports.module';

describe('LibraryReportsModule', () => {
  let libraryReportsModule: LibraryReportsModule;

  beforeEach(() => {
    libraryReportsModule = new LibraryReportsModule();
  });

  it('should create an instance', () => {
    expect(libraryReportsModule).toBeTruthy();
  });
});
