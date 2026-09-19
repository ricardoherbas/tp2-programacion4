import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

// 🔴🟢 EJERCICIO 3 — ciclo completo.
// Este archivo se commitea SOLO (en rojo), antes de tocar NoteService.

describe('NoteService - getNote (Ejercicio 3)', () => {
  let service: NoteServiceImpl;
  let repo: SqliteNoteRepository;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve la nota correspondiente a un id existente', () => {
    const creada = repo.create({ title: 'Comprar pan', content: 'Antes de las 20hs' });

    const note = service.getNote(creada.id);

    expect(note).toBeDefined();
    expect(note?.id).toBe(creada.id);
    expect(note?.title).toBe('Comprar pan');
    expect(note?.content).toBe('Antes de las 20hs');
    expect(note?.pinned).toBe(false);
  });

  it('devuelve undefined si el id no existe', () => {
    expect(service.getNote(9999)).toBeUndefined();
  });

  it('devuelve undefined cuando la base está vacía', () => {
    expect(service.getNote(1)).toBeUndefined();
  });

  it('devuelve la nota pedida y no otra cuando hay varias', () => {
    repo.create({ title: 'Primera', content: 'Uno' });
    const segunda = repo.create({ title: 'Segunda', content: 'Dos' });
    repo.create({ title: 'Tercera', content: 'Tres' });

    expect(service.getNote(segunda.id)?.title).toBe('Segunda');
  });

  it('devuelve undefined para una nota que fue eliminada', () => {
    const creada = repo.create({ title: 'Efímera', content: 'Se borra' });
    repo.delete(creada.id);

    expect(service.getNote(creada.id)).toBeUndefined();
  });
});