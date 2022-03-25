import { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import axios from 'axios'

import Footer from '../Footer/'
import './style.css'

export default function Seats() {
    const {sessionId} = useParams()
    const [session, setSession] = useState({})
    const [selected, setSelected] = useState([])

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
                    <DisplaySeats seats={session.seats} selected={selected} setSelected={setSelected}/>
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

function DisplaySeats({seats, selected, setSelected}) {

    function validation(id) {
        if (!selected.includes(id)) {
            return setSelected([...selected, id].sort( (a, b) => {return a - b} ))
        } else {
            const index = selected.indexOf(id)
            selected.splice(index, 1)
            return setSelected([...selected].sort( (a, b) => {return a - b} ))
        }
    }

    return (
        <>
            {seats.map( ({id, name, isAvailable}) => {
                if (isAvailable) {
                    return <button key={id} className={selected.includes(id) ? 'selected' : ''} 
                    onClick={() => validation(id)}>{name}</button>
                } else {
                    return <button key={id} className='unavailable' style={{'cursor': 'auto'}}>{name}</button>
                }
            })}
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
