import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Card from './Card';
import apiCall from '../common/apiCall';

class Practice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            activeCard: 0,
            error: null
        };
    };

    componentDidMount() {
        apiCall('/api/flashcards', {}, (res, err) => {
            if(err) {
                this.setState({ error: `Nie udało się pobrać fiszek. ${err.message}` });
            } else {
                this.setState({ cards: res });
            };
        });
    };

    nextCard = () => {
        this.setState({ activeCard: Math.floor(Math.random() * this.state.cards.length) });
    };

    render() {
        const { cards, activeCard, error } = this.state;
        if (error) {
            return (
                <div>
                    { error }<br />
                    <NavLink to='/home' className='button'>Powrót</NavLink>
                </div>
            );
        } else { 
            return cards.length > 0 
                ? <div className='practice'>
                    <h2>Trening</h2>
                    <Card card={ cards[activeCard] } nextCard={ this.nextCard } />
                    <NavLink to='/home' className='button'>Zakończ</NavLink>
                </div>
                : <div>
                    Trwa pobieranie danych z serwera...
                </div>
        };
    };
};

export default Practice;
