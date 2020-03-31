import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

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
        const { t } = this.props;
        return (
            <div className='login'>
                <h3>{t('intro')}</h3>
                <div className='login__form'>
                    { error === '401'
                        ? <p>{t('loginError')}</p>
                        : null
                    }
                    <form>
                        <input className='form-input'
                            type='email'
                            name='email'
                            placeholder={t('email')}
                            value={ email }
                            onChange={ this.handleChange }
                            required />
                        <input className='form-input'
                            type='password'
                            name='password'
                            placeholder={t('password')}
                            value={ password }
                            onChange={ this.handleChange }
                            required />
                        <input className='button button--important' type='button' value={t('logIn')} onClick={ this.login } />
                    </form>
                </div>
                <div className='login__flex-container'>
                    <div>
                        <p>{t('registerInfo')}</p>
                        <p className='note'>{t('registerNote')}</p>
                        <NavLink to='/register' className='button'>{t('register')}</NavLink>
                    </div>
                    <div>
                        <p>{t('testDescription')}</p>
                        <NavLink to='/home' className='button'>{t('test')}</NavLink>
                    </div>
                </div>
                <div>
                    <p>{t('aboutDescription')}<NavLink to='/about' className='inline-link'>{t('about')}</NavLink></p>
                </div>
            </div>
        );
    };
};

Login.propTypes = {
    user: PropTypes.object.isRequired,
    setUserData: PropTypes.func.isRequired
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation('login')(Login)));
