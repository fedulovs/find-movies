import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
    colors,
    FullPage,
    GlobalStyle,
    TopBar,
    BackButton,
    Card,
    CenterBox,
} from '../styles';

interface MovieType {
    Poster: string;
    Title: string;
    Year: string;
    Genre: string;
    Director: string;
    Actors: string;
    Plot: string;
    imdbID: string;
    Runtime: string;
    Rated: string;
    Released: string;
    [key: string]: unknown;
}

const PosterContainer = styled.div`
    flex-shrink: 0;
    min-width: 230px;
    width: 300px;
    max-width: 300px;
    height: 450px;
    overflow: hidden;
    border-radius: 12px;
    background: #222;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background: #fff;
        border-radius: 12px;
    }

    @media (max-width: 700px) {
        width: 90vw;
        max-width: 350px;
        height: auto;
    }
`;

const Content = styled.div`
    color: ${colors.fontPrimary};
    display: flex;
    flex-direction: column;
    max-width: 550px;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 0.7rem 0;
    color: ${colors.fontPrimary};
    text-shadow: 0 1px 8px #0002;
`;

const Details = styled.div`
    font-size: 1rem;
    color: ${colors.fontSecondary};
    margin-bottom: 1.2rem;
    line-height: 1.5;
    gap: 4px;
    display: flex;
    flex-direction: column;

    span {
        font-weight: 600;
        color: ${colors.fontPrimary};
    }
`;

const Plot = styled.p`
    font-size: 1.08rem;
    color: ${colors.fontPrimary};
    margin-top: 1.25rem;
    line-height: 1.7;
`;

const Movie: React.FC = () => {
    const { imdbID } = useParams<{ imdbID: string }>();
    const [movie, setMovie] = useState<MovieType | null>(null);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const apiKey: string = import.meta.env.VITE_API_KEY as string;

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setError(null);
                const response = await axios.get(
                    `http://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`
                );
                if (response.data && response.data.Response !== 'False') {
                    setMovie(response.data);
                } else {
                    setError('Movie not found');
                }
            } catch {
                setError('Failed to fetch movie!');
            }
        };
        fetchMovie();
    }, [imdbID, apiKey]);

    return (
        <>
            <GlobalStyle />
            <FullPage>
                <TopBar>
                    <BackButton onClick={() => navigate(-1)}>
                        &larr; Back
                    </BackButton>
                </TopBar>
                <CenterBox>
                    {error ? (
                        <Content>
                            <h3>{error}</h3>
                        </Content>
                    ) : !movie ? (
                        <Content>Loading...</Content>
                    ) : (
                        <Card>
                            <PosterContainer>
                                <img
                                    src={
                                        movie.Poster !== 'N/A'
                                            ? movie.Poster
                                            : 'https://via.placeholder.com/300x450?text=No+Image'
                                    }
                                    alt={movie.Title}
                                />
                            </PosterContainer>
                            <Content>
                                <Title>{movie.Title}</Title>
                                <Details>
                                    <div>
                                        <span>Year:</span> {movie.Year} &bull;{' '}
                                        <span>Rated:</span> {movie.Rated} &bull;{' '}
                                        <span>Runtime:</span> {movie.Runtime}
                                    </div>
                                    <div>
                                        <span>Genre:</span> {movie.Genre}
                                    </div>
                                    <div>
                                        <span>Director:</span> {movie.Director}
                                    </div>
                                    <div>
                                        <span>Actors:</span> {movie.Actors}
                                    </div>
                                    <div>
                                        <span>Released:</span> {movie.Released}
                                    </div>
                                </Details>
                                <Plot>{movie.Plot}</Plot>
                            </Content>
                        </Card>
                    )}
                </CenterBox>
            </FullPage>
        </>
    );
};

export default Movie;
