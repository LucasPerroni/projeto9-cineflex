import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

import Footer from '../Footer/'
import './style.css'

export default function Seats() {
    const {sessionId} = useParams()
    const navigate = useNavigate()
    const [session, setSession] = useState({}) // movie session
    const [user, setUser] = useState({ids: [], compradores: []}) // user data
    const [valid, setValid] = useState(false) // user data is valid or not

    // GET SESSION API
    useEffect(() => {
        const promise = axios.get(`https://mock-api.driven.com.br/api/v5/cineflex/showtimes/${sessionId}/seats`)
        promise.then(response => {setSession(response.data)})
        promise.catch(error => {console.log(error.response)})
    }, [sessionId])

    // VALIDATE IF "USER" OBJ IS VALID
    function validateUser() {
        const {compradores:purchasers} = user

        let counter = 0
        if (purchasers.length === 0) {counter++}
        for (let i = 0; i < purchasers.length; i++) {
            const {nome, cpf} = purchasers[i]

            // Validate if 'name' string has any numbers
            let numbers = 0
            let array = nome.split('')
            array.forEach(letter => {
                if (letter !== ' ' && Number(letter)) {numbers++}
            })

            if (nome.length < 2 || cpf.length !== 11 || !Number(cpf) || numbers !== 0) {
                counter++
            }
        }
        
        if (counter === 0) {setValid(true)}
        else {setValid(false)}
    }
    useEffect(validateUser, [user])

    // SEND "USER" TO API
    function sendToAPI(e) {
        e.preventDefault()

        const promise = axios.post('https://mock-api.driven.com.br/api/v5/cineflex/seats/book-many', user)
        promise.then(() => navigate('/success', {state: {user: user, session: session, success: true}}))
        promise.catch(() => navigate('/success', {state: {user: user, session: session, success: false}}))
    }

    return session.id ?  (
        <>
            <main className='Seats'>
                <h1>Select your seat(s)</h1>
                <article>
                    <DisplaySeats seats={session.seats} user={user} setUser={setUser}/>
                </article>
                <StatusType />
                <form onSubmit={sendToAPI}>
                    {user.ids.map(id =>
                        <DisplayForm  key={id} user={user} setUser={setUser} seats={session.seats} id={id} />
                    )}
                    <div className='reserve'>
                        <button type='submit' className={valid ? '' : 'disabled'}
                        disabled={valid ? false : true}>Reserve seat(s)</button>
                    </div>
                </form>
            </main>
            <Footer id={session.movie.id} day={session.day.weekday} time={session.name} />
        </>
    ) : (<p>Loading...</p>)
} 


function DisplaySeats({seats, user, setUser}) {
    const {ids} = user

    function validation(id) {
        // GET SEAT NUMBER AND PURCHASER USING ID
        function getNumber() {
            for (let i = 0; i < seats.length; i++) {
                if (seats[i].id === id) {return seats[i].name}
            }
        }
        function getPurchaser() {
            for (let i = 0; i < user.compradores.length; i++) {
                if (user.compradores[i].id === id) {return user.compradores[i]}
            }
        }

        if (!ids.includes(id)) {
            setUser({ids: [...user.ids, id].sort( (a, b) => {return a - b} ), 
            compradores: [...user.compradores, {id: id, nome: '', cpf: ''}].sort( (a, b) => {return a.id - b.id} )})
        } else {
            let confirmation = true
            const purchaser = getPurchaser()
            if (purchaser.nome.length > 0 || purchaser.cpf.length > 0) {
                confirmation = window.confirm(`Do you want to delete the seat ${getNumber()}?`)
            }
            if (confirmation) {
                const index = ids.indexOf(id)
                user.ids.splice(index, 1)
                user.compradores.splice(index, 1)
                setUser({ids: [...user.ids].sort( (a, b) => {return a - b} ), 
                compradores: [...user.compradores]})
            }
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

function DisplayForm({user, setUser, seats, id}) {
    // GET SEAT NUMBER USING THE ID
    function getNumber(id) {
        for (let i = 0; i < seats.length; i++) {
            if (seats[i].id === id) {return seats[i].name}
        }
    }

    // GET RIGHT PURCHASER USING THE ID
    function getPurchaser() {
        for (let i = 0; i < user.compradores.length; i++) {
            if (user.compradores[i].id === id) {return user.compradores[i]}
        }
    }
    const purchaser = getPurchaser()

    // RERENDER MAIN FUNCTION AND ATT PURCHASER OBJ
    function SetUser(e) {
        if (e.target.type === 'text') {
            purchaser.nome = e.target.value
        } else {
            purchaser.cpf = e.target.value
        }
        setUser({...user})
    }

    return (
        <section> 
            <h2>Seat {getNumber(id)}</h2>

            <p>Name:</p>
            <input type='text' placeholder='Write your name...'
            onChange={e => SetUser(e)}></input>

            <p>CPF:</p>
            <input type='number' placeholder='Write your CPF...'
            onChange={e => SetUser(e)}></input>
        </section>
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
