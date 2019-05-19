import { InvictusSharedModule } from './invictus-shared.module';

describe('InvictusSharedModule', () => {
  let invictusSharedModule: InvictusSharedModule;

  beforeEach(() => {
    invictusSharedModule = new InvictusSharedModule();
  });

  it('should create an instance', () => {
    expect(invictusSharedModule).toBeTruthy();
  });
});
