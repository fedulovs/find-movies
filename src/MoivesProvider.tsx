import { useState, ReactNode, useEffect } from 'react';
import { MoviesContext } from './MoviesContext';
import { Movie } from './App';

export const MoviesProvider = ({ children }: { children: ReactNode }) => {
    const [movies, setMovies] = useState<Movie[]>(() => {
        const savedMovies = localStorage.getItem('movies');
        return savedMovies ? JSON.parse(savedMovies) : [];
    });

    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>(() => {
        const savedFavorites = localStorage.getItem('favoriteMovies');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('movies', JSON.stringify(movies));
    }, [movies]);

    useEffect(() => {
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    }, [favoriteMovies]);

    const contextValue = {
        movies,
        favoriteMovies,
        setMovies,
        setFavoriteMovies,
    };

    return (
        <MoviesContext.Provider value={contextValue}>
            {children}
        </MoviesContext.Provider>
    );
};
