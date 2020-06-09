import { MatSelectSearchModule } from './mat-select-search.module';

describe('MatSelectSearchModule', () => {
  let matSelectSearchModule: MatSelectSearchModule;

  beforeEach(() => {
    matSelectSearchModule = new MatSelectSearchModule();
  });

  it('should create an instance', () => {
    expect(matSelectSearchModule).toBeTruthy();
  });
});
