import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initNewSongDetails, initOldSongDetails) {
        super();
        this.store = initStore;
        this.songIndex = initIndex;
        this.newSongDetails = initNewSongDetails;
        this.oldSongDetails = initOldSongDetails;
    }

    doTransaction() {
        console.log("Inside EditSong: doTransaction");
        this.store.editMarkedSong(this.songIndex, this.newSongDetails, this.oldSongDetails);
    }
    
    undoTransaction() {
        console.log("Inside EditSong: undoTransaction");
        this.store.editMarkedSong(this.songIndex, this.oldSongDetails, this.newSongDetails);
    }
}