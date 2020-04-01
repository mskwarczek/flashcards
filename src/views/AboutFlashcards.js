import React from 'react';
import { useTranslation } from 'react-i18next';

const AboutFlashcards = (props) => {

    const { t } = useTranslation('about');

    return (
        <div>
            <h2>{t('title')}</h2>
            <div>
                <h3>{t('whatAreFlashcards')}</h3>
                <p>{t('whatAreFlashcardsDescription')}</p>
            </div>
            <div>
                <h3>{t('howToUseFlashcards')}</h3>
                <p>
                    {t('howToUseFlashcardsDescription_1')}
                    <span className='highlight'>{t('test')}</span>
                    {t('howToUseFlashcardsDescription_2')}
                    <span className='highlight'>{t('training')}</span>
                    {t('howToUseFlashcardsDescription_3')}
                </p>
            </div>
            <div className='button button--important' onClick={ props.history.goBack }>{t('back')}</div>
        </div>
    );
};

export default AboutFlashcards;
