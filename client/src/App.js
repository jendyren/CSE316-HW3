import './App.css';
import { React } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components'
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    function handleAppKeyDown(keyEvent){
        let CTRL_KEY_CODE = "17";
        if (keyEvent.which == CTRL_KEY_CODE) {
            this.ctrlPressed = true;
        }
        else if (keyEvent.key.toLowerCase() == "z") {
            if (this.ctrlPressed) {
                this.undo();
            }
        }
        else if (keyEvent.key.toLowerCase() == "y") {
            if (this.ctrlPressed) {
                this.redo();
            }
        }
    }
    function handleAppKeyUp(keyEvent){
        if (keyEvent.which == "17")
            this.ctrlPressed = false;
    }
    return (
        <Router>
            <Banner />
            <Switch>
                <Route path="/" exact component={ListSelector} />
                <Route path="/playlist/:id" exact component={PlaylistCards} />
            </Switch>
            <Statusbar />
        </Router>
    )
}

export default App