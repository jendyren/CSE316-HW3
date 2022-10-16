import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import EditSongModal from './EditSongModal.js'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    

    let cardClass = "list-card unselected-list-card";
    function handleClick(event){
        if (event.detail === 1) {
        }
        else if (event.detail === 2) {
            console.log("Inside handleClick()");
            // console.log(store.currentList);
            event.stopPropagation();
            console.log("DoubleClick");
            let songIndex = event.target.id;
            
            
            songIndex = ("" + songIndex).slice(songIndex.indexOf("-") + 1, songIndex.lastIndexOf("-"));
            console.log(songIndex);

            
            let songToEditInfo = {
                songIndex : songIndex,
                playlist : store.currentList,
                song : song, 
                // editStatus : true
            }
            store.markEditSong(songToEditInfo);
        }
    }

    function handleDeleteSong(event){
        console.log("Calling markDeleteSong");
        let songIndex = event.target.id;
        // console.log(songIndex)    
        songIndex = ("" + songIndex.substring("remove-song-".length));
        // console.log(songIndex);
        // console.log(index);
        

        let songToDeleteInfo = {
            songIndex : index,
            playlist : store.currentList,
            song : store.currentList.songs[index]
            // editStatus : true
        }
        // console.log(songToDeleteInfo);
        store.markDeleteSong(songToDeleteInfo);
    }
    

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            onClick={handleClick}
            className={cardClass}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
            
        </div>
    );
}

export default SongCard;