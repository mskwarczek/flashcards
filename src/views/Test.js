import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Card from './Card';
import { pushForward, pushBackward, fillCardsArray } from './cardActions.js';
import { setUserData } from './userActions.js';

const mapStateToProps = state => ({
    cards: state.cardsReducer,
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    pushForward: (id) => dispatch(pushForward(id)),
    pushBackward: (id) => dispatch(pushBackward(id)),
    fillCardsArray: (cardsArray) => dispatch(fillCardsArray(cardsArray)),
    setUserData: (user) => dispatch(setUserData(user))
});

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            isRunning: false,
            firstBoxBaseSize: 10
        }
        this.getData()
            .then(result => this.prepareFlashcards(result));
    }

    getData = async () => { // Later on I should create user login page so it can all be done in different component. This component could just use data from the store
        const cards = await this.apiCall('/flashcards');
        const user = await this.apiCall('/user');
        this.props.setUserData(user);
        return {user: user, cards: cards}
    }

    apiCall = async (endpoint) => {
        const response = await fetch('/api' + endpoint);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    prepareFlashcards = ({user, cards}) => {
        cards = this.combineUserWithCards(user, cards);
        cards = this.fillFirstBox(cards);
        cards.sort((a, b) => b.box - a.box);
        this.props.fillCardsArray(cards);
        this.setState({index: cards.filter(elem => elem.box >= 6).length});
    }

    combineUserWithCards = (user, cards) => {
        return cards.map(card => {
            let newCard = { ...card, box: 0 };
            user.flashcards.forEach((box, index) => {
                if (box.some(id => id === card.id)) {
                    newCard = { ...card, box: index };
                }
            });
            return newCard;
        });
    }

    fillFirstBox = (cards) => {
        let firstBoxLength = cards.filter(elem => elem.box === 1).length;
        return cards.map(card => {
            if (card.box === 0 && firstBoxLength < this.state.firstBoxBaseSize) {
                firstBoxLength++;
                return { ...card, box: 1 };
            }
            return card;
        });
    }

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    }

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    }

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        if (newIndex < this.props.cards.filter(card => card.box !== 0).length)
            this.setState({
                index: newIndex
            });
        else {
            this.updateUserData();
            this.getData()//Everything from this point won't be necessary if I force app to navigate to new page here, i.e. to /summary.
                .then(result => this.prepareFlashcards(result));
            this.setState({
                isRunning: false,
                index: 0
            });
        }
    }

    sendUserData = async (newData) => {
        return await fetch('/api/user', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        });
    }

    updateUserData = () => {
        let newData = [[],[],[],[],[],[],[]];
        this.props.cards.forEach(card => {
            newData[card.box].push(card.id);
        });
        newData = { ...this.props.user, flashcards: newData }
        this.props.setUserData(newData);
        this.sendUserData(newData);
    }

    render() {
        return (
            <div className='test'>
            { this.state.isRunning
                ? <Card 
                    card={this.props.cards[this.state.index]}
                    pushForward={this.pushForward}
                    pushBackward={this.pushBackward}/>
                : <div className='button button--big' onClick={() => this.setState({isRunning: true})}>Start</div>
            }
            </div>
        );
    }
}

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired,
    fillCardsArray: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
