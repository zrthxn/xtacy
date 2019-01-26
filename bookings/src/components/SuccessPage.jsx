import React from 'react';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

const SuccessPage = () => {
    return (
        <div className="SuccessPage">
            <div className="container">
                <Loading/>
                <h3>Success!</h3>

                <p className="center">
                    You have successfully registered!<br/>
                </p>
            </div>
        </div>        
    );
}

export default SuccessPage;