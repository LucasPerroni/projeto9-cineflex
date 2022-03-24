import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

import './style.css'

export default function Movies() {
    const [movies, setMovies] = useState([])

    useEffect(() => {
        const promise = axios.get('https://mock-api.driven.com.br/api/v5/cineflex/movies')
        promise.then(response => {
            setMovies(response.data)
        })
        promise.catch(error => {console.log(error.response)})
    }, [])

    console.log(movies)

    return movies.length > 0 ? (
        <main className='Movies'>
            <p>Select a movie</p>
            <section>
                {movies.map(({id, posterURL, id:movieId}) => { return (
                    <Link to={`/movie/${movieId}`}  key={id}>
                        <article>
                            <img src={posterURL} alt={movieId} />
                        </article>
                    </Link>
                )})}
            </section>
        </main>
    ) : (<p>Loading...</p>)
} 
