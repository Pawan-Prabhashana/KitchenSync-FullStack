import { env } from '../config/env';
import { UserRepository, OrderRepository, DeliveryOrderRepository } from '../models/repositories';
import { MemoryUserRepository } from './memory/userRepo.memory';
import { MemoryOrderRepository } from './memory/orderRepo.memory';
import { MemoryDeliveryOrderRepository } from './memory/deliveryRepo.memory';
import { MongoUserRepository } from './mongo/userRepo.mongo';
import { MongoOrderRepository } from './mongo/orderRepo.mongo';
import { MongoDeliveryOrderRepository } from './mongo/deliveryRepo.mongo';

/**
 * Composition root for the data layer — the ONE place that chooses the storage
 * implementation. `DATA_SOURCE=mongo` wires the Mongoose repositories (connection
 * + seeding happen in server/index.ts before listen); anything else keeps the
 * in-memory implementations. Exported names are identical either way, so no
 * controller or route changes.
 */
const useMongo = env.dataSource === 'mongo';

export const userRepository: UserRepository = useMongo
  ? new MongoUserRepository()
  : new MemoryUserRepository();

export const orderRepository: OrderRepository = useMongo
  ? new MongoOrderRepository()
  : new MemoryOrderRepository();

export const deliveryRepository: DeliveryOrderRepository = useMongo
  ? new MongoDeliveryOrderRepository()
  : new MemoryDeliveryOrderRepository();
