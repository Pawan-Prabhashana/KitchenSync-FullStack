import { Order } from '../../models/types';
import { OrderModel } from '../../db/models/order.model';
import { MongoCrudRepository } from './crudRepo.mongo';

/** Kitchen-order repository backed by MongoDB. */
export class MongoOrderRepository extends MongoCrudRepository<Order> {
  constructor() {
    super(OrderModel, 'Order');
  }
}
