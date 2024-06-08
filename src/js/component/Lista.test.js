import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Lista from './Lista';
import '@testing-library/jest-dom/extend-expect';

beforeEach(() => {
    // Mocking the fetch API
    global.fetch = jest.fn((url, options) => {
        if (options && options.method === "POST") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ result: "ok" })
            });
        }

        if (options && options.method === "PUT") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ result: "ok" })
            });
        }

        if (options && options.method === "DELETE") {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ result: "ok" })
            });
        }

        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([])
        });
    });
});

test('Verifica que el usuario se ha creado correctamente', async () => {
    render(<Lista />);
    
    // Simulate componentDidMount
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('https://playground.4geeks.com/todo/users/GeFernando', expect.any(Object));
    });
    
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    
    // Simulate adding a task
    const input = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(input, { target: { value: 'Nueva tarea' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://playground.4geeks.com/todo/todos/'),
            expect.objectContaining({
                method: 'PUT'
            })
        );
    });

    // Simulate clicking the delete all button
    const deleteButton = screen.getByText('Delete All Tasks');
    fireEvent.click(deleteButton);

    await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('https://playground.4geeks.com/todo/todos/'),
            expect.objectContaining({
                method: 'DELETE'
            })
        );
    });
});

afterEach(() => {
    jest.resetAllMocks();
});


