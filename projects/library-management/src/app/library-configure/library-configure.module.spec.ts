import { LibraryConfigureModule } from './library-configure.module';

describe('LibraryConfigureModule', () => {
  let libraryConfigureModule: LibraryConfigureModule;

  beforeEach(() => {
    libraryConfigureModule = new LibraryConfigureModule();
  });

  it('should create an instance', () => {
    expect(libraryConfigureModule).toBeTruthy();
  });
});
