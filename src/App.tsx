import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
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

const ItemTypes = {
    MOVIE: 'movie',
};

interface DraggableMovieProps {
    movie: Movie;
    index: number;
    moveMovie: (fromIndex: number, toIndex: number) => void;
}

const DraggableMovie: React.FC<DraggableMovieProps> = ({
    movie,
    index,
    moveMovie,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [, drag] = useDrag({
        type: ItemTypes.MOVIE,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemTypes.MOVIE,
        hover: (item: { index: number }) => {
            if (item.index !== index) {
                moveMovie(item.index, index);
                item.index = index;
            }
        },
    });

    drag(drop(ref));

    return (
        <div ref={ref} className='movie-card'>
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
        </div>
    );
};

const App: React.FC = () => {
    const apiKey: string = import.meta.env.VITE_API_KEY;
    const { movies, setMovies } = useMoviesContext();
    const [newSearch, setNewSearch] = useState<string>('');
    const [lastSearch, setLastSearch] = useState<string>('');
    const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

    const fetchMovies = async (query: string) => {
        try {
            const response = await axios.get(
                `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
            );
            if (response.data && response.data.Search) {
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
                {noResultsFound ? (
                    <h3>No results found for {lastSearch}</h3>
                ) : (
                    movies.map((movie, index) => (
                        <DraggableMovie
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
