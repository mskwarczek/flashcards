import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SummaryBox from './SummaryBox';
import apiCall from '../common/apiCall';
import { setUserData } from '../common/reducers/userActions.js';

const mapStateToProps = state => ({
    box: state.userReducer.flashcards,
    user: state.userReducer.isLoggedIn
});

const mapDispatchToProps = dispatch => ({
    setUserData: (user) => dispatch(setUserData(user))
});

class Summary extends Component {

    componentDidMount() {
        if (this.props.user !== true) {
            apiCall('/api/user', {}, (res, err) => {
                if (!err) {
                    this.props.setUserData(res);
                };
            });
        };
    };

    render() {
        const { box, afterTest, user } = this.props;
        if (!user) {
            return (
                <div>
                    <h2>Podsumowanie</h2>
                    <p>Aby wyświetlić swoje aktualne postępy, musisz być zalogowany.</p><br />
                    <NavLink to='/' className='button button--important'>Logowanie</NavLink><br />
                    <NavLink to='/register' className='button'>Rejestracja</NavLink><br />
                    <NavLink to='/home' className='button'>Powrót</NavLink>
                </div>
            );
        };
        if (box.length === 0) {
            return (
                <div>
                    <h2>Podsumowanie</h2>
                    <p>Nie masz jeszcze żadnych fiszek w pudełku. Wykonaj swój pierwszy test aby dodać kilka.</p><br />
                    <NavLink to='/test' className='button button--important'>Test</NavLink><br />
                    <NavLink to='/home' className='button'>Powrót</NavLink>
                </div>
            );
        };
        let boxes = [];
        for (let i = 1; i < 6; i++) {
            boxes.push(<SummaryBox key={ i } boxNumber={ i } boxAmount={ box[i].length } />)
        };
        return (
            <div className='summary'>
                <h2>Podsumowanie</h2><br />
                { afterTest
                    ? <p>Gratulacje! Zakończyłeś/aś swoją dzisiejszą sesję nauki! :)</p>
                    : null
                }
                <p>Aktualny stan twojego pudełka z fiszkami:</p>
                <div className='summary-box-container'>
                    <SummaryBox boxNumber={ 'Jeszcze nie znasz' } boxAmount={ box[0].length } />
                    <div className='summary-box'>
                        { boxes }
                    </div>
                    <SummaryBox boxNumber={ 'Już umiesz' } boxAmount={ box[6].length } />
                </div>
                <NavLink to='/home' className='button button--important'>Kontynuuj</NavLink>
            </div>
        );
    };
};

Summary.propTypes = {
    box: PropTypes.array,
    user: PropTypes.bool,
    afterTest: PropTypes.bool
};

Summary.defaultProps = {
    afterTest: false
};

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
