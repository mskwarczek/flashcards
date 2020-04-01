import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';

import SummaryBox from './SummaryBox';
import LoginRedirect from './LoginRedirect';
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
        const { box, afterTest, user, t } = this.props;
        if (!user) {
            return (
                <div>
                    <h2>{t('summary')}</h2>
                    <LoginRedirect />
                </div>
            );
        };
        if (box.length === 0) {
            return (
                <div>
                    <h2>{t('summary')}</h2>
                    <p>{t('emptyBox')}</p><br />
                    <NavLink to='/test' className='button button--important'>{t('test')}</NavLink><br />
                    <NavLink to='/home' className='button'>{t('back')}</NavLink>
                </div>
            );
        };
        let boxes = [];
        for (let i = 1; i < 6; i++) {
            boxes.push(<SummaryBox key={ i } boxNumber={ i } boxAmount={ box[i].length } />)
        };
        return (
            <div className='summary'>
                <h2>{t('summary')}</h2><br />
                { afterTest
                    ? <p>{t('congratulations')}</p>
                    : null
                }
                <p>{t('boxState')}</p>
                <div className='summary-box-container'>
                    <SummaryBox boxNumber={t('unknown')} boxAmount={ box[0].length } />
                    <div className='summary-box'>
                        { boxes }
                    </div>
                    <SummaryBox boxNumber={t('known')} boxAmount={ box[6].length } />
                </div>
                <NavLink to='/home' className='button button--important'>{t('continue')}</NavLink>
            </div>
        );
    };
};

Summary.propTypes = {
    box: PropTypes.array,
    user: PropTypes.bool,
    afterTest: PropTypes.bool,
    setUserData: PropTypes.func.isRequired
};

Summary.defaultProps = {
    afterTest: false
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation('summary')(Summary));
