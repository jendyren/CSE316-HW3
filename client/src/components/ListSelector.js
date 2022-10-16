import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ListCard from './ListCard.js'
import { GlobalStoreContext } from '../store'
import DeleteListModal from './DeleteListModal.js'

/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
    const { store } = useContext(GlobalStoreContext);
    store.history = useHistory();

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    let enabledButtonClass = "playlister-button";

    let modalStatus = false;
    if (store.isModalActive) {
        console.log("Modal active!");
        modalStatus = true;
    }

    let canAddList = store.currentList === null && !modalStatus; //if no playlist selected, you can add a new list
    console.log("Checking currentList for canAddList");
    console.log(store.currentList);
    console.log("canAddList: ");
    console.log(canAddList);

    if (store) {
        listCard = store.idNamePairs.map((pair) => (
            <ListCard
                key={pair._id}
                idNamePair={pair}
                selected={false}
            />
        ))
        // //if playlist active do not allow adding a new playlist
        // if(store.listNameActive){
        //     console.log("List Name is active so listButtonDisable = true");
        //     listButtonDisabled = true; 
        // }
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-list">
            <div id="playlist-selector-heading">
                <input
                    type="button"
                    id="add-list-button"
                    disabled={!canAddList}
                    onClick={handleCreateNewList}
                    className={enabledButtonClass}
                    value="+" />
                Your Lists
            </div>{
                    listCard
                }
                <DeleteListModal/>
            </div>
        </div>)
}

export default ListSelector;