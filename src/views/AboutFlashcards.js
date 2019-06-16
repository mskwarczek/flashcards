import React from 'react';

const AboutFlashcards = (props) => {

    return (
        <div>
            <h2>O fiszkach</h2>
            <div>
                <h3>Czym są fiszki?</h3>
                <p>Fiszka, to zapisana na obu stronach kartka, służąca do nauki. Na jednej stronie znajduje się pytanie lub pojęcie, którego chcesz się nauczyć. Na drugiej stronie znajduje się odpowiedź lub wyjaśnienie. Przykładowo na jednej stronie może być słowo zapisane w języku polskim, nazwa wydarzenia historycznego lub termin z dowolnej dziedziny, a na drugiej stronie to samo słowo w języku angielskim, data wydarzenia lub definicja terminu. Fiszki należy przeglądać patrząc tylko na pierwszą stronę i próbując udzielić odpowiedzi na zawarte na niej pytanie. Następnie trzeba zajrzeć na drugą stronę i sprawdzić, czy udzielona odpowiedź była poprawna.</p>
            </div>
            <div>
                <h3>Jak korzystać z fiszek?</h3>
                <p>Oryginalnie przy nauce z fiszek korzystano z pudełka z przegródkami. W aplikacji Flashcards jest podobnie, ale pudełka mają postać wirtualną. Początkowo wszystkie fiszki znajdują się w przegródce "zero", poza pudełkiem. Przgródek w pudełku jest 5. Po wybraniu opcji <span className='highlight'>Test</span> z menu głównego, przegródka z numerem 1 jest automatycznie uzupełniana do kilku-kilkunastu fiszek. Fiszki wyświetlają się kolejno od przegródki z najwyższym numerem (5). Jeśli dany termin jest Ci znany, to fiszka zostaje przeniesione do wyższej przegródki. Jeśli była już w przegródce numer 5, to zostaje przeniesiona poza pudełko - to już umiesz. Jeśli Twoja odpowiedź była nieprawidłowa - fiszka zawsze trafia do przegródki z numerem 1. Do testu możesz podchodzić dowolną liczbę razy, ale optymalnym rozwiązaniem jest wykonywanie go tylko raz dziennie tak, aby mózg zdążył zapomnieć niektóre pojęcia, zanim podejdziesz do kolejnego testu. Jeśli jednak chcesz nadal się uczyć, możesz wybrać w menu głównym opcję <span className='highlight'>Trening</span> - wtedy wszystkie fiszki będą wyświetlały się w losowej kolejności i możesz uczyć się tak długo, jak zechcesz.</p>
            </div>
            <div className='button button--important' onClick={ props.history.goBack }>Powrót</div>
        </div>
    );
};

export default AboutFlashcards;
