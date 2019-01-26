import React, { Component } from 'react';
import crypto from 'crypto';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/partials/Header';
import Footer from './components/partials/Footer';
import Secu from './util/secu';
import './Global.css';

import Main from './components/Main';
import LoadingPage from './components/LoadingPage';
import ErrorPage from './components/ErrorPage';

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
        // let params = this.getParams(window.location), verified = false
        // if (params.intent==='gen') params.event = 'any'

        // let hashSequence = params.intent + config.clientKey + params.event
        // let hash = crypto.createHash('sha256').update(hashSequence).digest('hex')
        // if ( sessionStorage.getItem(config.hashToken) === hash ) verified = true

        // this.setState({
        //     intent: params.intent,
        //     event: params.event,
        //     hash: hash,
        //     ref: params.ref,
        //     verified: true
        // })
        Secu.validateToken().then((result)=>{
            if (result==='CSR_TOKEN_VALID' || result==='CSR_TOKEN_GEN' || result==='CSR_TOKEN_GEN' ||
                    result==='CSR_TOKEN_RENEW' || result==='CSR_TIME_VALID') {
                console.log('SR Tokens Verified')
                Secu.generateSecurityFluff(4);

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
                    verified: verified
                })
            }
        }).catch((err)=>{
            console.error(err)
        });
    }

    render() {
        return (
            <div className="Bookings">
                <Header/>

                {
                    this.state.verified ? (
                        <section>
                            <Router basename={'/book'}>
                                <Switch>
                                    <Route path={'/start'}>
                                        <Main intent={this.state.intent} event={this.state.event}/>
                                    </Route>

                                    <Route component={ErrorPage} />
                                </Switch>
                            </Router>
                        </section>
                    ) : (
                        <LoadingPage timeOut={2500}/>
                    )
                }

                <Footer/>
            </div>
        );
    }
}

export default Bookings;
