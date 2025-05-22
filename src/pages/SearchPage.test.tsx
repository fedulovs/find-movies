import { render, screen } from '@testing-library/react';
import { test, expect, vi, beforeEach } from 'vitest';
import SearchPage from './SearchPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MoviePage from './MoviePage';
import axios from 'axios';

// Unit test
vi.mock('../context/MoviesContext', () => ({
    useMoviesContext: () => ({
        movies: [],
        setMovies: vi.fn(),
    }),
}));
vi.mock('../components/SearchBar', () => ({
    default: ({
        onResult,
    }: {
        onResult?: (found: boolean, lastSearch: string) => void;
    }) => (
        <button onClick={() => onResult && onResult(false, 'test response')}>
            MockSearchBar
        </button>
    ),
}));
vi.mock('../components/MovieCard', () => ({
    default: () => <div data-testid='movie-card'>MockMovieCard</div>,
}));

test('shows "No results found" when appropriate', async () => {
    render(<SearchPage />);
    screen.getByText('MockSearchBar').click();

    expect(
        await screen.findByText('No results found for test response')
    ).toBeInTheDocument();
});

// Integration test

// Mock axios for all tests in this file
vi.mock('axios');
const mockedAxiosGet = vi.mocked(axios.get);

// Set fake env
vi.stubEnv('VITE_API_KEY', 'fakekey');

const mockMovie = {
    Poster: 'http://test/poster.jpg',
    Title: 'Fake Movie',
    Year: '2021',
    Genre: 'Action',
    Director: 'Director Name',
    Actors: 'Actor One, Actor Two',
    Plot: 'A dramatic test.',
    imdbID: 'tt999999',
    Runtime: '100 min',
    Rated: 'PG-13',
    Released: '2021-05-05',
    Response: 'True',
};

beforeEach(() => {
    vi.resetAllMocks();
});

test('renders loading and then movie details on success', async () => {
    // Arrange: axios returns a successful response
    mockedAxiosGet.mockResolvedValue({ data: mockMovie });

    // Render MoviePage at /movie/tt999999 to fill useParams
    render(
        <MemoryRouter initialEntries={['/movie/tt999999']}>
            <Routes>
                <Route path='/movie/:imdbID' element={<MoviePage />} />
            </Routes>
        </MemoryRouter>
    );

    // Initial loading state
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for movie title to appear
    expect(await screen.findByText('Fake Movie')).toBeInTheDocument();

    expect(screen.getByText(/A dramatic test./i)).toBeInTheDocument();
    expect(screen.getByText(/Director Name/i)).toBeInTheDocument();

    // Poster image exists
    expect(screen.getByAltText('Fake Movie')).toHaveAttribute(
        'src',
        'http://test/poster.jpg'
    );
});

test('renders error message when movie not found', async () => {
    // Simulate OMDB "not found"
    mockedAxiosGet.mockResolvedValue({ data: { Response: 'False' } });

    render(
        <MemoryRouter initialEntries={['/movie/tt999999']}>
            <Routes>
                <Route path='/movie/:imdbID' element={<MoviePage />} />
            </Routes>
        </MemoryRouter>
    );

    // Loading while fetching
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    // Wait for error
    expect(await screen.findByText(/Movie not found/i)).toBeInTheDocument();
});

test('renders network failure message when axios throws', async () => {
    // Simulate axios network error
    mockedAxiosGet.mockRejectedValue(new Error('Network error'));

    render(
        <MemoryRouter initialEntries={['/movie/tt1234567']}>
            <Routes>
                <Route path='/movie/:imdbID' element={<MoviePage />} />
            </Routes>
        </MemoryRouter>
    );

    // Wait for generic "fail" error
    expect(
        await screen.findByText('Failed to fetch movie!')
    ).toBeInTheDocument();
});
