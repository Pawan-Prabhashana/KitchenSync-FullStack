import { UserRepository, OrderRepository, DeliveryOrderRepository } from '../models/repositories';
import { MemoryUserRepository } from './memory/userRepo.memory';
import { MemoryOrderRepository } from './memory/orderRepo.memory';
import { MemoryDeliveryOrderRepository } from './memory/deliveryRepo.memory';

/**
 * Composition root for the data layer. Today it wires the in-memory
 * implementations; in Milestone 3 this is the single file that swaps to the
 * Mongoose-backed repositories — nothing in controllers/routes changes.
 */
export const userRepository: UserRepository = new MemoryUserRepository();
export const orderRepository: OrderRepository = new MemoryOrderRepository();
export const deliveryRepository: DeliveryOrderRepository = new MemoryDeliveryOrderRepository();
