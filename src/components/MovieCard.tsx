import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import '../App.css';
import { Movie } from '../App';

const ItemTypes = {
    MOVIE: 'movie',
};

interface MovieCardProps {
    movie: Movie;
    index: number;
    moveMovie: (fromIndex: number, toIndex: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, index, moveMovie }) => {
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

export default MovieCard;
