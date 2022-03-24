import { useState, useEffect } from 'react'
import axios from 'axios'

import './style.css'

export default function Footer({id, day, time}) {
    const [movie, setMovie] = useState({})

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/movies/${id}/showtimes`)
        promise.then(response => {
            setMovie(response.data)
        })
        promise.catch(error => {console.log(error.response)})
    }, [id])

    return movie.posterURL ? (
        <footer className='Footer'>
            <div className='image'>
                <img src={movie.posterURL} alt='Movie' />
            </div>
            <div className='title'>
                <p>{movie.title}</p>
                {day ? <p>{day} - {time}</p> : <></>}
            </div>
        </footer>
    ) : (
        <footer className='Footer'>
            <p>Loading...</p>
        </footer>
    )
}
