import React from 'react';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

const SuccessPage = (props) => {
    return (
        <div className="SuccessPage">
            <div className="container fit">
                <Loading/>
                <h3>Success!</h3>

                <div>
                    {
                        props.payment ? (
                            <b>Your payment was successful</b>
                        ) : (
                            <b>Your registration was successful</b>
                        )
                    }
                    
                    <br/><br/>
                    Your registration number is
                    <div className="rgn">{ props.rgn }</div>
                    <br/>

                    <p className="center">
                        We have sent a confirmation message on the email you entered. If you don't recieve 
                        it in the next few minutes, please contact us 
                        at <a href="mailto:support@xtacy.org">support@xtacy.org</a>
                    </p>

                    <span><a href="/terms">Terms</a> | <a href="/">Home</a></span>
                </div>
                
            </div>
        </div>
    );
}

export default SuccessPage;