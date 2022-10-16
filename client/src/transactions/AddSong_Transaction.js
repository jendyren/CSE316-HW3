import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore) {
        super();
        this.store = initStore;
    }

    doTransaction() {
        console.log("Inside AddSong: doTransaction");
        this.store.createNewSong();
    }
    
    undoTransaction() {
        console.log("Inside AddSong: undoTransaction");
        this.store.removeLastSong();
    }
}