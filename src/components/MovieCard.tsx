import React, { useState } from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { useNavigate } from 'react-router-dom';

const MovieCardWrapper = styled.div`
    width: 180px;
    height: 360px;
    background-color: ${colors.card};
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    box-shadow: 0 2px 8px #23223950;
    transition: box-shadow 0.2s;
    &:hover {
        box-shadow: 0 0 20px ${colors.fontActive};
    }
    &.dragging {
        opacity: 0.5;
    }
`;

const MoviePosterContainer = styled.div`
    width: 100%;
    height: 70%;
    background: #18141a;
    overflow: hidden;
`;
const MoviePosterImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
const MovieDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-height: 30%;
    font-size: 14px;
    padding: 8px;
    overflow: hidden;
`;
const MovieTitle = styled.h2`
    display: inline;
    text-align: start;
    font-weight: 700;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
    font-size: 1.07rem;
    color: ${colors.fontPrimary};
`;
const MovieType = styled.span`
    color: ${colors.fontSecondary};
    margin: 4px 0 0 0;
    font-size: 0.96em;
`;

interface Movie {
    Poster: string;
    Title: string;
    Type: string;
    Year: string;
    imdbID: string;
}
interface MovieCardProps {
    movie: Movie;
    index: number;
    moveMovie?: (fromIndex: number, toIndex: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index, moveMovie }) => {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('movieIndex', String(index));
    };
    const handleDragEnd = () => setIsDragging(false);
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (!moveMovie) return;
        const fromIndex = Number(e.dataTransfer.getData('movieIndex'));
        if (fromIndex !== index) moveMovie(fromIndex, index);
    };
    const handleClick = () => {
        if (!isDragging) {
            navigate(`/movie/${movie.imdbID}`);
        }
    };

    return (
        <MovieCardWrapper
            className={isDragging ? 'dragging' : ''}
            onClick={handleClick}
            draggable={!!moveMovie}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <MoviePosterContainer>
                <MoviePosterImage src={movie.Poster} alt={movie.Title} />
            </MoviePosterContainer>
            <MovieDetails>
                <MovieTitle>{movie.Title}</MovieTitle>
                <MovieType>
                    {movie.Type} &bull; {movie.Year}
                </MovieType>
            </MovieDetails>
        </MovieCardWrapper>
    );
};

export default MovieCard;
