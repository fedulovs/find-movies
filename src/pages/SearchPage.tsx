import React, { useState } from 'react';
import styled from 'styled-components';
import { useMoviesContext } from '../MoviesContext';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { colors } from '../styles';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background: ${colors.container};
`;

const MoviesContainer = styled.div`
    max-width: 70vw;
    margin-top: 20px;
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    justify-items: center;
`;

const Message = styled.h3`
    color: ${colors.fontPrimary};
    margin-top: 2rem;
`;

const SearchPage: React.FC = () => {
    const { movies, setMovies } = useMoviesContext();
    const [requestError, setRequestError] = useState(false);
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [lastSearch, setLastSearch] = useState('');

    const handleSearchResult = (found: boolean, last: string) => {
        setRequestError(!found && last === '');
        setNoResultsFound(!found && last !== '');
        setLastSearch(last);
    };
    const moveMovie = (fromIndex: number, toIndex: number) => {
        const updatedMovies = [...movies];
        const [movedMovie] = updatedMovies.splice(fromIndex, 1);
        updatedMovies.splice(toIndex, 0, movedMovie);
        setMovies(updatedMovies);
    };

    return (
        <PageContainer>
            <SearchBar onResult={handleSearchResult} />
            {requestError ? (
                <Message>Something went wrong</Message>
            ) : noResultsFound ? (
                <Message>No results found for {lastSearch}</Message>
            ) : (
                <MoviesContainer>
                    {movies.map((movie, index) => (
                        <MovieCard
                            key={movie.imdbID}
                            movie={movie}
                            index={index}
                            moveMovie={moveMovie}
                        />
                    ))}
                </MoviesContainer>
            )}
        </PageContainer>
    );
};

export default SearchPage;
