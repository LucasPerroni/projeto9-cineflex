import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import Footer from '../Footer/'
import './style.css'

export default function Time() {
    const {movieId} = useParams()
    const [days, setDays] = useState([])

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/movies/${movieId}/showtimes`)
        promise.then(response => {
            setDays(response.data.days)
        })
        promise.catch(error => {console.log(error.response)})
    }, [movieId])

    return days.length > 0 ? (
        <>
            <main className='Time'>
                <h1>Select a session time</h1>
                {days.map( day => <SectionTimes key={day.id} day={day} />)}
            </main>
            <Footer id={movieId} />
        </>
    ) : (<p>Loading...</p>)
} 

function SectionTimes({day}) {
    const {weekday, date, showtimes} = day
    return (
        <article>
            <p>{weekday} - {date}</p>
            <div>
                {showtimes.map( ({name, id}) => { return (
                    <Link  key={id} to={`/section/${id}`}>
                        <button>{name}</button>
                    </Link>
                )})}
            </div>
        </article>
    )
}
