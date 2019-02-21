import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SummaryBox from './SummaryBox';

const mapStateToProps = state => ({
    box: state.userReducer.flashcards
});

function Summary(props) {
    if (!props.box) return <NavLink to='/'><div className='button button--big'>Musisz się zalogować</div></NavLink>
    let boxes = [];
    for (let i = 1; i < 6; i++) {
        boxes.push(<SummaryBox key={i} boxNumber={i} boxAmount={props.box[i].length} />)
    }
    return (
        <div className='summary'>
            <h2>Podsumowanie</h2><br />
            {props.afterTest 
                ? <p>Gratulacje! Zakończyłeś/aś swoją dzisiejszą sesję nauki! :)</p>
                : null
            }
            <p>Aktualny stan twojego pudełka z fiszkami:</p>
            <div className='summary-box-container'>
                <SummaryBox boxNumber={'Jeszcze nie znasz'} boxAmount={props.box[0].length} />
                <div className='summary-box'>
                    {boxes}
                </div>
                <SummaryBox boxNumber={'Już umiesz'} boxAmount={props.box[6].length} />
            </div>
            <NavLink to='/home'><div className='button button--big'>Kontynuuj</div></NavLink>
        </div>
    );
}

Summary.propTypes = {
    box: PropTypes.array,
    afterTest: PropTypes.bool
}

Summary.defaultProps = {
    afterTest: false
}

export default connect(mapStateToProps)(Summary);