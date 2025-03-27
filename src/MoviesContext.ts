import { createContext, useContext } from 'react';
import { Movie } from './App';

interface MoviesContextType {
    movies: Movie[];
    favoriteMovies: Movie[];
    setMovies: (movies: Movie[]) => void;
    setFavoriteMovies: (movies: Movie[]) => void;
}

const defaultValue: MoviesContextType = {
    movies: [],
    favoriteMovies: [],
    setMovies: () => {},
    setFavoriteMovies: () => {},
};

export const MoviesContext = createContext<MoviesContextType>(defaultValue);

export function useMoviesContext() {
    const contextMovies = useContext(MoviesContext);

    if (!contextMovies) {
        throw new Error('useMoviesContext must be used with a MoviesContext');
    }

    return contextMovies;
}
