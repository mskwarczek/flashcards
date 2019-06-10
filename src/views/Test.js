import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import Card from './Card';
import ProgressBar from './ProgressBar';
import Summary from './Summary';
import apiCall from '../common/apiCall';
import { pushForward, pushBackward, fillCardsArray } from '../common/reducers/cardActions.js';
import { setUserData } from '../common/reducers/userActions.js';

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
            running: 0, // 0 - test not started, 1 - test running, 2 - test finished, -1 user not logged in
            firstBoxBaseSize: 15,
            error: null
        };
    };

    componentDidMount() {
        if (this.props.user.isLoggedIn !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (err) {
                    if (err.message === '401') {
                        this.setState({ running: -1 });
                    } else {
                        this.setState({ error: err.message });
                    };
                } else {
                    this.props.setUserData(res);
                    this.getData();
                };
            });
        } else {
            this.getData();
        };
    };

    getData = () => {
        apiCall('api/flashcards', {}, (res, err) => {
            if (err) {
                this.setState({ error: `Nie udało się pobrać fiszek. ${err.message}` });
            } else {
                this.prepareFlashcards(res);
            };
        });
    };

    prepareFlashcards = (cards) => {
        cards = this.combineUserWithCards(cards);
        cards = this.fillFirstBox(cards);
        cards.sort((a, b) => b.box - a.box);
        this.props.fillCardsArray(cards);
        this.setState({ running: 1, index: cards.filter(elem => elem.box >= 6).length });
        return true;
    };

    combineUserWithCards = (cards) => {
        return cards.map(card => {
            let newCard = { ...card, box: 0 };
            this.props.user.flashcards.forEach((box, index) => {
                if (box.some(id => id === card.id)) {
                    newCard = { ...card, box: index };
                };
            });
            return newCard;
        });
    };

    fillFirstBox = (cards) => {
        let firstBoxLength = cards.filter(elem => elem.box === 1).length;
        return cards.map(card => {
            if (card.box === 0 && firstBoxLength < this.state.firstBoxBaseSize) {
                firstBoxLength++;
                return { ...card, box: 1 };
            };
            return card;
        });
    };

    pushForward = (id) => {
        this.props.pushForward(id);
        this.increaseIndex();
    };

    pushBackward = (id) => {
        this.props.pushBackward(id);
        this.increaseIndex();
    };

    increaseIndex = () => {
        const newIndex = this.state.index + 1;
        if (newIndex < this.props.cards.filter(card => card.box !== 0).length)
            this.setState({
                index: newIndex
            });
        else {
            this.updateUserData();
            this.setState({
                running: 2,
            });
        };
    };

    sendUserData = (newData) => {
        newData = JSON.stringify(newData);
        apiCall('/api/userUpdate', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newData,
        });
    };

    updateUserData = () => {
        let newData = [[], [], [], [], [], [], []];
        this.props.cards.forEach(card => {
            newData[card.box].push(card.id);
        });
        newData = { ...this.props.user, flashcards: newData }
        this.props.setUserData(newData);
        this.sendUserData({ flashcards: newData.flashcards });
    };

    render() {
        const { running, error, index } = this.state;
        if (error) {
            return (
                <div>
                    { error }<br />
                    <NavLink to='/home' className='button'>Powrót</NavLink>
                </div>
            );
        } else {
            switch (running) {
                case 0: return (
                    <div className='test'>
                        Trwa pobieranie danych z serwera...
                    </div>);
                case 1: return (
                    <div className='test'>
                        <h2>Test</h2>
                        <Card
                            card={ this.props.cards[index] }
                            test={ true }
                            pushForward={ this.pushForward }
                            pushBackward={ this.pushBackward } />
                        <ProgressBar
                            cards={ this.props.cards }
                            current={ index } />
                        <NavLink to='/home' className='button'>Przerwij</NavLink>
                        <p>Twoja sesja nie zostanie zapisana</p>
                    </div>);
                case 2: return (
                    <Summary
                        afterTest={ true } />);
                case -1: return (
                    <div className='test'>
                        <p>Musisz się zalogować</p>
                        <NavLink to='/' className='button'>Logowanie</NavLink>
                        <NavLink to='/home' className='button'>Powrót</NavLink>
                    </div>);
                default: return null;
            };
        };
    };
};

Test.propTypes = {
    cards: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    pushForward: PropTypes.func.isRequired,
    pushBackward: PropTypes.func.isRequired,
    fillCardsArray: PropTypes.func.isRequired,
    setUserData: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Test);
