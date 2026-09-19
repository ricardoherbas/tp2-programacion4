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

test('caso feliz: crear, leer, modificar y borrar una nota de punta a punta', async ({
  request
}) => {
  // 1) Crear
  const createRes = await request.post('/notes', {
    data: { title: 'Estudiar para el final', content: 'Repasar TDD' }
  });
  expect(createRes.status()).toBe(201);
  const created = await createRes.json();
  expect(created).toMatchObject({
    title: 'Estudiar para el final',
    content: 'Repasar TDD',
    pinned: false
  });

  // 2) Aparece en el listado (junto con las 2 sembradas)
  const listRes = await request.get('/notes');
  expect(listRes.status()).toBe(200);
  const list = await listRes.json();
  expect(list).toHaveLength(3);
  expect(list.map((n: any) => n.id)).toContain(created.id);

  // 3) Se puede obtener por id
  const getRes = await request.get(`/notes/${created.id}`);
  expect(getRes.status()).toBe(200);
  expect((await getRes.json()).title).toBe('Estudiar para el final');

  // 4) Se puede modificar parcialmente (solo pinned, el resto no cambia)
  const patchRes = await request.patch(`/notes/${created.id}`, {
    data: { pinned: true }
  });
  expect(patchRes.status()).toBe(200);
  const patched = await patchRes.json();
  expect(patched.pinned).toBe(true);
  expect(patched.title).toBe('Estudiar para el final'); // no cambió

  // 5) Se puede borrar, y después ya no aparece
  const deleteRes = await request.delete(`/notes/${created.id}`);
  expect(deleteRes.status()).toBe(204);

  const getAfterDeleteRes = await request.get(`/notes/${created.id}`);
  expect(getAfterDeleteRes.status()).toBe(404);
});

test('caso de error: pedir una nota con un id que no existe devuelve 404', async ({
  request
}) => {
  const res = await request.get('/notes/999999');

  expect(res.status()).toBe(404);
  expect(await res.json()).toEqual({ error: 'NotFound' });
});