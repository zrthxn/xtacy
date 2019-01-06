import React from 'react';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

const ErrorPage = () => {
    return (
        <section className="ErrorPage">
            <div className="container">
                <Loading/>
                <h3>that doesnt<br/>look right</h3>

                <p className="center">
                    The page you're trying to visit doesn't seem to be working. 
                    Try to reload the page or go back.<br/>
                    If the issue persists, tell us about it at <a href="mailto:tech@xtacy.org">tech@xtacy.org</a>
                </p>
            </div>
        </section>
    );
}

export default ErrorPage;