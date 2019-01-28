import React from 'react';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

const TemporaryLoadingScreen = () => {
    return (
        <div className="TemporaryLoadingScreen">
            <div className="container">
                <Loading/>
                <p className="center"> loading </p>
            </div>
        </div>
    );
}

export default TemporaryLoadingScreen;