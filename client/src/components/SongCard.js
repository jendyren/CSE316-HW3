import React, { useContext, useState} from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { song, index } = props;
    const [draggedTo, setDraggedTo] = useState(false);
    
    let modalStatus = false;
    let cardClass = "list-card unselected-list-card";

    if (store.isModalActive) {
        console.log("Modal active!");
        modalStatus = true;
    }

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
        // let songIndex = event.target.id;
        // console.log(songIndex)    
        // songIndex = ("" + songIndex.substring("remove-song-".length));
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

    function handleDragStart(event){
        console.log("handleDragStart");
        event.dataTransfer.setData("song", event.target.id);
    }

    function handleDragOver(event){
        console.log("handleDragOver");
        event.preventDefault();
    }

    function handleDragEnter(event){
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event){
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event){
        console.log("inside handleDrop");
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.slice(target.id.indexOf("-") + 1, target.id.lastIndexOf("-"));
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.slice(sourceId.indexOf("-") + 1, sourceId.lastIndexOf("-"));

        console.log("Target Id: ");
        console.log(targetId);
        console.log("Source Id: ");
        console.log(sourceId);
        
        setDraggedTo(false);
        store.addMoveSongTransaction(sourceId, targetId);
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={handleClick}
            onDrop={handleDrop}
            draggable="true"
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
                disabled={modalStatus}
                onClick={handleDeleteSong}
                value={"\u2715"}
            />
            
        </div>
    );
}

export default SongCard;