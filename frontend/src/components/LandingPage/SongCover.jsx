import React from 'react';

export default function SongCover({ albumCover, top, left, playlist }) {
    let classString = playlist ? 'cover absolute playlistCover' : 'cover absolute invisibleCover'
    return (
        <div className={classString}
            style={{ top: top, left: left }}>
            <img src={albumCover} alt="" />
        </div>
    );
}
