/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SelectBoardPage from './pages/SelectBoardPage';
import SelectBranchPage from './pages/SelectBranchPage';
import { Sidebar } from './components/Sidebar';
import { Board } from './components/Board';
import { DeliveryBoard } from './components/DeliveryBoard';
import { OrderDetailDrawer } from './components/OrderDetailDrawer';
import { DeliveryOrderDetailDrawer } from './components/DeliveryOrderDetailDrawer';
import { NewOrderModal } from './components/NewOrderModal';
import { NewDeliveryOrderModal } from './components/NewDeliveryOrderModal';
import { AuthModal } from './components/AuthModal';
import { ChefsView } from './components/ChefsView';
import { RidersView } from './components/RidersView';
import { OrdersTableView } from './components/OrdersTableView';
import { DeliveryOrdersTableView } from './components/DeliveryOrdersTableView';
import { HistoryView } from './components/HistoryView';
import { DeliveryHistoryView } from './components/DeliveryHistoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { DeliveryAnalyticsView } from './components/DeliveryAnalyticsView';
import { SettingsView } from './components/SettingsView';
import { BottomStatusBar } from './components/BottomStatusBar';

import {
  Order,
  Stage,
  User,
  FilterOptions,
  BoardType,
  Branch,
  DeliveryOrder,
  DeliveryStage,
  PaymentMethod
} from './types';
import { DEMO_USERS, DEMO_RIDERS, MENU_ITEMS } from './data/menu';
import { BRANCHES, findBranch } from './data/branches';
import { seedKitchenForBranch, seedDeliveryForBranch } from './data/branchSeeds';
import { getNextKitchenStage, getNextDeliveryStage } from './lib/boardConfig';
import { useConflictGuard } from './hooks/useConflictGuard';
import { api, ApiError, getToken, getCachedUser, clearSession } from './lib/api';

const ACTIVE_BOARD_KEY = 'kitchensync_active_board_v1';
const ACTIVE_BRANCH_KEY = 'kitchensync_active_branch_v1';

/** Per-branch offline-cache keys (localStorage is a cache; the API is authoritative). */
const kitchenKey = (branchId: string) => `kitchensync_orders_kitchen_${branchId}_v1`;
const deliveryKey = (branchId: string) => `kitchensync_orders_delivery_${branchId}_v1`;

function loadKitchenOrders(branchId: string): Order[] {
  try {
    const saved = localStorage.getItem(kitchenKey(branchId));
    if (saved) return JSON.parse(saved);
  } catch {
    console.warn('Could not read kitchen orders from localStorage');
  }
  return seedKitchenForBranch(branchId);
}

function loadDeliveryOrders(branchId: string): DeliveryOrder[] {
  try {
    const saved = localStorage.getItem(deliveryKey(branchId));
    if (saved) return JSON.parse(saved);
  } catch {
    console.warn('Could not read delivery orders from localStorage');
  }
  return seedDeliveryForBranch(branchId);
}

function loadActiveBoard(): BoardType | null {
  try {
    const saved = localStorage.getItem(ACTIVE_BOARD_KEY);
    if (saved === 'kitchen' || saved === 'delivery') return saved;
  } catch {
    /* ignore */
  }
  return null;
}

function loadActiveBranch(): Branch | null {
  try {
    return findBranch(localStorage.getItem(ACTIVE_BRANCH_KEY));
  } catch {
    return null;
  }
}

function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [route, setRoute] = useState<string>(window.location.hash || '');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeBranch, setActiveBranch] = useState<Branch | null>(() => loadActiveBranch());
  const [boardType, setBoardType] = useState<BoardType | null>(() => loadActiveBoard());
  // True once we've attempted to restore a session from a stored JWT.
  const [sessionRestored, setSessionRestored] = useState<boolean>(false);

  // If not authenticated (after we've tried to restore a session), go to login.
  useEffect(() => {
    if (sessionRestored && !currentUser && (window.location.hash === '' || window.location.hash === '#')) {
      window.location.hash = '#/login';
    }
  }, [currentUser, sessionRestored]);

  // Authenticated but no branch → branch picker
  useEffect(() => {
    if (
      currentUser &&
      !activeBranch &&
      route !== '#/select-branch' &&
      route !== '#/login' &&
      route !== '#/signup'
    ) {
      window.location.hash = '#/select-branch';
    }
  }, [currentUser, activeBranch, route]);

  // Authenticated with a branch but no board → board picker
  useEffect(() => {
    if (
      currentUser &&
      activeBranch &&
      !boardType &&
      route !== '#/select-board' &&
      route !== '#/select-branch' &&
      route !== '#/login' &&
      route !== '#/signup'
    ) {
      window.location.hash = '#/select-board';
    }
  }, [currentUser, activeBranch, boardType, route]);

  const [orders, setOrders] = useState<Order[]>(() =>
    activeBranch ? loadKitchenOrders(activeBranch.id) : []
  );
  const [deliveryOrders, setDeliveryOrders] = useState<DeliveryOrder[]>(() =>
    activeBranch ? loadDeliveryOrders(activeBranch.id) : []
  );

  const [activeUsersCount] = useState<number>(6);
  // Reflects live API reachability. localStorage acts as an offline cache; when a
  // request fails we surface it here (BottomStatusBar) rather than losing work.
  const [isConnected, setIsConnected] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<string>('board');
  const [filters, setFilters] = useState<FilterOptions>({
    chef: 'all',
    table: 'all',
    search: '',
    viewMode: 'all'
  });

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedDeliveryOrder, setSelectedDeliveryOrder] = useState<DeliveryOrder | null>(null);
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const [undoStack, setUndoStack] = useState<Array<{ orderId: string; previousStage: Stage }>>([]);
  const [deliveryUndoStack, setDeliveryUndoStack] = useState<
    Array<{ orderId: string; previousStage: DeliveryStage }>
  >([]);

  const [lastActivity, setLastActivity] = useState<{ user: string; time: string }>({
    user: 'Priya',
    time: '2 sec ago'
  });

  const kitchenConflict = useConflictGuard<Order>();
  const deliveryConflict = useConflictGuard<DeliveryOrder>();

  /**
   * Reconcile local state with the API (authoritative). localStorage has already
   * hydrated state instantly; this replaces it with server truth when reachable,
   * and leaves the cache untouched (marking us offline) when the API is down.
   */
  const reloadFromApi = async (branch: Branch | null = activeBranch) => {
    if (!branch) return;
    try {
      const [srvOrders, srvDeliveries] = await Promise.all([
        api.listOrders(branch.id),
        api.listDeliveries(branch.id)
      ]);
      setOrders(srvOrders);
      setDeliveryOrders(srvDeliveries);
      setIsConnected(true);
    } catch (err) {
      // Network down → keep the localStorage cache and surface offline status.
      if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      else if (err instanceof ApiError && err.status === 401) {
        clearSession();
        setCurrentUser(null);
      }
    }
  };

  // Restore the session from a stored JWT on first load (hydrate from cache, then
  // confirm with /me), so a refresh keeps the user signed in.
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setSessionRestored(true);
      return;
    }
    const cached = getCachedUser();
    if (cached) setCurrentUser(cached);
    api
      .me()
      .then(user => {
        setCurrentUser(user);
        setIsConnected(true);
      })
      .catch(err => {
        if (err instanceof ApiError && err.status === 401) {
          clearSession();
          setCurrentUser(null);
        } else {
          setIsConnected(false); // offline: keep the cached user
        }
      })
      .finally(() => setSessionRestored(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Whenever we have a user AND a chosen branch, pull that branch's data.
  useEffect(() => {
    if (!currentUser || !activeBranch) return;
    reloadFromApi(activeBranch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, activeBranch]);

  // Persist kitchen orders (cache, scoped to the active branch)
  useEffect(() => {
    if (!activeBranch) return;
    try {
      localStorage.setItem(kitchenKey(activeBranch.id), JSON.stringify(orders));
    } catch {
      console.warn('Failed to save kitchen orders to localStorage');
    }
  }, [orders, activeBranch]);

  // Persist delivery orders (cache, scoped to the active branch)
  useEffect(() => {
    if (!activeBranch) return;
    try {
      localStorage.setItem(deliveryKey(activeBranch.id), JSON.stringify(deliveryOrders));
    } catch {
      console.warn('Failed to save delivery orders to localStorage');
    }
  }, [deliveryOrders, activeBranch]);

  // Persist active branch
  useEffect(() => {
    try {
      if (activeBranch) localStorage.setItem(ACTIVE_BRANCH_KEY, activeBranch.id);
      else localStorage.removeItem(ACTIVE_BRANCH_KEY);
    } catch {
      /* ignore */
    }
  }, [activeBranch]);

  // Persist active board
  useEffect(() => {
    try {
      if (boardType) {
        localStorage.setItem(ACTIVE_BOARD_KEY, boardType);
      } else {
        localStorage.removeItem(ACTIVE_BOARD_KEY);
      }
    } catch {
      /* ignore */
    }
  }, [boardType]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    // Fresh interactive login → run the full flow: branch, then board.
    setActiveBranch(null);
    setBoardType(null);
    setActiveTab('board');
    setSelectedOrder(null);
    setSelectedDeliveryOrder(null);
    kitchenConflict.clear();
    deliveryConflict.clear();
    window.location.hash = '#/select-branch';
  };

  /** Load a branch's cached data and reset per-branch view state. */
  const applyBranch = (branch: Branch) => {
    setActiveBranch(branch);
    setOrders(loadKitchenOrders(branch.id));
    setDeliveryOrders(loadDeliveryOrders(branch.id));
    setSelectedOrder(null);
    setSelectedDeliveryOrder(null);
    setUndoStack([]);
    setDeliveryUndoStack([]);
    kitchenConflict.clear();
    deliveryConflict.clear();
  };

  const handleSelectBranch = (branch: Branch) => {
    applyBranch(branch);
    // Continue the flow: if a board is already chosen, go straight in; else pick one.
    window.location.hash = boardType ? '' : '#/select-board';
  };

  /** Header switcher: swap branch in place, staying on the current board. */
  const handleSwitchBranch = (branch: Branch) => {
    if (branch.id === activeBranch?.id) return;
    applyBranch(branch);
  };

  /** Go back to the full branch picker screen. */
  const handleChangeBranch = () => {
    window.location.hash = '#/select-branch';
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveBranch(null);
    setBoardType(null);
    setOrders([]);
    setDeliveryOrders([]);
    setSelectedOrder(null);
    setSelectedDeliveryOrder(null);
    kitchenConflict.clear();
    deliveryConflict.clear();
    window.location.hash = '#/login';
  };

  const handleSelectBoard = (board: BoardType) => {
    setBoardType(board);
    setActiveTab('board');
    setFilters({ chef: 'all', table: 'all', search: '', viewMode: 'all' });
    setSelectedOrder(null);
    setSelectedDeliveryOrder(null);
    kitchenConflict.clear();
    deliveryConflict.clear();
    window.location.hash = '';
  };

  const handleSwitchBoard = () => {
    setSelectedOrder(null);
    setSelectedDeliveryOrder(null);
    kitchenConflict.clear();
    deliveryConflict.clear();
    setBoardType(null);
    window.location.hash = '#/select-board';
  };

  // ─── API sync helpers ─────────────────────────────────────────────────────

  /**
   * Reconcile a kitchen mutation with the server after an optimistic local update.
   * - success: replace local copy with the authoritative server record.
   * - 409 (a real second client won the race): adopt the server's copy on the
   *   board and raise the conflict banner via the same guard the demo uses.
   * - network failure: keep the optimistic local change (cached) and go offline.
   */
  const syncKitchen = async (id: string, call: Promise<Order>) => {
    try {
      const server = await call;
      setOrders(prev => prev.map(o => (o.id === id ? server : o)));
      kitchenConflict.commit(server);
      setSelectedOrder(sel => (sel && sel.id === id ? server : sel));
      setIsConnected(true);
    } catch (err) {
      if (err instanceof ApiError && err.isConflict && err.current) {
        try {
          const latest = await api.getOrder(id);
          setOrders(prev => prev.map(o => (o.id === id ? latest : o)));
        } catch {
          /* ignore refetch failure */
        }
        kitchenConflict.raise({
          orderId: id,
          updatedBy: err.current.lastUpdatedBy,
          updatedAt: err.current.lastUpdatedAt
        });
        setIsConnected(true);
      } else if (err instanceof ApiError && err.isNetwork) {
        setIsConnected(false);
      }
    }
  };

  const syncDelivery = async (id: string, call: Promise<DeliveryOrder>) => {
    try {
      const server = await call;
      setDeliveryOrders(prev => prev.map(o => (o.id === id ? server : o)));
      deliveryConflict.commit(server);
      setSelectedDeliveryOrder(sel => (sel && sel.id === id ? server : sel));
      setIsConnected(true);
    } catch (err) {
      if (err instanceof ApiError && err.isConflict && err.current) {
        try {
          const latest = await api.getDelivery(id);
          setDeliveryOrders(prev => prev.map(o => (o.id === id ? latest : o)));
        } catch {
          /* ignore refetch failure */
        }
        deliveryConflict.raise({
          orderId: id,
          updatedBy: err.current.lastUpdatedBy,
          updatedAt: err.current.lastUpdatedAt
        });
        setIsConnected(true);
      } else if (err instanceof ApiError && err.isNetwork) {
        setIsConnected(false);
      }
    }
  };

  // ─── Kitchen handlers ─────────────────────────────────────────────────────

  const handleMoveStage = (orderId: string, toStage: Stage) => {
    const existingOrder = orders.find(o => o.id === orderId);
    if (!existingOrder) return;
    if (!kitchenConflict.guard(existingOrder)) return;

    setUndoStack(prev => [{ orderId, previousStage: existingOrder.stage }, ...prev.slice(0, 9)]);

    const nowStr = nowTime();
    const actor = currentUser?.name || 'Staff';
    const updatedOrder: Order = {
      ...existingOrder,
      stage: toStage,
      version: existingOrder.version + 1,
      lastUpdatedBy: actor,
      lastUpdatedAt: nowStr,
      servedAt: toStage === 'Served' ? nowStr : existingOrder.servedAt,
      servedAtTimestamp: toStage === 'Served' ? Date.now() : existingOrder.servedAtTimestamp,
      history: [
        ...existingOrder.history,
        {
          id: `h_${Date.now()}`,
          stage: toStage,
          timestamp: nowStr,
          user: actor,
          role: currentUser?.role || 'waiter'
        }
      ]
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
    kitchenConflict.commit(updatedOrder);
    setLastActivity({ user: actor, time: 'just now' });

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrder);
    }

    // Persist to the API (authoritative). expectedVersion = the version we had
    // before the local bump, so a stale write returns 409.
    void syncKitchen(orderId, api.updateOrder(orderId, { stage: toStage, expectedVersion: existingOrder.version }));
  };

  const handleAssignChef = (orderId: string, chefName: string) => {
    const existingOrder = orders.find(o => o.id === orderId);
    if (!existingOrder) return;
    if (!kitchenConflict.guard(existingOrder)) return;

    const nowStr = nowTime();
    const actor = currentUser?.name || 'Manager';
    const updatedOrder: Order = {
      ...existingOrder,
      chef: chefName,
      version: existingOrder.version + 1,
      lastUpdatedBy: actor,
      lastUpdatedAt: nowStr
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
    kitchenConflict.commit(updatedOrder);
    setLastActivity({ user: actor, time: 'just now' });

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(updatedOrder);
    }

    void syncKitchen(orderId, api.updateOrder(orderId, { chef: chefName, expectedVersion: existingOrder.version }));
  };

  const handleCreateOrder = (orderData: {
    tableNumber: string;
    items: Array<{ id: string; name: string; quantity: number }>;
    specialNotes: string;
    waiterName: string;
    chefName?: string;
  }) => {
    if (!activeBranch) return;
    const branchId = activeBranch.id;
    const nowStr = nowTime();
    const newId = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const waiterName = orderData.waiterName || currentUser?.name || 'Waiter';

    const newOrder: Order = {
      id: newId,
      branchId,
      tableNumber: orderData.tableNumber,
      items: orderData.items,
      stage: 'New',
      createdAt: nowStr,
      createdAtTimestamp: Date.now(),
      waiter: waiterName,
      chef: orderData.chefName,
      specialNotes: orderData.specialNotes,
      lastUpdatedBy: waiterName,
      lastUpdatedAt: nowStr,
      version: 1,
      history: [
        {
          id: `h_${Date.now()}`,
          stage: 'New',
          timestamp: nowStr,
          user: waiterName,
          role: currentUser?.role || 'waiter'
        }
      ]
    };

    setIsNewOrderModalOpen(false);

    // Server-first: the API assigns the canonical id. If it's unreachable, fall
    // back to the locally-built order so the ticket isn't lost while offline.
    void (async () => {
      try {
        const created = await api.createOrder({
          branchId,
          tableNumber: orderData.tableNumber,
          items: orderData.items,
          specialNotes: orderData.specialNotes,
          waiterName,
          chefName: orderData.chefName
        });
        setOrders(prev => [created, ...prev]);
        setLastActivity({ user: created.waiter, time: 'just now' });
        setIsConnected(true);
      } catch (err) {
        setOrders(prev => [newOrder, ...prev]);
        setLastActivity({ user: newOrder.waiter, time: 'just now' });
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
    })();
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
      kitchenConflict.clear();
    }
    void (async () => {
      try {
        await api.deleteOrder(orderId);
        setIsConnected(true);
      } catch (err) {
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
    })();
  };

  const handleUndoMove = () => {
    if (undoStack.length === 0) return;
    const [lastMove, ...remainingStack] = undoStack;
    setUndoStack(remainingStack);
    const nowStr = nowTime();
    const existing = orders.find(o => o.id === lastMove.orderId);

    setOrders(prev =>
      prev.map(o => {
        if (o.id !== lastMove.orderId) return o;
        const reverted: Order = {
          ...o,
          stage: lastMove.previousStage,
          version: o.version + 1,
          lastUpdatedBy: currentUser?.name || 'Staff',
          lastUpdatedAt: nowStr
        };
        kitchenConflict.commit(reverted);
        if (selectedOrder?.id === o.id) setSelectedOrder(reverted);
        return reverted;
      })
    );

    if (existing) {
      void syncKitchen(
        lastMove.orderId,
        api.updateOrder(lastMove.orderId, { stage: lastMove.previousStage, expectedVersion: existing.version })
      );
    }
  };

  const handleSelectKitchenOrder = (order: Order) => {
    setSelectedOrder(order);
    kitchenConflict.track(order);
  };

  const handleRefreshKitchenConflict = () => {
    if (!selectedOrder) return;
    const id = selectedOrder.id;
    void (async () => {
      let latest: Order | null = orders.find(o => o.id === id) || null;
      try {
        latest = await api.getOrder(id);
        const server = latest;
        setOrders(prev => prev.map(o => (o.id === id ? server : o)));
        setIsConnected(true);
      } catch (err) {
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
      if (latest) {
        setSelectedOrder(latest);
        kitchenConflict.resolve(latest);
      }
    })();
  };

  /**
   * Demo-only: mutate the open order as if a teammate (Nuwan) advanced / reassigned
   * it. Bumps version + lastUpdatedBy WITHOUT updating the user's baseline, so the
   * next user action trips the conflict guard. Swap this for a Socket.io
   * `order:updated` handler later — same raise()/version path.
   */
  const handleSimulateKitchenConflict = (orderId: string) => {
    const existing = orders.find(o => o.id === orderId);
    if (!existing) return;

    const teammate = DEMO_USERS.find(u => u.name !== currentUser?.name && u.role === 'chef')
      || DEMO_USERS[1];
    const nowStr = nowTime();
    const nextStage = getNextKitchenStage(existing.stage) || existing.stage;

    const simulated: Order = {
      ...existing,
      stage: nextStage,
      chef: existing.chef || teammate.name,
      version: existing.version + 1,
      lastUpdatedBy: teammate.name,
      lastUpdatedAt: nowStr,
      servedAt: nextStage === 'Served' ? nowStr : existing.servedAt,
      history: [
        ...existing.history,
        {
          id: `h_sim_${Date.now()}`,
          stage: nextStage,
          timestamp: nowStr,
          user: teammate.name,
          role: teammate.role
        }
      ]
    };

    setOrders(prev => prev.map(o => (o.id === orderId ? simulated : o)));
    // Do NOT update selectedOrder or commit — baseline stays stale so the next
    // user action conflicts. Raise immediately so the banner/ribbon appear.
    kitchenConflict.raise({
      orderId: simulated.id,
      updatedBy: simulated.lastUpdatedBy,
      updatedAt: simulated.lastUpdatedAt
    });
    setLastActivity({ user: teammate.name, time: 'just now' });
  };

  // ─── Delivery handlers ────────────────────────────────────────────────────

  const handleMoveDeliveryStage = (orderId: string, toStage: DeliveryStage) => {
    const existing = deliveryOrders.find(o => o.id === orderId);
    if (!existing) return;
    if (!deliveryConflict.guard(existing)) return;

    setDeliveryUndoStack(prev => [
      { orderId, previousStage: existing.stage },
      ...prev.slice(0, 9)
    ]);

    const nowStr = nowTime();
    const actor = currentUser?.name || 'Staff';
    const updated: DeliveryOrder = {
      ...existing,
      stage: toStage,
      version: existing.version + 1,
      lastUpdatedBy: actor,
      lastUpdatedAt: nowStr,
      deliveredAt: toStage === 'Delivered' ? nowStr : existing.deliveredAt,
      deliveredAtTimestamp: toStage === 'Delivered' ? Date.now() : existing.deliveredAtTimestamp,
      history: [
        ...existing.history,
        {
          id: `dh_${Date.now()}`,
          stage: toStage,
          timestamp: nowStr,
          user: actor,
          role: currentUser?.role || 'rider'
        }
      ]
    };

    setDeliveryOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    deliveryConflict.commit(updated);
    setLastActivity({ user: actor, time: 'just now' });

    if (selectedDeliveryOrder?.id === orderId) {
      setSelectedDeliveryOrder(updated);
    }

    void syncDelivery(orderId, api.updateDelivery(orderId, { stage: toStage, expectedVersion: existing.version }));
  };

  const handleAssignRider = (orderId: string, riderName: string) => {
    const existing = deliveryOrders.find(o => o.id === orderId);
    if (!existing) return;
    if (!deliveryConflict.guard(existing)) return;

    const nowStr = nowTime();
    const actor = currentUser?.name || 'Dispatcher';
    const updated: DeliveryOrder = {
      ...existing,
      rider: riderName,
      version: existing.version + 1,
      lastUpdatedBy: actor,
      lastUpdatedAt: nowStr
    };

    setDeliveryOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    deliveryConflict.commit(updated);
    setLastActivity({ user: actor, time: 'just now' });

    if (selectedDeliveryOrder?.id === orderId) {
      setSelectedDeliveryOrder(updated);
    }

    void syncDelivery(orderId, api.updateDelivery(orderId, { rider: riderName, expectedVersion: existing.version }));
  };

  const handleCreateDeliveryOrder = (data: {
    customerName: string;
    address: string;
    distanceKm: number;
    items: Array<{ id: string; name: string; quantity: number }>;
    paymentMethod: PaymentMethod;
    specialNotes: string;
    riderName?: string;
  }) => {
    if (!activeBranch) return;
    const branchId = activeBranch.id;
    const nowStr = nowTime();
    const newId = `#DEL-${Math.floor(2000 + Math.random() * 9000)}`;
    const actor = currentUser?.name || 'Staff';

    const orderTotal = data.items.reduce((sum, item) => {
      const menu = MENU_ITEMS.find(m => m.id === item.id);
      return sum + (menu?.price || 0) * item.quantity;
    }, 0);

    const newOrder: DeliveryOrder = {
      id: newId,
      branchId,
      customerName: data.customerName,
      address: data.address,
      distanceKm: data.distanceKm,
      items: data.items,
      specialNotes: data.specialNotes,
      stage: 'Preparing',
      rider: data.riderName,
      paymentMethod: data.paymentMethod,
      orderTotal,
      etaMinutes: Math.max(25, Math.round(25 + data.distanceKm * 2.5)),
      createdAt: nowStr,
      createdAtTimestamp: Date.now(),
      lastUpdatedBy: actor,
      lastUpdatedAt: nowStr,
      version: 1,
      history: [
        {
          id: `dh_${Date.now()}`,
          stage: 'Preparing',
          timestamp: nowStr,
          user: actor,
          role: currentUser?.role || 'waiter'
        }
      ]
    };

    setIsNewOrderModalOpen(false);

    void (async () => {
      try {
        const created = await api.createDelivery({
          branchId,
          customerName: data.customerName,
          address: data.address,
          distanceKm: data.distanceKm,
          items: data.items,
          paymentMethod: data.paymentMethod,
          orderTotal,
          etaMinutes: newOrder.etaMinutes,
          specialNotes: data.specialNotes,
          riderName: data.riderName
        });
        setDeliveryOrders(prev => [created, ...prev]);
        setLastActivity({ user: created.lastUpdatedBy, time: 'just now' });
        setIsConnected(true);
      } catch (err) {
        setDeliveryOrders(prev => [newOrder, ...prev]);
        setLastActivity({ user: actor, time: 'just now' });
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
    })();
  };

  const handleDeleteDeliveryOrder = (orderId: string) => {
    setDeliveryOrders(prev => prev.filter(o => o.id !== orderId));
    if (selectedDeliveryOrder?.id === orderId) {
      setSelectedDeliveryOrder(null);
      deliveryConflict.clear();
    }
    void (async () => {
      try {
        await api.deleteDelivery(orderId);
        setIsConnected(true);
      } catch (err) {
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
    })();
  };

  const handleUndoDeliveryMove = () => {
    if (deliveryUndoStack.length === 0) return;
    const [lastMove, ...remaining] = deliveryUndoStack;
    setDeliveryUndoStack(remaining);
    const nowStr = nowTime();
    const existing = deliveryOrders.find(o => o.id === lastMove.orderId);

    setDeliveryOrders(prev =>
      prev.map(o => {
        if (o.id !== lastMove.orderId) return o;
        const reverted: DeliveryOrder = {
          ...o,
          stage: lastMove.previousStage,
          version: o.version + 1,
          lastUpdatedBy: currentUser?.name || 'Staff',
          lastUpdatedAt: nowStr
        };
        deliveryConflict.commit(reverted);
        if (selectedDeliveryOrder?.id === o.id) setSelectedDeliveryOrder(reverted);
        return reverted;
      })
    );

    if (existing) {
      void syncDelivery(
        lastMove.orderId,
        api.updateDelivery(lastMove.orderId, { stage: lastMove.previousStage, expectedVersion: existing.version })
      );
    }
  };

  const handleSelectDeliveryOrder = (order: DeliveryOrder) => {
    setSelectedDeliveryOrder(order);
    deliveryConflict.track(order);
  };

  const handleRefreshDeliveryConflict = () => {
    if (!selectedDeliveryOrder) return;
    const id = selectedDeliveryOrder.id;
    void (async () => {
      let latest: DeliveryOrder | null = deliveryOrders.find(o => o.id === id) || null;
      try {
        latest = await api.getDelivery(id);
        const server = latest;
        setDeliveryOrders(prev => prev.map(o => (o.id === id ? server : o)));
        setIsConnected(true);
      } catch (err) {
        if (err instanceof ApiError && err.isNetwork) setIsConnected(false);
      }
      if (latest) {
        setSelectedDeliveryOrder(latest);
        deliveryConflict.resolve(latest);
      }
    })();
  };

  const handleSimulateDeliveryConflict = (orderId: string) => {
    const existing = deliveryOrders.find(o => o.id === orderId);
    if (!existing) return;

    const teammate =
      DEMO_RIDERS.find(u => u.name !== currentUser?.name) ||
      DEMO_USERS.find(u => u.name !== currentUser?.name) ||
      DEMO_RIDERS[0];
    const nowStr = nowTime();
    const nextStage = getNextDeliveryStage(existing.stage) || existing.stage;

    const simulated: DeliveryOrder = {
      ...existing,
      stage: nextStage,
      rider: existing.rider || teammate.name,
      version: existing.version + 1,
      lastUpdatedBy: teammate.name,
      lastUpdatedAt: nowStr,
      deliveredAt: nextStage === 'Delivered' ? nowStr : existing.deliveredAt,
      history: [
        ...existing.history,
        {
          id: `dh_sim_${Date.now()}`,
          stage: nextStage,
          timestamp: nowStr,
          user: teammate.name,
          role: teammate.role
        }
      ]
    };

    setDeliveryOrders(prev => prev.map(o => (o.id === orderId ? simulated : o)));
    deliveryConflict.raise({
      orderId: simulated.id,
      updatedBy: simulated.lastUpdatedBy,
      updatedAt: simulated.lastUpdatedAt
    });
    setLastActivity({ user: teammate.name, time: 'just now' });
  };

  // ─── Routes ───────────────────────────────────────────────────────────────

  if (route === '#/login') {
    return <LoginPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (route === '#/signup') {
    return <SignupPage onAuthSuccess={handleAuthSuccess} />;
  }

  // Branch picker: after auth, before a branch is chosen.
  if (currentUser && (route === '#/select-branch' || !activeBranch)) {
    return (
      <SelectBranchPage
        currentUser={currentUser}
        activeBranchId={activeBranch?.id ?? null}
        onSelect={handleSelectBranch}
      />
    );
  }

  if (currentUser && activeBranch && (route === '#/select-board' || !boardType)) {
    return (
      <SelectBoardPage
        currentUser={currentUser}
        branch={activeBranch}
        onSelect={handleSelectBoard}
      />
    );
  }

  // Guard: no user/branch/board → login (hash effect handles redirect, avoid flash)
  if (!currentUser || !activeBranch || !boardType) {
    return null;
  }

  const isDelivery = boardType === 'delivery';
  const canUndo = isDelivery ? deliveryUndoStack.length > 0 : undoStack.length > 0;
  const onUndo = isDelivery ? handleUndoDeliveryMove : handleUndoMove;

  const kitchenConflictData =
    kitchenConflict.conflict && selectedOrder?.id === kitchenConflict.conflict.orderId
      ? { updatedBy: kitchenConflict.conflict.updatedBy, updatedAt: kitchenConflict.conflict.updatedAt }
      : null;

  const deliveryConflictData =
    deliveryConflict.conflict && selectedDeliveryOrder?.id === deliveryConflict.conflict.orderId
      ? { updatedBy: deliveryConflict.conflict.updatedBy, updatedAt: deliveryConflict.conflict.updatedAt }
      : null;

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink flex flex-col antialiased">
      <Header
        currentUser={currentUser}
        activeUsersCount={activeUsersCount}
        filters={filters}
        setFilters={setFilters}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
        onUndo={onUndo}
        canUndo={canUndo}
        activeTab={activeTab}
        boardType={boardType}
        onSwitchBoard={handleSwitchBoard}
        activeBranch={activeBranch}
        branches={BRANCHES}
        onSwitchBranch={handleSwitchBranch}
        onChangeBranch={handleChangeBranch}
      />

      <div className="flex flex-1 items-stretch">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filters={filters}
          setFilters={setFilters}
          onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
          boardType={boardType}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAuth={() => setIsAuthModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto pb-12 ml-64">
          {activeTab === 'board' && !isDelivery && (
            <Board
              orders={orders}
              currentUser={currentUser}
              filters={filters}
              onSelectOrder={handleSelectKitchenOrder}
              onMoveStage={handleMoveStage}
              onAssignChef={handleAssignChef}
              onDeleteOrder={handleDeleteOrder}
              onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
              conflict={kitchenConflict.conflict}
            />
          )}

          {activeTab === 'board' && isDelivery && (
            <DeliveryBoard
              orders={deliveryOrders}
              currentUser={currentUser}
              filters={filters}
              onSelectOrder={handleSelectDeliveryOrder}
              onMoveStage={handleMoveDeliveryStage}
              onAssignRider={handleAssignRider}
              onDeleteOrder={handleDeleteDeliveryOrder}
              onOpenNewOrder={() => setIsNewOrderModalOpen(true)}
              conflict={deliveryConflict.conflict}
            />
          )}

          {activeTab === 'orders' && !isDelivery && (
            <OrdersTableView
              orders={orders}
              onSelectOrder={handleSelectKitchenOrder}
              onMoveStage={handleMoveStage}
              onDeleteOrder={handleDeleteOrder}
            />
          )}

          {activeTab === 'orders' && isDelivery && (
            <DeliveryOrdersTableView
              orders={deliveryOrders}
              onSelectOrder={handleSelectDeliveryOrder}
              onMoveStage={handleMoveDeliveryStage}
              onDeleteOrder={handleDeleteDeliveryOrder}
            />
          )}

          {activeTab === 'chefs' && !isDelivery && (
            <ChefsView orders={orders} onSelectOrder={handleSelectKitchenOrder} />
          )}

          {activeTab === 'chefs' && isDelivery && (
            <RidersView orders={deliveryOrders} onSelectOrder={handleSelectDeliveryOrder} />
          )}

          {activeTab === 'history' && !isDelivery && (
            <HistoryView orders={orders} onSelectOrder={handleSelectKitchenOrder} />
          )}

          {activeTab === 'history' && isDelivery && (
            <DeliveryHistoryView
              orders={deliveryOrders}
              onSelectOrder={handleSelectDeliveryOrder}
            />
          )}

          {activeTab === 'analytics' && !isDelivery && <AnalyticsView orders={orders} />}

          {activeTab === 'analytics' && isDelivery && (
            <DeliveryAnalyticsView orders={deliveryOrders} />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {!isDelivery && (
        <OrderDetailDrawer
          order={selectedOrder}
          currentUser={currentUser}
          onClose={() => {
            setSelectedOrder(null);
            kitchenConflict.clear();
          }}
          onMoveStage={handleMoveStage}
          onDeleteOrder={handleDeleteOrder}
          conflictData={kitchenConflictData}
          onRefreshConflict={handleRefreshKitchenConflict}
          onSimulateConflict={handleSimulateKitchenConflict}
        />
      )}

      {isDelivery && (
        <DeliveryOrderDetailDrawer
          order={selectedDeliveryOrder}
          currentUser={currentUser}
          onClose={() => {
            setSelectedDeliveryOrder(null);
            deliveryConflict.clear();
          }}
          onMoveStage={handleMoveDeliveryStage}
          onDeleteOrder={handleDeleteDeliveryOrder}
          conflictData={deliveryConflictData}
          onRefreshConflict={handleRefreshDeliveryConflict}
          onSimulateConflict={handleSimulateDeliveryConflict}
        />
      )}

      {isNewOrderModalOpen && !isDelivery && (
        <NewOrderModal
          currentUser={currentUser}
          onClose={() => setIsNewOrderModalOpen(false)}
          onSubmit={handleCreateOrder}
        />
      )}

      {isNewOrderModalOpen && isDelivery && (
        <NewDeliveryOrderModal
          currentUser={currentUser}
          onClose={() => setIsNewOrderModalOpen(false)}
          onSubmit={handleCreateDeliveryOrder}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
          onUserChanged={(newUser) => setCurrentUser(newUser)}
        />
      )}

      <BottomStatusBar
        isConnected={isConnected}
        activeUsersCount={activeUsersCount}
        lastUpdatedUser={lastActivity.user}
        lastUpdatedTime={lastActivity.time}
      />
    </div>
  );
}
