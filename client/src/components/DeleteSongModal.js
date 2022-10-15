import React, { Component } from 'react';

function DeleteSongModal () {
    function handleHideDeleteSongModal(){
        console.log("inside Handle Remove Song Modal");
    }

    function handleDeleteSong(){
        console.log("inside handleRemoveSong");
        store.hideDeleteSongModal();
    }
    let name = "potato";

    // if(songKeyPair){
    //     name = songKeyPair.song.title;
    // }
    
    return (
        <div 
            className="modal" 
            id="delete-song-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-song-root'>
                    <div className="modal-north">
                        Remove Song
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove {name} from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="remove-song-confirm-button" 
                            className="modal-button" 
                            onClick={handleDeleteSong}
                            value='Confirm' />
                        <input type="button" 
                            id="remove-song-cancel-button" 
                            className="modal-button" 
                            onClick={handleHideDeleteSongModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteSongModal