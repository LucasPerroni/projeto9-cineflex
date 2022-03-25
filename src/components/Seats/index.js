import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

import Footer from '../Footer/'
import './style.css'

export default function Seats() {
    const {sessionId} = useParams()
    const [session, setSession] = useState({}) // movie session
    const [user, setUser] = useState({name: '', cpf: '', ids: []}) // user data
    const [valid, setValid] = useState(false) // user data is valid or not

    // GET SESSION API
    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/showtimes/${sessionId}/seats`)
        promise.then(response => {setSession(response.data)})
        promise.catch(error => {console.log(error.response)})
    }, [sessionId])

    // VALIDATE IF "USER" OBJ IS VALID
    function validateUser() {
        const {name, cpf, ids} = user
        let counter = 0

        let array = name.split('')
        array.forEach(letter => {
            if (letter !== ' ' && Number(letter)) {counter++}
        })
        
        if (counter === 0 && name.length > 1 && cpf.length === 11 && Number(cpf) && ids.length > 0) {
            setValid(true)
        } else {setValid(false)}
    }
    useEffect(validateUser, [user])

    return session.id ?  (
        <>
            <main className='Seats'>
                <h1>Select your seat(s)</h1>
                <article>
                    <DisplaySeats seats={session.seats} user={user} setUser={setUser}/>
                </article>
                <StatusType />
                <section>

                    <p>Name:</p>
                    <input placeholder='Write your name...' 
                    onChange={e => setUser({...user, name: `${e.target.value}`})}></input>

                    <p>CPF:</p>
                    <input type='number' placeholder='Write your CPF...'
                    onChange={e => setUser({...user, cpf: `${e.target.value}`})}></input>
                    
                </section>
                <div className='reserve'>
                    <Link to='/success' state={{user: user, session: session}}>
                        <button className={valid ? '' : 'disabled'} disabled={valid ? false : true}>Reserve seat(s)</button>
                    </Link>
                </div>
            </main>
            <Footer id={session.movie.id} day={session.day.weekday} time={session.name} />
        </>
    ) : (<p>Loading...</p>)
} 

function DisplaySeats({seats, user, setUser}) {
    const {ids} = user

    function validation(id) {
        if (!ids.includes(id)) {
            return setUser({...user, ids: [...ids, id].sort( (a, b) => {return a - b} )})
        } else {
            const index = ids.indexOf(id)
            ids.splice(index, 1)
            return setUser({...user, ids: [...ids].sort( (a, b) => {return a - b} )})
        }
    }

    return (
        <>
            {seats.map( ({id, name, isAvailable}) => {
                if (isAvailable) {
                    return <button key={id} className={ids.includes(id) ? 'selected' : ''} 
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
