import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import Card from './Card';

export default class Practice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: [],
            activeCard: 0
        }
    }

    componentDidMount() {
        this.getData()
            .then(result => this.setState({cards: result}));
    }

    getData = async () => {
        const cards = await this.apiCall('/flashcards');
        return cards;
    }

    apiCall = async (endpoint) => {
        const response = await fetch('/api' + endpoint);
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    }

    nextCard = () => {
        this.setState({activeCard: Math.floor(Math.random() * this.state.cards.length)});
    }

    render() {
        return this.state.cards.length > 0 
            ? <div className='practice'>
                <h2>Trening</h2>
                <Card
                    card={this.state.cards[this.state.activeCard]} nextCard={this.nextCard} />
                <NavLink to='/home'><div className='button'>Zakończ</div></NavLink>
            </div>
            : <div>
                Trwa pobieranie danych z serwera...
            </div>
    }
}
