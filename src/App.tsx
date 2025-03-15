import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

interface Movie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}

const App = () => {
    const apiKey: string = '123';

    const [movies, setMovies] = useState<Movie[]>([]);
    const [newSearch, setNewSearch] = useState<string>('');

    const fetchMovies = async (query: string) => {
        try {
            const response = await axios.get(
                `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
            );
            if (response.data && response.data.Search) {
                setMovies(response.data.Search);
                console.log(response);
            } else {
                setMovies([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSearch(e.target.value);
    };

    const searchMovies = () => {
        fetchMovies(newSearch);
    };

    return (
        <div className='page-container'>
            <div className='input-container'>
                <input
                    className='add-todo-input'
                    type='text'
                    value={newSearch}
                    onChange={onInputChange}
                    placeholder='Search'
                />
                <button className='add-todo-button' onClick={searchMovies}>
                    Search
                </button>
            </div>
            <div className='movies-container'>
                {movies.map((movie, index) => (
                    <div className='movie-card' key={index}>
                        <div className='movie-poster-container'>
                            <img
                                className='movie-poster-image'
                                src={movie.Poster}
                            ></img>
                        </div>
                        <div className='movie-details'>
                            <p className='movie-title'>{movie.Title}</p>
                            <p className='movie-type'>{movie.Type}</p>
                        </div>
                        <button className='favorite-button'>★</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default App;
