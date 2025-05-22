import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles';
import { lazy, Suspense } from 'react';

const SearchPage = lazy(() => import('./pages/SearchPage'));
const MoviePage = lazy(() => import('./pages/MoviePage'));

const App = () => (
    <>
        <GlobalStyle />
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path='/' element={<SearchPage />} />
                    <Route path='/movie/:imdbID' element={<MoviePage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </>
);

export default App;
