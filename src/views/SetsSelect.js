import React from 'react';
import { useTranslation } from 'react-i18next';

const SetsSelect = (props) => {

    const { t } = useTranslation('sets');

    const selected = props.sets.filter(set => set._id === props.value)[0];
    return (
        <div className='select-container'>
            <select name={props.name } onChange={ props.onChange } value={ props.value }>
                { props.sets.length > 0
                    ? props.sets.map(set => {
                        return <option key={ set._id } value={ set._id }>{ set.name } [{ set.lang }]</option>
                    })
                    : <option>{t('loadingSets')}</option>
                }
            </select>
            <p className='small-screen-info'>{t('chosen')}: { selected && selected.name }</p>
        </div>
    );
};

export default SetsSelect;
