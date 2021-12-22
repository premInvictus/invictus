import { LibraryUsertypeModule } from './library-usertype.module';

describe('LibraryUsertypeModule', () => {
  let libraryUsertypeModule: LibraryUsertypeModule;

  beforeEach(() => {
    libraryUsertypeModule = new LibraryUsertypeModule();
  });

  it('should create an instance', () => {
    expect(libraryUsertypeModule).toBeTruthy();
  });
});
