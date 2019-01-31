import React from 'react';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

const ErrorPage = () => {
    const errorCode = localStorage.getItem('payment-error-code')
    localStorage.removeItem('payment-error-code')
    var errorContent = 'This page isn\'t working.'

    switch (errorCode) {
        case 'CSRF_TIMEOUT':
            errorContent = 'The page timed out.'
            break
        case 'SERVER_ERROR':
            errorContent = 'There was a server error.'
            break
        case 'PORTAL_ERROR':
            errorContent = 'The payment service may be down.'
            break
        case 'RESPONSE_HASH_MISMATCH':
            errorContent = 'The payment couldn\'t be verified.'
            break
        default:
            break
    }

    return (
        <section className="ErrorPage">
            <div className="container">
                <Loading/>
                <h3>that doesnt<br/>look right</h3>

                <p className="center">
                    <b>{ errorContent }</b><br/><br/>
                    Try to reload the page or go back. If the issue persists, tell us about it at <a href="mailto:tech@xtacy.org">tech@xtacy.org</a>
                </p>
            </div>
        </section>
    );
}

export default ErrorPage;