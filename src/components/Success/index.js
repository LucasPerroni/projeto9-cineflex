import { useLocation, Link } from 'react-router-dom'

import './style.css'

export default function Success() {
    const {state} = useLocation()
    const {session, user, success} = state

    const numbers = []
    session.seats.forEach(seat => {
        if (user.ids.includes(seat.id)) {numbers.push(seat.name)}
    })

    return success ? (
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
            {user.compradores.map(purchaser => 
                <ShowPurchasers key={purchaser.id} user={purchaser} session={session} />
            )}
            <div>
                <Link to='/'>
                    <button>Return to Home</button>
                </Link>
            </div>
        </main>
    ) : (
        <main className='Success'>
            <h1 className='fail'>Failed to place order...</h1>
            <div>
                <Link to='/'>
                    <button>Return to Home</button>
                </Link>
            </div>
        </main>
    )
} 

function ShowPurchasers({user, session}) {
    function getSeat() {
        for (let i = 0; i < session.seats.length; i++) {
            if (session.seats[i].id === user.id) {return session.seats[i].name}
        }
    }
    const seat = getSeat()

    return (
        <article>
            <h2>Purchaser - Seat {seat}</h2>
            <p>Name: {user.nome}</p>
            <p>CPF: {`${user.cpf.slice(0, 3)}.${user.cpf.slice(3, 6)}.${user.cpf.slice(6, 9)}-${user.cpf.slice(9, 11)}`}</p>
        </article>
    )
}
