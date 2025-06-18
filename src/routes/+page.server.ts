// src/routes/+page.server.ts

import { fail } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';

// Basitlik adına, verileri sunucuda geçici olarak bir dizide tutuyoruz.
let todos: { id: string; text: string; completed: boolean }[] = [
    { id: uuidv4(), text: 'SvelteKit Form Eylemlerini Öğren', completed: false },
    { id: uuidv4(), text: 'Tailwind CSS ile tasarımı tamamla', completed: true },
    { id: uuidv4(), text: 'API entegrasyonunu planla', completed: false },
];

export function load() {
    return {
        todos: todos,
    };
}

export const actions = {
    // 'default' eylemini kaldırdık. Yerine 'addTodo' adında yeni bir eylem tanımlıyoruz.
    addTodo: async ({ request }: { request: Request }) => { // Artık 'default' değil, 'addTodo'
        const data = await request.formData();
        const newTodoText = data.get('newTodoText')?.toString();

        if (!newTodoText || newTodoText.trim() === '') {
            // Hata durumunda newTodoText'i geri gönderelim ki input'ta kalsın
            return fail(400, { newTodoText: newTodoText || '', missing: true });
        }

        todos = [...todos, { id: uuidv4(), text: newTodoText.trim(), completed: false }];

        // İşlem başarılı olduysa, formu sıfırlamak için `newTodoText`'i boş olarak döndürebiliriz
        return { success: true, newTodoText: '' };
    },

    // Diğer adlandırılmış eylemler aynı kalıyor
    toggleTodo: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const todoId = data.get('id')?.toString();

        if (!todoId) {
            return fail(400, { message: 'Todo ID gerekli' });
        }

        todos = todos.map(todo =>
            todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        );

        return { success: true };
    },

    deleteTodo: async ({ request }: { request: Request }) => {
        const data = await request.formData();
        const todoId = data.get('id')?.toString();

        if (!todoId) {
            return fail(400, { message: 'Todo ID gerekli' });
        }

        todos = todos.filter(todo => todo.id !== todoId);

        return { success: true };
    },

    clearCompleted: async () => {
        todos = todos.filter(todo => !todo.completed);
        return { success: true };
    }
};