import { WalletsModule } from './wallets.module';

describe('WalletsModule', () => {
  let walletsModule: WalletsModule;

  beforeEach(() => {
    walletsModule = new WalletsModule();
  });

  it('should create an instance', () => {
    expect(walletsModule).toBeTruthy();
  });
});
