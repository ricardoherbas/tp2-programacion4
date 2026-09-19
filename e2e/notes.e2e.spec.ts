import { test, expect } from '@playwright/test';
import { resetAndSeed } from './helpers';

// EJERCICIO 7 — flujo E2E completo, contra el servidor real (Playwright
// habla por HTTP, no importa nada de src/ directamente).
//
// resetAndSeed() deja la base con 2 notas fijas antes de cada test:
//  - "Comprar pan" (pinned: false)
//  - "Llamar al dentista" (pinned: true)

test.beforeEach(async ({ request, baseURL }) => {
  await resetAndSeed(baseURL!);
});

test('caso de error: pedir una nota con un id que no existe devuelve 404', async ({
  request
}) => {
  const res = await request.get('/notes/999999');

  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'NotFound' });
});