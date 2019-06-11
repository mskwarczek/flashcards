import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import apiCall from '../common/apiCall';
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

    componentDidMount() {
        if (this.props.user !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (!err) {
                    this.props.setUserData(res);
                    this.props.history.push('/home');
                };
            });
        };
    };

    handleChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'email': this.setState({ email: value }); break;
            case 'password': this.setState({ password: value }); break;
            default: break;
        };
    };

    login = () => {
        let body = { email: this.state.email, password: this.state.password };
        body = JSON.stringify(body);
        apiCall('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        }, (res, err) => {
            if (err) {
                this.setState({ error: err.message });
            } else {
                this.props.setUserData(res);
                this.props.history.push('/home');
            };
        });
    };

    render() {
        const { email, password, error } = this.state;
        return (
            <div className='login'>
                <h3>Fiszki do nauki języków, pojęć, dat i innych informacji, które trzeba po prostu zapamiętać :)</h3>
                <div className='login__form'>
                    { error === '401'
                        ? <p>Błąd logowania.</p>
                        : null
                    }
                    <form>
                        <input className='form-input'
                            type='email'
                            name='email'
                            placeholder='EMAIL'
                            value={ email }
                            onChange={ this.handleChange }
                            required />
                        <input className='form-input'
                            type='password'
                            name='password'
                            placeholder='HASŁO'
                            value={ password }
                            onChange={ this.handleChange }
                            required />
                        <input className='button button--important' type='button' value='Zaloguj' onClick={ this.login } />
                    </form>
                </div>
                <div className='login__flex-container'>
                    <div>
                        <p>Nie masz konta? Zajmie to tylko chwilkę i wymaga jedynie podania nazwy użytkownika, e-maila i hasła.</p>
                        <p className='note'>Uwaga: To projekt do doskonalenia umiejętności programistycznych autora, możesz podać wymyśony adres e-mail. Nie będą na niego wysyłane żadne wiadomości.</p>
                        <NavLink to='/register' className='button'>Rejestracja</NavLink>
                    </div>
                    <div>
                        <p>Przetestuj aplikację bez rejestracji i logowania. Dostępna będzie jedynie funkcja treningu.</p>
                        <NavLink to='/home' className='button'>Bez logowania</NavLink>
                    </div>
                </div>
                <div>
                    <p>Pierwszy raz spotykasz się z pojęciem fiszek (ang. flashcards)? Dowiedz się więcej! <NavLink to='/about' className='inline-link'>O fiszkach</NavLink></p>
                </div>
            </div>
        );
    };
};

Login.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
