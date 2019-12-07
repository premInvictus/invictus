import { InventoryusertypeModule } from './inventoryusertype.module';

describe('InventoryusertypeModule', () => {
  let inventoryusertypeModule: InventoryusertypeModule;

  beforeEach(() => {
    inventoryusertypeModule = new InventoryusertypeModule();
  });

  it('should create an instance', () => {
    expect(inventoryusertypeModule).toBeTruthy();
  });
});
