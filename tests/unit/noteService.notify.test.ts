import { describe, it, expect, beforeEach} from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';
import {vi} from 'vitest' ;
import { notify } from '../../src/services/notificationService';

vi.mock('../../src/services/notificationService', () => ({
    notify: vi.fn(),
}));

describe('NoteService - notificacion al fijar (ejercicio 6)', () => {
    let service: NoteServiceImpl;

    beforeEach(() => {
        vi.clearAllMocks()
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });

    it('llama a notify cuando la nota se crea con pinned: true', () => {
  //  instrucciones del test
        const note = service.createNote({ title: 'A', content: 'B', pinned: true });
        expect(notify).toHaveBeenCalledWith(note);


    });

    it('NO llama a notify cuando la nota se crea con pinned: false', () => {
  //  instrucciones del test
        const note = service.createNote({ title: 'A', content: 'B', pinned: false });
        expect(notify).not.toHaveBeenCalled();
    });
    
});