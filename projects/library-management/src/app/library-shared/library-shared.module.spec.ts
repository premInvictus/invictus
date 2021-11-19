import { LibrarySharedModule } from './library-shared.module';

describe('LibrarySharedModule', () => {
  let librarySharedModule: LibrarySharedModule;

  beforeEach(() => {
    librarySharedModule = new LibrarySharedModule();
  });

  it('should create an instance', () => {
    expect(librarySharedModule).toBeTruthy();
  });
});
