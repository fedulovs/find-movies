import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useMoviesContext } from './MoviesContext';

export interface Movie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

const App = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY;

    // Destructure from context
    const { movies, favoriteMovies, setMovies, setFavoriteMovies } =
        useMoviesContext();

    const [newSearch, setNewSearch] = useState<string>('');
    const [lastSearch, setLastSearch] = useState<string>('');
    const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

    const fetchMovies = async (query: string) => {
        try {
            const response = await axios.get(
                `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
            );
            if (response.data && response.data.Search) {
                // Save movies to context
                setMovies(response.data.Search);
                setNoResultsFound(false);
            } else {
                setMovies([]);
                setNoResultsFound(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSearch(e.target.value);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    };

    const searchMovies = () => {
        setLastSearch(newSearch);
        fetchMovies(newSearch);
    };

    const favoriteTheMovie = (index: number) => {
        const selectedMovie = movies[index];
        const alreadyFavorited = favoriteMovies.some(
            (movie) => movie.imdbID === selectedMovie.imdbID
        );

        if (!alreadyFavorited) {
            setFavoriteMovies([...favoriteMovies, selectedMovie]);
        } else {
            console.log('Movie already in favorites');
        }
    };

    return (
        <div className='page-container'>
            <div className='search-container'>
                <input
                    className='search-input'
                    type='text'
                    value={newSearch}
                    onKeyDown={handleKeyPress}
                    onChange={onInputChange}
                    placeholder='Search'
                />
                <button className='search-button' onClick={searchMovies}>
                    🔍
                </button>
            </div>
            <div className='movies-container'>
                {noResultsFound ? (
                    <h3>No results found for {lastSearch}</h3>
                ) : (
                    <>
                        {movies.map((movie, index) => (
                            <div className='movie-card' key={index}>
                                <div className='movie-poster-container'>
                                    <img
                                        className='movie-poster-image'
                                        src={movie.Poster}
                                        alt={movie.Title}
                                    />
                                </div>
                                <div className='movie-details'>
                                    <p className='movie-title'>{movie.Title}</p>
                                    <p className='movie-type'>{movie.Type}</p>
                                </div>
                                <button
                                    className='favorite-button'
                                    onClick={() => favoriteTheMovie(index)}
                                >
                                    ★
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {favoriteMovies.map((favoriteMovie) => favoriteMovie.Title)}
            </div>
        </div>
    );
};

export default App;
