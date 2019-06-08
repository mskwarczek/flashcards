import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { setUserData } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user))
});

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: null
        };
    };

    handleChange = (event) => {
        switch (event.target.name) {
            case 'email': this.setState({ email: event.target.value }); break;
            case 'password': this.setState({ password: event.target.value }); break;
            default: break;
        };
    };

    login = () => {
        const body = { email: this.state.email, password: this.state.password };
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText);
                } else {
                    return res.json();
                };
            })
            .then(res => this.props.setUserData(res))
            .then(() => this.props.history.push('/home'))
            .catch(error => {
                console.log(error.message);
                this.setState({ error: error.message });
            });
    };

    render() {
        return (
            <div className='login'>
                <div className='login-form'>
                    {
                        (this.state.error === 'Unauthorized')
                            ? <p>Błąd logowania.</p>
                            : null
                    }
                    <form>
                        <label>Email:
                        <input
                                type='email'
                                name='email'
                                value={this.state.email}
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
                        </label><br /><br />
                        <input className='button' type='button' value='Zaloguj' onClick={this.login} />
                    </form>
                </div>
                <br />
                <NavLink to='/register'><div className='button'>Rejestracja</div></NavLink>
                <br />
                <NavLink to='/home'><div className='button'>Bez logowania*</div></NavLink>
                <p>* Dostępna tylko opcja treningu</p>
            </div>
        );
    };
};

Login.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
