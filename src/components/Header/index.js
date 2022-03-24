import {Link} from 'react-router-dom'
import './style.css'

export default function Header() {
    return (
        <header>
            <Link to='/' style={{ textDecoration: 'none' }}>
                <p>Cineflex</p>
            </Link>
        </header>
    )
} 
