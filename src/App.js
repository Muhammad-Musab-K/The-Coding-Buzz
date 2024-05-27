import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    
} from "react-router-dom";

import Barscan from './pages/BarScan/BarcodeScanner'

function App() {
    return (

        <Router>
            <Routes>
                <Route path="/" element={<Barscan />} />
            </Routes>
        </Router>

    );
}

export default App;