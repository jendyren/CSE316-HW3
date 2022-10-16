import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initIndex, initSongMarkedForDelete) {
        super();
        this.store = initStore;
        this.songIndex = initIndex;
        this.songMarkedForDelete = initSongMarkedForDelete;
    }

    doTransaction() {
        console.log("Inside DeleteSong: doTransaction");
        this.store.deleteMarkedSong(this.songIndex);
    }
    
    undoTransaction() {
        console.log("Inside DeleteSong: undoTransaction");
        this.store.addMarkedSong(this.songIndex, this.songMarkedForDelete);
    }
}