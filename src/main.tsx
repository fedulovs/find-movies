import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { MoviesProvider } from './MoviesProvider.tsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

createRoot(document.getElementById('root')!).render(
    <DndProvider backend={HTML5Backend}>
        <StrictMode>
            <MoviesProvider>
                <App />
            </MoviesProvider>
        </StrictMode>
    </DndProvider>
);
