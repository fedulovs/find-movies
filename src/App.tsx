import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { useMoviesContext } from './MoviesContext';
import MovieCard from './components/MovieCard';

export interface Movie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

const App: React.FC = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY;
    const { movies, setMovies } = useMoviesContext();
    const [newSearch, setNewSearch] = useState<string>('');
    const [lastSearch, setLastSearch] = useState<string>('');
    const [requestError, setRequestError] = useState<boolean>(false);
    const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

    const fetchMovies = async (query: string) => {
        try {
            const response = await axios.get(
                `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
            );
            if (response.data && response.data.Search) {
                setMovies(response.data.Search);
                setNoResultsFound(false);
                setRequestError(false);
            } else {
                setLastSearch(newSearch);
                setMovies([]);
                setNoResultsFound(true);
            }
        } catch (error) {
            setRequestError(true);
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
        fetchMovies(newSearch);
    };

    const moveMovie = (fromIndex: number, toIndex: number) => {
        const updatedMovies = [...movies];
        const [movedMovie] = updatedMovies.splice(fromIndex, 1);
        updatedMovies.splice(toIndex, 0, movedMovie);
        setMovies(updatedMovies);
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
                {requestError ? (
                    <h3>Something went wrong</h3>
                ) : noResultsFound ? (
                    <h3>No results found for {lastSearch}</h3>
                ) : (
                    movies.map((movie, index) => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            index={index}
                            moveMovie={moveMovie}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;
