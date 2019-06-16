import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import SetsSelect from './SetsSelect';
import apiCall from '../common/apiCall';

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            repeatPassword: '',
            flashcardsSets: [],
            chosenFlashcardsSet: ''
        };
    };

    componentDidMount() {
        apiCall('/api/flashcards', {}, (res, err) => {
            if (!err) {
                this.setState({ flashcardsSets: res, chosenFlashcardsSet: res[0]._id });
            };
        });
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email': this.setState({ email: value }); break;
            case 'username': this.setState({ username: value }); break;
            case 'password': this.setState({ password: value }); break;
            case 'repeatPassword': this.setState({ repeatPassword: value }); break;
            case 'flashcardsSet': this.setState({ chosenFlashcardsSet: value }); break;
            default: break;
        };
    };

    render() {
        const { search } = this.props.location;
        const { email, password, username, repeatPassword, chosenFlashcardsSet, flashcardsSets } = this.state;
        return (
            <div className='register-form'>
                { search.search('missingFields') > -1
                    ? <p>Uzupełnij wszystkie pola!</p>
                    : null
                }
                { search.search('duplicateEmail') > -1
                    ? <p>Ten adres email i/lub nazwa użytkownika są już zajęte!</p>
                    : null
                }
                { (password !== repeatPassword || search.search('badPassword') > -1)
                    ? <p>Hasło i jego powtórzenie muszą być identyczne</p>
                    : null
                }
                <form action='/api/user/register' method='post'>
                    <input className='form-input'
                        type='email'
                        name='email'
                        placeholder='EMAIL'
                        value={ email }
                        onChange={ this.handleChange }
                        required />
                    <input className='form-input'
                        type='text'
                        name='username'
                        placeholder='NAZWA UŻYTKOWNIKA'
                        value={ username }
                        onChange={ this.handleChange }
                        required />
                    <input className='form-input'
                        type='password'
                        name='password'
                        placeholder='HASŁO'
                        value={ password }
                        onChange={ this.handleChange }
                        required />
                    <input className='form-input'
                        type='password'
                        name='repeatPassword'
                        placeholder='POWTÓRZ HASŁO'
                        value={ repeatPassword }
                        onChange={ this.handleChange }
                        required />
                    Wybierz początkowy zestaw fiszek. Możesz go zmienić w każdym momencie w ustawieniach profilu.
                    <SetsSelect name='flashcardsSet' onChange={ this.handleChange } value={ chosenFlashcardsSet } sets={ flashcardsSets } />
                    <br /><br />
                    <input className='button button--important' type='submit' value='Rejestracja' />
                </form>
                <div>
                    <NavLink to='/' className='button'>Powrót</NavLink>
                </div>
            </div>
        );
    };
};

export default RegisterForm;
