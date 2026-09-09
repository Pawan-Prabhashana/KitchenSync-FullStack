import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api, ApiError } from './api';

/** Build a minimal fetch Response stand-in matching what request() consumes. */
function fakeResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    text: async () => (body === undefined ? '' : JSON.stringify(body))
  } as Response);
}

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('stores the token on login and attaches it as a Bearer header on later calls', async () => {
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(fakeResponse(200, { token: 'tok123', user: { id: 'u1', name: 'Priya', role: 'chef', email: 'p@k.com' } }))
      .mockReturnValueOnce(fakeResponse(200, { user: { id: 'u1', name: 'Priya', role: 'chef', email: 'p@k.com' } }));
    vi.stubGlobal('fetch', fetchMock);

    await api.login('p@k.com', 'kitchen123');
    await api.me();

    // second call (me) must carry the token from login
    const meHeaders = (fetchMock.mock.calls[1][1] as RequestInit).headers as Record<string, string>;
    expect(meHeaders.Authorization).toBe('Bearer tok123');
    expect(localStorage.getItem('kitchensync_token')).toBe('tok123');
  });

  it('throws a typed ApiError with status + code on a non-2xx response', async () => {
    const fetchMock = vi
      .fn()
      .mockReturnValue(fakeResponse(401, { error: { code: 'UNAUTHORIZED', message: 'Invalid email or password' } }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(api.login('p@k.com', 'wrong')).rejects.toMatchObject({
      status: 401,
      code: 'UNAUTHORIZED'
    });
    await expect(api.login('p@k.com', 'wrong')).rejects.toBeInstanceOf(ApiError);
  });

  it('surfaces a network failure as an ApiError with status 0 (isNetwork)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));
    let caught: unknown;
    try {
      await api.listUsers();
    } catch (e) {
      caught = e;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect((caught as ApiError).isNetwork).toBe(true);
  });
});
