import { CatalogueManagementModule } from './catalogue-management.module';

describe('CatalogueManagementModule', () => {
  let catalogueManagementModule: CatalogueManagementModule;

  beforeEach(() => {
    catalogueManagementModule = new CatalogueManagementModule();
  });

  it('should create an instance', () => {
    expect(catalogueManagementModule).toBeTruthy();
  });
});
