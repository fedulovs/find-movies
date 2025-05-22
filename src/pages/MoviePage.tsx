import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, GlobalStyle } from '../styles';

const PageContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    width: 100vw;
    background: ${colors.container};
`;

const MovieDetailCard = styled.div`
    display: flex;
    gap: 2rem;
    background-color: ${colors.card};
    border-radius: 10px;
    box-shadow: 0 2px 8px #23223950;
    padding: 2rem 2.5rem;
    margin-top: 2.5rem;
    max-width: 900px;
    width: 94vw;

    @media (max-width: 700px) {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem 0.5rem;
        align-items: center;
    }
`;

const PosterContainer = styled.div`
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

const TopBar = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    max-width: 900px;
    margin-top: 2.2rem;
`;

const SimpleBackButton = styled.button`
    background: transparent;
    color: ${colors.fontPrimary};
    border: none;
    font-size: 1.04rem;
    cursor: pointer;
    padding: 0.1em 0.8em 0.1em 0.2em;
    border-radius: 6px;
    font-weight: 500;
    transition: color 0.18s;
    &:hover {
        color: ${colors.fontActive};
        background: #23223930;
    }
`;

const CenteredContent = styled(Content)`
    align-items: center;
    justify-content: center;
    text-align: center;
    min-height: 30vh;
`;

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

const MoviePage: React.FC = () => {
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
            <PageContainer>
                <TopBar>
                    <SimpleBackButton
                        type='button'
                        onClick={() => navigate(-1)}
                    >
                        &larr; Back
                    </SimpleBackButton>
                </TopBar>
                {error ? (
                    <CenteredContent>
                        <h3>{error}</h3>
                    </CenteredContent>
                ) : !movie ? (
                    <CenteredContent>Loading...</CenteredContent>
                ) : (
                    <MovieDetailCard>
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
                    </MovieDetailCard>
                )}
            </PageContainer>
        </>
    );
};

export default MoviePage;
