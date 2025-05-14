import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GlobalStyle } from './styles';
import SearchPage from './pages/SearchPage';
import MoviePage from './pages/MoviePage';

function App() {
    return (
        <>
            <GlobalStyle />
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<SearchPage />} />
                    <Route path='/movie/:imdbID' element={<MoviePage />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
