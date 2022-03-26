import {useNavigate, useLocation} from 'react-router-dom'
import './style.css'

export default function Header() {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <header>
            {location.pathname !== '/' ? 
            <ion-icon name="arrow-back-circle-outline" onClick={() => navigate(-1)}></ion-icon> : 
            <></>}
            <p onClick={() => navigate('/')}>Cineflex</p>
        </header>
    )
} 
