import { Card } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import gun from '../resources/laser-gun.png'
import wheel from '../resources/car.png'
import ship from '../resources/battleship.png'
import develop from '../resources/sketch.png'
import rocky from '../resources/mountain.png'
import cold from '../resources/snowflakes.png'
import flare from '../resources/electricity.png'

const UnitCard = ({ card, hand, userField, enemyField }) => {

    const dispatch = useDispatch()
    const env = useSelector((state) => state.env)
    const userTurn = useSelector((state) => state.userTurn)
    const oldStrength = useState(card.strength)
    let logo
    if (card.role == 'foot' || card.role == 'other') {
        logo = gun
    }
    else if (card.role == 'ground') {
        logo = wheel
    }
    else if (card.role == 'space') {
        logo = ship
    }
    else if (card.ability == 'develop') {
        logo = develop
    }
    else if (card.ability == 'rocky') {
        logo = rocky
    }
    else if (card.ability == 'cold') {
        logo = cold
    }
    else if (card.ability == 'flare') {
        logo = flare
    }

    const playCard = () => {
        let role = card.role
        if (role == 'env') {
            //if it's an env card, put it in the shared env row
            dispatch({ type: "PLAY_ENV", card: card })
            dispatch({ type: "END_TURN" })
        }
        else {
            //puts the card in the correct array inside field 
            dispatch({ type: "PLAY_CARD", role: role, card: card })
            dispatch({ type: 'END_TURN' })
        }
    }


    useEffect(() => {
        //Cards look at env. When it changes, they run the corresponding action 
        //if they're in the field and not an env card, their strength is reduced accordingly
        if ((userField === true || userField === false) && !(card.is_special)) {
            let conditions = env.map(card => card.ability)
            if (conditions.includes('develop')) {
                dispatch({ type: 'DEVELOP', card: card, oldStrength: oldStrength[0], userField: userField ? true : false })
            }
            else if ((card.role === 'foot') && (conditions.includes('cold'))) {
                dispatch({ type: "COLD", card: card })
            }
            else if ((card.role === 'ground') && (conditions.includes('rocky'))) {
                dispatch({ type: 'ROCKY', card: card })
            }
            else if ((card.role === 'space') && (conditions.includes('flare'))) {
                dispatch({ type: 'FLARE', card: card })
            }
        }
        if (hand && !(card.role === 'env')) {
            let conditions = env.map(card => card.ability)
            if (conditions.includes('develop')) {
                dispatch({ type: 'DEVELOP', card: card, oldStrength: oldStrength[0], userField: userField ? true : false })
            }
        }
    }, [env])


    return (
        <Card
        className='card-unit'
        border='secondary'
        bg={'dark'}
        onClick={hand && userTurn ? () => playCard() : null}
        >
            {card.role == 'env' ?
                null :
                <div className="strength">{hand ? oldStrength : card.strength}</div>
            }
            <div className='card-content'>
                <Card.Img src={logo} />
            </div>

        </Card>
    )
}

export default UnitCard;