import React, {useContext, useRef} from 'react';
import { GlobalStoreContext } from '../store'

function EditSongModal() {
    const { store } = useContext(GlobalStoreContext);
    const songTitleRef = useRef(null);
    const songArtistRef = useRef(null);
    const songYoutubeIdRef = useRef(null);
    //document.getElementById()
    //{refName}

    console.log("Inside handleEditSongModal() ");
    
    //console.log(store.currentList);
    let oldSongDetails;
    if (store.currentList){
        // console.log("---- playlist before checking if songMarkedForEdit ---")
        // console.log(store.currentList);
        if(store.songMarkedForEdit){
            oldSongDetails = {
                // playlist: store.currentList,
                // id : store.songMarkedForEdit._id,
                title : store.songMarkedForEdit.title,
                artist : store.songMarkedForEdit.artist,
                youTubeId : store.songMarkedForEdit.youTubeId};
                console.log("---- playlist after checking if songMarkedForEdit ---")
                console.log(store.currentList);
        }
        
    }

    if(oldSongDetails){
        // console.log("AYOOOOO");
        songTitleRef.current.value = oldSongDetails.title;
        songArtistRef.current.value = oldSongDetails.artist;
        songYoutubeIdRef.current.value = oldSongDetails.youTubeId;
    }

    function handleEditSong(){
        // console.log("inside handleEditSong");
        // console.log(songTitleRef.current.value);
        // console.log(songArtistRef.current.value);
        // console.log(songYoutubeIdRef.current.value);
        if(store.currentList){
            let newSongDetails = {
                // id: oldSongDetails.id,
                title: songTitleRef.current.value,
                artist: songArtistRef.current.value,
                youTubeId: songYoutubeIdRef.current.value
            }
            let songIndex = store.songIndex;

            // console.log("the current playlist being passed into editMarkedSong");
            // console.log(store.currentList);
            store.addEditSongTransaction(songIndex, newSongDetails, oldSongDetails);
        }
    }

    function handleHideEditSongModal(){
        // console.log("inside edit song modal, editSongModal");
        store.hideEditSongModal();
    }
    
    return (
        <div 
            className="modal" 
            id="edit-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-edit-song-root'>
                    <div className="modal-north">
                        Edit Song
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            <p>Title: <input type="text" id="edit-song-title" ref={songTitleRef}></input></p>
                            <p>Artist: <input type="text" id="edit-song-artist" ref={songArtistRef}></input></p>
                            <p>YoutubeId: <input type="text" id="edit-song-youtubeId" ref={songYoutubeIdRef}></input></p>
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="edit-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleEditSong}
                            value='Confirm' />
                        <input type="button" 
                            id="edit-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleHideEditSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );

}

export default EditSongModal