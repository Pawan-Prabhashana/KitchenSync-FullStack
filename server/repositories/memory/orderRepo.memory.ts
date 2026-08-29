import { Order } from '../../models/types';
import { MemoryCrudRepository } from './crudRepo.memory';
import { store } from './memoryStore';

/** Kitchen-order repository backed by the in-memory store. */
export class MemoryOrderRepository extends MemoryCrudRepository<Order> {
  constructor() {
    super(() => store.orders);
  }
}
