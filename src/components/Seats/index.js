import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import Footer from '../Footer/'
import './style.css'

export default function Seats() {
    const {sessionId} = useParams()
    const [session, setSession] = useState({})

    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/showtimes/${sessionId}/seats`)
        promise.then(response => {setSession(response.data)})
        promise.catch(error => {console.log(error.response)})
    }, [sessionId])

    return session.id ?  (
        <>
            <main className='Seats'>
                <h1>Select your seat(s)</h1>
                <article>
                    <DisplaySeats seats={session.seats} />
                </article>
                <StatusType />
                <section>
                    <p>Name:</p>
                    <input placeholder='Write your name...'></input>
                    <p>CPF:</p>
                    <input type='number' placeholder='Write your CPF...'></input>
                </section>
                <div className='reserve'>
                    <button>Reserve seat(s)</button>
                </div>
            </main>
            <Footer id={session.movie.id} day={session.day.weekday} time={session.name} />
        </>
    ) : (<p>Loading...</p>)
} 

function DisplaySeats({seats}) {
    return (
        <>
            {seats.map(seat => { return (
                <button key={seat.id}>{seat.name}</button>
            )})}
        </>
    )
}

function StatusType() {
    return (
        <div className='status'>
            <div>
                <div className='status-type green'></div>
                <p>Selected</p>
            </div>
            <div>
                <div className='status-type'></div>
                <p>Available</p>
            </div>
            <div>
                <div className='status-type yellow'></div>
                <p>Unavailable</p>
            </div>
        </div>
    )
}
