import {
  AuthResponse,
  User,
  Order,
  DeliveryOrder,
  Stage,
  DeliveryStage,
  PaymentMethod,
  Role
} from '../types';

/**
 * Thin typed fetch wrapper around the KitchenSync REST API.
 *
 * - Base URL comes from `VITE_API_URL` (default http://localhost:4000).
 * - The JWT is stored in localStorage and attached as `Authorization: Bearer`.
 * - Order ids contain a leading `#`, which is a URL fragment delimiter, so every
 *   id is `encodeURIComponent`-ed before it goes into a path.
 * - Non-2xx responses throw a typed {@link ApiError}; 409s carry the server's
 *   current version info so the conflict-guard UI can surface it.
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:4000';

/** Shared password for every seeded demo account (matches the backend seed). */
export const DEMO_PASSWORD = 'kitchen123';

const TOKEN_KEY = 'kitchensync_token';
const USER_KEY = 'kitchensync_user';

/** Current-version info returned alongside a 409 conflict. */
export interface ConflictCurrent {
  version: number;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export class ApiError extends Error {
  status: number;
  code: string;
  /** Present on 409 VERSION_CONFLICT responses. */
  current?: ConflictCurrent;

  constructor(status: number, code: string, message: string, current?: ConflictCurrent) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.current = current;
  }

  get isConflict(): boolean {
    return this.status === 409;
  }
  /** Network/connectivity failure (server unreachable), not an HTTP error. */
  get isNetwork(): boolean {
    return this.status === 0;
  }
}

// ─── token/session storage ────────────────────────────────────────────────────

export function getToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token: string | null): void {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* ignore */ }
}
export function getCachedUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch { return null; }
}
export function setCachedUser(user: User | null): void {
  try {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  } catch { /* ignore */ }
}
export function clearSession(): void {
  setToken(null);
  setCachedUser(null);
}

// ─── core request ─────────────────────────────────────────────────────────────

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    // fetch rejects only on network/connectivity failure.
    throw new ApiError(0, 'NETWORK_ERROR', 'Cannot reach the KitchenSync API');
  }

  if (res.status === 204) return undefined as T;

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = text; }
  }

  if (!res.ok) {
    const d = (data ?? {}) as { error?: { message?: string; code?: string }; current?: ConflictCurrent };
    throw new ApiError(
      res.status,
      d.error?.code || 'HTTP_ERROR',
      d.error?.message || `Request failed (${res.status})`,
      d.current
    );
  }

  return data as T;
}

const enc = encodeURIComponent;

// ─── auth ─────────────────────────────────────────────────────────────────────

export const api = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const auth = await request<AuthResponse>('POST', '/api/auth/login', { email, password });
    setToken(auth.token);
    setCachedUser(auth.user);
    return auth;
  },

  async register(input: { name: string; email: string; password: string; role: Role }): Promise<AuthResponse> {
    const auth = await request<AuthResponse>('POST', '/api/auth/register', input);
    setToken(auth.token);
    setCachedUser(auth.user);
    return auth;
  },

  async me(): Promise<User> {
    const res = await request<{ user: User }>('GET', '/api/auth/me');
    setCachedUser(res.user);
    return res.user;
  },

  logout(): void {
    clearSession();
  },

  // ─── users ───────────────────────────────────────────────────────────────
  listUsers(): Promise<User[]> {
    return request<User[]>('GET', '/api/users');
  },

  // ─── kitchen orders (scoped by branch) ─────────────────────────────────────
  listOrders(branchId: string): Promise<Order[]> {
    return request<Order[]>('GET', `/api/orders?branchId=${enc(branchId)}`);
  },
  getOrder(id: string): Promise<Order> {
    return request<Order>('GET', `/api/orders/${enc(id)}`);
  },
  createOrder(input: {
    branchId: string;
    tableNumber: string;
    items: Array<{ id: string; name: string; quantity: number }>;
    specialNotes?: string;
    waiterName?: string;
    chefName?: string;
  }): Promise<Order> {
    return request<Order>('POST', '/api/orders', input);
  },
  updateOrder(
    id: string,
    patch: { stage?: Stage; chef?: string; expectedVersion?: number }
  ): Promise<Order> {
    return request<Order>('PATCH', `/api/orders/${enc(id)}`, patch);
  },
  deleteOrder(id: string): Promise<void> {
    return request<void>('DELETE', `/api/orders/${enc(id)}`);
  },

  // ─── delivery orders (scoped by branch) ────────────────────────────────────
  listDeliveries(branchId: string): Promise<DeliveryOrder[]> {
    return request<DeliveryOrder[]>('GET', `/api/deliveries?branchId=${enc(branchId)}`);
  },
  getDelivery(id: string): Promise<DeliveryOrder> {
    return request<DeliveryOrder>('GET', `/api/deliveries/${enc(id)}`);
  },
  createDelivery(input: {
    branchId: string;
    customerName: string;
    address: string;
    distanceKm: number;
    items: Array<{ id: string; name: string; quantity: number }>;
    paymentMethod: PaymentMethod;
    orderTotal?: number;
    etaMinutes?: number;
    specialNotes?: string;
    riderName?: string;
  }): Promise<DeliveryOrder> {
    return request<DeliveryOrder>('POST', '/api/deliveries', input);
  },
  updateDelivery(
    id: string,
    patch: { stage?: DeliveryStage; rider?: string; expectedVersion?: number }
  ): Promise<DeliveryOrder> {
    return request<DeliveryOrder>('PATCH', `/api/deliveries/${enc(id)}`, patch);
  },
  deleteDelivery(id: string): Promise<void> {
    return request<void>('DELETE', `/api/deliveries/${enc(id)}`);
  }
};
