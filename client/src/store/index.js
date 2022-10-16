import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
        songMarkedForDelete: null
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
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listMarkedForDeletion: null
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: payload.id
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listMarkedForDeletion: null
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDIT:{
                console.log(payload);
                console.log(store.currentList);
                console.log(payload.playlist);

                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listMarkedForDeletion: null,
                    songMarkedForEdit: payload.song, 
                    songIndex: payload.songIndex
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
                    songIndex: payload.songIndex
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
                    songIndex: payload.songIndex
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
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
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
        // console.log(playlist);
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

    store.editMarkedSong = function(songIndex, newSongDetails){
        /*
            let newSongDetails = {
                id
                title: songTitleRef.current.value,
                artist: songArtistRef.current.value,
                youTubeId: songYoutubeIdRef.current.value
            }
        */
       let playlist = store.currentList;

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
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    store.showEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideEditSongModal = function() {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.showDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteSongModal = function() {
        let modal = document.getElementById("delete-song-modal");
        modal.classList.remove("is-visible");
    }
    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}