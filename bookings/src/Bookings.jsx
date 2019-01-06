import React, { Component } from 'react';
import crypto from 'crypto';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/partials/Header';
import Footer from './components/partials/Footer';
import Secu from './util/secu';
import './Global.css';

import Main from './components/Main';
import ErrorPage from './components/ErrorPage';

const firebase  = require('./util/database');
const config  = require('./util/config.json');

class Bookings extends Component {

    constructor() {
        super()
        this.state = {
            intent: null,
            event: null,
            hash: null,
            ref: null,
            verified: false
        }
    }

    getParams = (location) => {
        const searchParams = new URLSearchParams(location.search)
        return ({
            intent: searchParams.get('int'),
            event: searchParams.get('evt'),
            ref: searchParams.get('ref'),
        })
    }

    componentDidMount() {
        Secu.validateToken()
            .then((result)=>{
                if (result==='CSR_TOKEN_VALID') {
                    console.log('SR Tokens Verified')


                    console.log(firebase.database.ref())
                    Secu.generateSecurityFluff(4);
                }
            }).catch((err)=>{
                console.error(err)
            });
        
        let params = this.getParams(window.location), verified = false
        if (params.intent==='gen') params.event = 'any'

        let hashSequence = params.intent + config.clientKey + params.event
        let hash = crypto.createHash('sha256').update(hashSequence).digest('hex')
        if ( sessionStorage.getItem(config.hashToken) === hash ) verified = true

        this.setState({
            intent: params.intent,
            event: params.event,
            hash: hash,
            ref: params.ref,
            verified: true // verified
        })
    }

    render() {
        return (
            <div className="Bookings">
                <Header/>

                {
                    this.state.verified ? (
                        <section>
                            <Router>
                                <Switch>
                                    <Route path='/register/start'>
                                        <Main intent={this.state.intent} event={this.state.event}/>
                                    </Route>

                                    <Route component={ErrorPage} />
                                </Switch>
                            </Router>
                        </section>
                    ) : (
                        <ErrorPage/>
                    )
                }

                <Footer/>
            </div>
        );
    }
}

export default Bookings;
