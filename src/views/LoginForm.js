import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
    }

    handleChange = (event) => {
        switch (event.target.name) {
            case 'email': this.setState({ email: event.target.value }); break;
            case 'password': this.setState({ password: event.target.value }); break;
            default: break;
        }
    }

    handleSubmit = (event) => {
        this.props.login();
        event.preventDefault();
    }

    render() {
        return(
            <div className='login-form'>
                <form onSubmit={this.handleSubmit}>
                    <label>Email:
                        <input 
                            type='email'
                            name='email'
                            value={this.state.email}
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
                    </label><br /><br />
                    <input className='button' type='submit' value='Logowanie' />
                </form>
            </div>
        );
    }
}

LoginForm.propTypes = {
    login: PropTypes.func.isRequired
}
