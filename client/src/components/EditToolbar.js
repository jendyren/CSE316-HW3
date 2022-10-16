import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    
    let enabledButtonClass = "playlister-button";

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    function handleNewSong(){
        store.addAddSongTransaction();
    }   



    let modalStatus = false;
    if (store.isModalActive) {
        console.log("Modal active!");
        modalStatus = true;
    }

    let canAddSong, canUndo, canRedo, canClose;
    if (store){
        console.log("Inside if store.tps function!");
        
        console.log("CurrentList: ");
        console.log(store.currentList);

        console.log("hasTransactionToUndo: ");
        console.log(store.hasTransactionToUndo());

        console.log("hasTransactionToRedo: ");
        console.log(store.hasTransactionToRedo());

        console.log("modalStatus: ");
        console.log(modalStatus);

        console.log("---------");
        canAddSong = store.currentList !== null && !modalStatus; //if true, current list is open and song can be added
        console.log("canAddSong: ");
        console.log(canAddSong);

        console.log("---------");
        canUndo = store.hasTransactionToUndo() && !modalStatus;
        console.log("canUndo: ");
        console.log(canUndo);

        console.log("---------");
        canRedo = store.hasTransactionToRedo() && !modalStatus;
        console.log("canRedo: ");
        console.log(canRedo);

        console.log("---------");
        canClose = store.currentList !== null && !modalStatus;
        console.log("canClose: ");
        console.log(canClose);
    }

    if (store.isModalActive){
        canAddSong = false;
        canUndo = false;
        canRedo = false;
        canClose = false;
    }

    if(store.listNameActive){
        canAddSong = false;
        canUndo = false;
        canRedo = false;
        canClose = false;
    }

    // if(store.songMarkedForEdit){
    //     canAddSong = false;
    //     canUndo = false;
    //     canRedo = false;
    //     canClose = false;
    // }else if(store.songMarkedForDelete){
    //     canAddSong = false;
    //     canUndo = false;
    //     canRedo = false;
    //     canClose = false;
    // }else if(store.listMarkedForDeletion){
    //     canAddSong = false;
    //     canUndo = false;
    //     canRedo = false;
    //     canClose = false;
    // }

    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={!canAddSong}
                value="+"
                className={enabledButtonClass}
                onClick={handleNewSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={!canUndo}
                value="⟲"
                className={enabledButtonClass}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={!canRedo}
                value="⟳"
                className={enabledButtonClass}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={!canClose}
                value="&#x2715;"
                className={enabledButtonClass}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;