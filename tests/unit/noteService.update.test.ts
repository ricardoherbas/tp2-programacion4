import { describe, it, expect, beforeEach } from 'vitest';

import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - updateNote (Ejercicio 4)', () => {
  let service: NoteServiceImpl;
  let repo: SqliteNoteRepository;

  beforeEach(() => {
    const db = createDb(':memory:');
    repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('actualiza solamente el title y conserva el content', () => {
    const note = repo.create({
      title: 'Título original',
      content: 'Contenido original',
    });

    const updated = service.updateNote(note.id, {
      title: 'Título nuevo',
    });

    expect(updated).toBeDefined();
    expect(updated!.title).toBe('Título nuevo');
    expect(updated!.content).toBe('Contenido original');
  });

  it('actualiza solamente el content y conserva el title', () => {
    const note = repo.create({
      title: 'Título original',
      content: 'Contenido original',
    });

    const updated = service.updateNote(note.id, {
      content: 'Contenido nuevo',
    });

    expect(updated).toBeDefined();
    expect(updated!.title).toBe('Título original');
    expect(updated!.content).toBe('Contenido nuevo');
  });

  it('devuelve undefined si la nota no existe', () => {
    const updated = service.updateNote(999, {
      title: 'Título nuevo',
    });

    expect(updated).toBeUndefined();
  });
});