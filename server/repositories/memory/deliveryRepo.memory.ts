import { DeliveryOrder } from '../../models/types';
import { MemoryCrudRepository } from './crudRepo.memory';
import { store } from './memoryStore';

/** Delivery-order repository backed by the in-memory store. */
export class MemoryDeliveryOrderRepository extends MemoryCrudRepository<DeliveryOrder> {
  constructor() {
    super(() => store.deliveries);
  }
}
