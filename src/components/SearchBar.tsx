import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useMoviesContext } from '../MoviesContext';
import axios from 'axios';
import { colors, fonts } from '../styles';

const SearchContainer = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    background-color: ${colors.card};
    padding: 8px;
`;

const SearchInput = styled.input`
    max-width: 600px;
    flex-grow: 1;
    padding: 4px;
    border-radius: 6px;
    font-family: ${fonts.mono};
    border: none;
    font-size: 1rem;
    color: #181c21;
    background: #fff;
    max-height: 30px;
`;

const SearchButton = styled.button`
    width: 30px;
    padding: 4px 2px 2px 4px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    align-items: center;
    font-size: 1.2rem;
    color: ${colors.fontPrimary};
    background: transparent;
    height: 30px;
    max-height: 30px;
    &:hover {
        color: ${colors.fontActive};
    }
`;

type SearchBarProps = {
    onResult?: (result: boolean, lastSearch: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onResult }) => {
    const apiKey: string = import.meta.env.VITE_API_KEY as string;

    const { setMovies } = useMoviesContext();
    const [newSearch, setNewSearch] = useState<string>('');
    const [, setRequestError] = useState<boolean>(false);
    const [, setLastSearch] = useState<string>('');
    const [, setNoResultsFound] = useState<boolean>(false);

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchMovies = async (query: string) => {
        if (!query.trim()) {
            setMovies([]);
            setNoResultsFound(false);
            setRequestError(false);
            onResult?.(true, '');
            return;
        }
        try {
            setRequestError(false);
            setNoResultsFound(false);
            const response = await axios.get(
                `http://www.omdbapi.com/?s=${query}&apikey=${apiKey}`
            );
            if (response.data && response.data.Search) {
                setMovies(response.data.Search);
                setNoResultsFound(false);
                setRequestError(false);
                onResult?.(true, '');
            } else {
                setLastSearch(query);
                setMovies([]);
                setNoResultsFound(true);
                setRequestError(false);
                onResult?.(false, query);
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setRequestError(true);
            setNoResultsFound(false);
            setMovies([]);
            onResult?.(false, query);
        }
    };

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (newSearch.trim()) {
            debounceRef.current = setTimeout(() => {
                fetchMovies(newSearch);
            }, 1000);
        }

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line
    }, [newSearch]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewSearch(e.target.value);

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            fetchMovies(newSearch);
        }
    };

    const onClickSearch = () => fetchMovies(newSearch);

    return (
        <SearchContainer>
            <SearchInput
                type='text'
                value={newSearch}
                onKeyDown={handleKeyPress}
                onChange={onInputChange}
                placeholder='Search'
                aria-label='Search for movies'
            />
            <SearchButton onClick={onClickSearch} title='Search'>
                🔍
            </SearchButton>
        </SearchContainer>
    );
};

export default SearchBar;
