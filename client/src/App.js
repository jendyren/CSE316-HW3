import './App.css';
import { React,useContext} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Banner, ListSelector, PlaylistCards, Statusbar } from './components'
import { GlobalStoreContext } from './store';
/*
    This is our application's top-level component.
    
    @author McKilla Gorilla
*/
const App = () => {
    const { store } = useContext(GlobalStoreContext);
    function handleKeyDown(event){
        if(store.currentList){
            if (event.ctrlKey && event.key.toLowerCase() === 'z') {
                console.log("inside undo")
                store.undo();
            }
            if (event.ctrlKey && event.key.toLowerCase() === 'y') {
                console.log("inside redo")
                store.redo();
            }
        }
    };
    
    return (
        <Router>
            <div tabIndex={0} onKeyDown={handleKeyDown}>
                <Banner />
                <Switch>
                    <Route path="/" exact component={ListSelector} />
                    <Route path="/playlist/:id" exact component={PlaylistCards} />
                </Switch>
                <Statusbar />
            </div>
        </Router>
    )
}

export default App