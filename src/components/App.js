import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Header from './Header/'
import Movies from './Movies/'
import Time from './Time/'
import Seats from './Seats/'
import Success from './Success/'

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Movies />} />
                <Route path='/movie/:movieId' element={<Time />} />
                <Route path='/session/:sessionId' element={<Seats />} />
                <Route path='/success' element={<Success />} />
            </Routes>
        </BrowserRouter>
    )
}
