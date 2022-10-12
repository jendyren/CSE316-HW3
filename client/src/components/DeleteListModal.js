import React, {useContext} from 'react';
import { GlobalStoreContext } from '../store'

function DeleteListModal () {
    const { store } = useContext(GlobalStoreContext);
    let name = "";
    if (store.currentList) {
        name = store.currentList.name;
        console.log("setting name to " + {name});
        console.log({name});
    }

    function handleDeleteMarkedList(){
        console.log("inside delete list modal, handleDeleteMarkedList");
        store.deleteMarkedList();
    }

    function handleHideDeletePlayListModal(){
        console.log("inside delete list modal, hideDeletePlayListModal");
        store.hideDeletePlayListModal();
    }

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-dialog" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete playlist?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the {name} playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={handleDeleteMarkedList}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={handleHideDeletePlayListModal}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal