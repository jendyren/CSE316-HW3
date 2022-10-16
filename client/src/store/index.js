import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import AddSong_Transaction from '../transactions/AddSong_Transaction'
import DeleteSong_Transaction from '../transactions/DeleteSong_Transaction'
import EditSong_Transaction from '../transactions/EditSong_Transaction'

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_EDIT: "MARK_SONG_FOR_EDIT",
    ADD_NEW_SONG: "ADD_NEW_SONG",
    MARK_SONG_FOR_DELETE: "MARK_SONG_FOR_DELETE"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        listMarkedForDeletion: null,
        songMarkedForEdit: null,
        songIndex: null,
        songMarkedForDelete: null,
        modalActive: false,
        changeListNameActive: true

    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    isModalActive: false,
                    changeListNameActive: true
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    isModalActive: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    isModalActive: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    isModalActive: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload.id,
                    isModalActive: true
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null,
                    isModalActive: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    isModalActive: false
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT:{
                // console.log(payload);
                // console.log(store.currentList);
                // console.log(payload.playlist);

                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: payload.song, 
                    songIndex: payload.songIndex,
                    isModalActive: true
                });
            }
            case GlobalStoreActionType.ADD_NEW_SONG:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null, 
                    songIndex: payload.songIndex,
                    isModalActive: false
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_DELETE:{
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: null, 
                    songMarkedForDelete: payload.song,
                    songIndex: payload.songIndex,
                    isModalActive: true
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        let playlist;
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        changeListNameActive: true,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
        // storeReducer({
        //     type: GlobalStoreActionType.SET_CURRENT_LIST,
        //     payload: playlist
        // });
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    store.createNewList = function (){
        async function asyncCreateNewList() {
            let newListName = "Untitled" + store.newListCounter;
            let payload = { name: newListName, songs: [] };
            const response = await api.createPlaylist(payload);

            if (response.data.success) {
                let newList = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: newList
                }
                );
                // Edit list if valid 
                store.history.push("/playlist/" + newList._id);
            }
            else {
                console.log("Failed to create new list from API");
            }
        }
        asyncCreateNewList();
    }

    store.createNewSong = function (){
        console.log("inside create New song!");
        let newSong = {
            title : "Untitled",
            artist : "Unknown",
            youTubeId : "dQw4w9WgXcQ"
        }
        let playlist = store.currentList;

        playlist.songs.push(newSong);        

        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:playlist}
                )
            }
        }
        updateList(playlist);
        console.log(playlist);
    }

    store.removeLastSong = function (){
        // if(this.state.currentList){
        //     let lastElementIndex = this.getPlaylistSize();
        //     console.log(lastElementIndex);
        //     this.state.currentList.songs.splice(lastElementIndex-1, 1);
        //     this.setStateWithUpdatedList(this.state.currentList);
        // }
        if(store.currentList){
            let playlist = store.currentList;
            let lastElementIndex = store.getPlaylistSize();
            console.log(lastElementIndex);
            playlist.songs.splice(lastElementIndex-1, 1);

            async function updateList(playlist) {
                let response = await api.updatePlaylistById(playlist._id, playlist);
                if(response.data.success){
                    storeReducer({
                        type:GlobalStoreActionType.SET_CURRENT_LIST,
                        payload:playlist}
                    )
                }
            }
            updateList(playlist);
        }
    }

    store.markDeleteSong = function(songToDeleteInfo){
        /*
        songToDeleteInfo = {
            songIndex : index,
            playlist : store.currentList,
            song : store.currentList.songs[index]
            // deleteStatus : true
            
        }
        */
        console.log("Inside markDeleteSong");
        // console.log(songToDeleteInfo);
        // console.log(playlist);

        if(store.currentList){
            console.log("marking delete song here");

            storeReducer({
                type: GlobalStoreActionType.MARK_SONG_FOR_DELETE,
                payload: {
                    songIndex: songToDeleteInfo.songIndex,
                    playlist: songToDeleteInfo.playlist,
                    song: songToDeleteInfo.song
                }
            });    
        }
        store.showDeleteSongModal();
    }

    store.deleteMarkedSong = function(songIndex){
        console.log("Inside deleteMarkedSong");

        let playlist = store.currentList;
        playlist.songs.splice(songIndex, 1)

        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:playlist}
                )
            }
        }
        updateList(playlist);

        store.hideDeleteSongModal();
        
    }

    store.addMarkedSong = function (songIndex, songMarkedForDelete){
        console.log("Inside addMarkedSong ");
        console.log(songIndex);
        console.log(songMarkedForDelete);
        let playlist = store.currentList;
        playlist.songs.splice(songIndex, 0, songMarkedForDelete);

        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:playlist}
                )
            }
        }
        updateList(playlist);
    }

    store.markEditSong = function(songToEditInfo){
        /*
        songToEditInfo = {
            songIndex : songIndex,
            playlist : store.currentList,
            song : {
                        id,
                        title,
                        artist,
                        youtubeId
                    }
            // editStatus : true
            
        }
        */

        let playlist = songToEditInfo.playlist;
        let playlistId = songToEditInfo.playlist._id;
        let songId = songToEditInfo.song._id;
        let songIndex = songToEditInfo.songIndex;

        // console.log(songId);
        console.log(playlist);

        if(store.currentList){
            console.log("marking edit song here");

            storeReducer({
                type: GlobalStoreActionType.MARK_SONG_FOR_EDIT,
                payload: {
                    songIndex: songIndex,
                    playlistId: playlistId,
                    songId: songId,
                    playlist: playlist,
                    song: songToEditInfo.song
                }
            });    
        }

        store.showEditSongModal();
    }

    store.editMarkedSong = function(songIndex, newSongDetails, oldSongDetails){
        /*
            let newSongDetails = {
                id
                title: songTitleRef.current.value,
                artist: songArtistRef.current.value,
                youTubeId: songYoutubeIdRef.current.value
            }
        */
       
       let playlist = store.currentList;

       console.log("Old song details: ")
       console.log(oldSongDetails);

       console.log("New Song Details: ")
       console.log(newSongDetails);

       
       playlist.songs[songIndex] = newSongDetails;

       async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:playlist}
                )
            }
        }
        updateList(playlist);

        store.hideEditSongModal();        
    }

    store.markListForDeletion = function(id) {
        console.log(id);

        async function asyncDeletePlaylist(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                let currentName = playlist.name;
                console.log(currentName);

                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {
                        id: id,
                        playlist: playlist
                    }
                });

                store.showDeletePlayListModal();
            }
        }
        asyncDeletePlaylist(id);
    }

    store.deletePlaylistById = function(id) {
        async function asyncDeletePlaylistById(id) {
            console.log("inside deletePlayListById");
            console.log(id);
            const response = await api.deletePlaylistById(id);
            if (response.data.success) {
                // Delete playlist if valid
                store.loadIdNamePairs();
                store.history.push("/");
            }
            else {
                console.log("Failed to delete current list from API");
            }
        }
        asyncDeletePlaylistById(id);

        store.hideDeletePlayListModal();
    }
    
    store.deleteMarkedList = function() {
        console.log(store.listMarkedForDeletion);
        store.deletePlaylistById(store.listMarkedForDeletion);
    }
    
    store.showDeletePlayListModal = function() {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeletePlayListModal = function() {
        // let playlist = store.currentList;
        // async function updateList(playlist) {
        //     let response = await api.updatePlaylistById(playlist._id, playlist);
        //     if(response.data.success){
        //         storeReducer({
        //             type:GlobalStoreActionType.SET_CURRENT_LIST,
        //             payload:playlist}
        //         )
        //     }
        // }
        // updateList(playlist);

        // store.modalActive = false;

        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        // let playlist = store.currentList;
        
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload:null}
        )
        store.modalActive = false;

        // let playlist = store.currentList;
        
        // storeReducer({
        //     type:GlobalStoreActionType.SET_CURRENT_LIST,
        //     payload:playlist}
        // )
        // store.modalActive = false;
    }

    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function() {
        // let playlist = store.currentList;
        // async function updateList(playlist) {
        //     let response = await api.updatePlaylistById(playlist._id, playlist);
        //     if(response.data.success){
        //         storeReducer({
        //             type:GlobalStoreActionType.SET_CURRENT_LIST,
        //             payload:playlist}
        //         )
        //     }
        // }
        // updateList(playlist);

        // store.modalActive = false;

        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");

        let playlist = store.currentList;
        
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload:playlist}
        )
        store.modalActive = false;
        // storeReducer({
        //                 type:GlobalStoreActionType.MARK_SONG_FOR_EDIT,
        //                 payload:null
        //             })
    }

    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteSongModal = function() {
        // let playlist = store.currentList;
        // async function updateList(playlist) {
        //     let response = await api.updatePlaylistById(playlist._id, playlist);
        //     if(response.data.success){
        //         storeReducer({
        //             type:GlobalStoreActionType.SET_CURRENT_LIST,
        //             payload:playlist}
        //         )
        //     }
        // }
        // updateList(playlist);

        

        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");

        let playlist = store.currentList;
        
        storeReducer({
            type:GlobalStoreActionType.SET_CURRENT_LIST,
            payload:playlist}
        )
        store.modalActive = false;
    }

    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function (start, end) {
        console.log("Inside moveSong function");
        let playlist = store.currentList;
        

        // WE NEED TO UPDATE THE STATE FOR THE APP
        start -= 1;
        end -= 1;
        if (start < end) {
            let temp = playlist.songs[start+1];
            for (let i = start+1; i < end+1; i++) {
                playlist.songs[i] = playlist.songs[i + 1];
            }
            playlist.songs[end+1] = temp;
        }
        else if (start+1 > end+1) {
            let temp = playlist.songs[start+1];
            for (let i = start+1; i > end+1; i--) {
                playlist.songs[i] = playlist.songs[i - 1];
            }
            playlist.songs[end+1] = temp;
        }
        console.log("Playlist before update: ");
        console.log(playlist);
        async function updateList(playlist) {
            let response = await api.updatePlaylistById(playlist._id, playlist);
            if(response.data.success){
                storeReducer({
                    type:GlobalStoreActionType.SET_CURRENT_LIST,
                    payload:playlist}
                )
            }
        }
        updateList(playlist);

        console.log("Playlist after update: ");
        console.log(playlist);

    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    store.addMoveSongTransaction = function (start, end){
        console.log("Inside add Move Song Transaction");
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }

    store.addAddSongTransaction = function (){
        console.log("Inside add Add Song Transaction");
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addDeleteSongTransaction = function (songIndex, songMarkedForDelete){
        console.log("Inside add Delete Song Transaction");
        let transaction = new DeleteSong_Transaction(store, songIndex, songMarkedForDelete);
        tps.addTransaction(transaction);
    }

    store.addEditSongTransaction = function (songIndex, newSongDetails, oldSongDetails){
        console.log("Inside add Edit Song Transaction");
        let transaction = new EditSong_Transaction(store, songIndex, newSongDetails, oldSongDetails);
        tps.addTransaction(transaction);
    }

    store.hasTransactionToUndo = function(){
        // console.log("Inside hasTransactionToUndo...");
        return tps.hasTransactionToUndo();
        // console.log(tps.hasTransactionToUndo());
    }

    store.hasTransactionToRedo = function(){
        return tps.hasTransactionToRedo();
    }


    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}