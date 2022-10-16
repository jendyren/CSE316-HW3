import React, { useContext } from 'react';
import { GlobalStoreContext } from '../store'

function DeleteSongModal () {
    const { store } = useContext(GlobalStoreContext);
    // console.log(store.currentList);

    let name = "";
    if(store.currentList){
        if(store.songMarkedForDelete){
            console.log(store.songMarkedForDelete);
            name = store.songMarkedForDelete.title;
        }
        // if(store.songMarkedForDelete){
        //     let song = store.songMarkedForDelete.song;
        //     name = song.title;
        //     console.log(name);
        // }      
    }

    function handleDeleteSong(){
        console.log("inside handleDeleteSong");
        console.log(store.songMarkedForDelete);
        console.log(store.songIndex);
        store.deleteMarkedSong(store.songIndex);
    }

    function handleHideDeleteSongModal(){
        console.log("inside Handle Delete Song Modal");
        store.hideDeleteSongModal();
    }



    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-song-root'>
                    <div className="modal-north">
                        Delete Song
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete {name} from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleDeleteSong}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleHideDeleteSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal