import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Card from './Card';
import { apiCall } from '../common/tools';

class Practice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            activeCard: 0
        };
    };

    componentDidMount() {
        this.getData()
            .then(result => this.setState({ cards: result }));
    };

    getData = async () => {
        const cards = await apiCall('/flashcards');
        return cards;
    };

    nextCard = () => {
        this.setState({ activeCard: Math.floor(Math.random() * this.state.cards.length) });
    };

    render() {
        const { cards, activeCard } = this.state;
        return this.state.cards.length > 0 
            ? <div className='practice'>
                <h2>Trening</h2>
                <Card
                    card={ cards[activeCard] } nextCard={ this.nextCard } />
                <NavLink to='/home' className='button'>Zakończ</NavLink>
            </div>
            : <div>
                Trwa pobieranie danych z serwera...
            </div>
    };
};

export default Practice;
