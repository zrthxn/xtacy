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

                <div>
                    <p className="center">
                        Your registration was successfully recieved.<br/><br/>
                        Your registration number is { this.props.rgn }

                        We have sent you a confirmation email. If you don't recieve 
                        it in the next few minutes, please contact us 
                        at <a href="mailto:support@xtacy.org">support@xtacy.org</a>

                        <h3>Welcome to xtacy</h3>

                        Please read the terms and conditions.

                        Home
                    </p>
                </div>
                
            </div>
        </div>        
    );
}

export default SuccessPage;