import { DeliveryOrder } from '../../models/types';
import { DeliveryModel } from '../../db/models/delivery.model';
import { MongoCrudRepository } from './crudRepo.mongo';

/** Delivery-order repository backed by MongoDB. */
export class MongoDeliveryOrderRepository extends MongoCrudRepository<DeliveryOrder> {
  constructor() {
    super(DeliveryModel, 'Delivery');
  }
}
