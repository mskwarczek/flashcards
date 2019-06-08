import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { clearUserData } from '../common/reducers/userActions';

const mapStateToProps = state => ({
    user: state.userReducer
});

const mapDispatchToProps = dispatch => ({
    clearUserData: () => dispatch(clearUserData())
});

const Home = (props) => {

    const logout = () => {
        fetch('/api/logout', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                if (res !== 'ERROR') {
                    props.clearUserData();
                    props.history.push('/');
                } else {
                    console.log(res);
                };
            });
    };

    return (
        <div className='home'>
            <NavLink to='/test'><div className='button button--big'>Test</div></NavLink>
            <NavLink to='/practice'><div className='button button--big'>Trening</div></NavLink>
            <NavLink to='/summary'><div className='button button--big'>Podsumowanie</div></NavLink>
            <input type='button' className='button' value='Wyloguj' onClick={logout} />
        </div>
    );
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));