import { InventorySharedModule } from './inventory-shared.module';

describe('InventorySharedModule', () => {
  let inventorySharedModule: InventorySharedModule;

  beforeEach(() => {
    inventorySharedModule = new InventorySharedModule();
  });

  it('should create an instance', () => {
    expect(inventorySharedModule).toBeTruthy();
  });
});
