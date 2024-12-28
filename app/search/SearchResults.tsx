import React from 'react';

interface Artist {
    id: number;
    name: string;
    img1v1Url: string;
}

interface Album {
    id: number;
    name: string;
    picId: number;
}

interface Song {
    id: number;
    name: string;
    artists: Artist[];
    album: Album;
    duration: number;
}

interface SearchResultsProps {
    songs: Song[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ songs }) => {
    return (
        <div>
            <h1>Search Results</h1>
            <ul>
                {songs.map(song => (
                    <li key={song.id}>
                        <h2>{song.name}</h2>
                        <p>Artists: {song.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Album: {song.album.name}</p>
                        <p>Duration: {song.duration} ms</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchResults; 