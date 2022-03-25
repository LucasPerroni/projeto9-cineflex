import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import axios from 'axios'

import './style.css'

export default function Success() {
    const {state} = useLocation()
    const {session, user} = state
    const [status, setStatus] = useState({loading: true, success: false})

    const numbers = []
    session.seats.forEach(seat => {
        if (user.ids.includes(seat.id)) {numbers.push(seat.name)}
    })

    useEffect(() => {
        const promise = axios.post('https://mock-api.driven.com.br/api/v5/cineflex/seats/book-many', user)
        promise.then(() => {setStatus({loading: false, success: true})})
        promise.catch(() => {setStatus({...status, loading: false})})
    }, [])

    if (!status.loading) {
        return status.success ? (
            <main className='Success'>
                <h1>Order successfully placed!</h1>
                <article>
                    <h2>Movie and session</h2>
                    <p>{session.movie.title}</p>
                    <p>{session.day.date} - {session.name}</p>
                </article>
                <article>
                    <h2>Tickets</h2>
                    {numbers.map(number => { return (
                        <p key={number}>Seat {number}</p>
                    )})}
                </article>
                <article>
                    <h2>Purchaser</h2>
                    <p>Name: {user.name}</p>
                    <p>CPF: {`${user.cpf.slice(0, 3)}.${user.cpf.slice(3, 6)}.${user.cpf.slice(6, 9)}-${user.cpf.slice(9, 11)}`}</p>
                </article>
                <div>
                    <Link to='/'>
                        <button>Return to Home</button>
                    </Link>
                </div>
            </main>
        ) : (
            <main className='Success'>
                <h1 className='fail'>Failed to place order...</h1>
            </main>
        )
    } else {
        return <p>Loading...</p>
    }
} 
