import React, { Component } from 'react';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            repeatPassword: '',
            isPasswordValid: true
        }
    }

    handleChange = (event) => {
        switch (event.target.name) {
            case 'email': this.setState({ email: event.target.value }); break;
            case 'username': this.setState({ username: event.target.value }); break;
            case 'password': this.setState({ password: event.target.value }); break;
            case 'repeatPassword': this.setState({ repeatPassword: event.target.value }); break;
            default: break;
        }
    }

    render() {
        return(
            <div className='register-form'>
                {
                    (this.props.history.location.search.search('missingFields') > -1)
                        ? <p>Uzupełnij wszystkie pola!</p>
                        : null
                }
                {
                    (this.props.history.location.search.search('duplicateEmail') > -1)
                        ? <p>Ten adres email jest już zajęty!</p>
                        : null
                }
                {
                    (this.state.password !== this.state.repeatPassword || this.props.history.location.search.search('badPassword') > -1)
                        ? <p>Hasło i jego powtórzenie muszą być identyczne</p>
                        : null
                }
                <form action='/api/register' method='post'>
                    <label>Email:
                        <input 
                            type='email'
                            name='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Nazwa użytkownika:
                        <input 
                            type='text'
                            name='username'
                            value={this.state.username}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Hasło:
                        <input
                            type='password'
                            name='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Powtórz hasło:
                        <input 
                            type='password'
                            name='repeatPassword'
                            value={this.state.repeatPassword}
                            onChange={this.handleChange}
                            required />
                    </label><br /><br />
                    <input className='button' type='submit' value='Rejestracja' />
                </form>
            </div>
        );
    }
}
