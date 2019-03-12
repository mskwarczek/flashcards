import React, { Component } from 'react';

export default class RegisterForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            username: '',
            password: '',
            repeatPassword: ''
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

    handleSubmit = (event) => {
        event.preventDefault();
    }

    render() {
        return(
            <div className='register-form'>
                <form onSubmit={this.handleSubmit}>
                    <label>Email:
                        <input 
                            type='email'
                            name='email'
                            value={this.state.email}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Name:
                        <input 
                            type='text'
                            name='username'
                            value={this.state.username}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Password:
                        <input
                            type='password'
                            name='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                            required />
                    </label><br />
                    <label>Repeat password:
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
