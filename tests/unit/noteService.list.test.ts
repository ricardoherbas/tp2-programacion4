import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

// 🟢 EJERCICIO 2 — listNotes() ya estaba implementado.
// Sembramos los datos con repo.create() y no con service.createNote():
// así este test no depende del Ejercicio 1.

describe('NoteService - listNotes (Ejercicio 2)', () => {
  let service: NoteServiceImpl;
  let repo: SqliteNoteRepository;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve una lista vacía cuando no hay notas', () => {
    expect(service.listNotes()).toEqual([]);
  });

  it('devuelve todas las notas cargadas', () => {
    repo.create({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    repo.create({ title: 'Llamar al dentista', content: 'Turno de control' });

    const notes = service.listNotes();

    expect(notes).toHaveLength(2);
    expect(notes.map((n) => n.title)).toEqual(['Comprar pan', 'Llamar al dentista']);
  });

  it('devuelve las notas con todos los campos del contrato', () => {
    repo.create({ title: 'Comprar pan', content: 'Antes de las 20hs', pinned: true });

    const [note] = service.listNotes();

    expect(note).toMatchObject({
      title: 'Comprar pan',
      content: 'Antes de las 20hs',
      pinned: true
    });
    expect(note.id).toBeTypeOf('number');
    expect(note.createdAt).toBeTypeOf('string');
    expect(note.updatedAt).toBeTypeOf('string');
  });

  it('refleja las notas agregadas después de una primera lectura', () => {
    expect(service.listNotes()).toHaveLength(0);

    repo.create({ title: 'A', content: 'B' });

    expect(service.listNotes()).toHaveLength(1);
  });
});