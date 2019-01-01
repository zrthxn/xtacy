import React, { Component } from 'react';
import Router from 'react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import Loading from './components/Loading';

import Secu from './util/secu';

import './Global.css';

const firebase  = require('./util/database');

class Bookings extends Component {

    constructor() {
        super();
        this.state = {
            intent: null,
            event: null,
            track: null,
            ref: null
        }
    }

    getParams = function (location) {
        const searchParams = new URLSearchParams(location.search);
        return ({
            intent: searchParams.get('intent'),
            event: searchParams.get('event'),
            track: searchParams.get('track'),
            ref: searchParams.get('ref'),
        });
    }

    componentDidMount() {
        Secu.validateToken()
            .then((result)=>{
                if (result==='CSR_TOKEN_VALID') {
                    console.log('SR Tokens Verified');
                    console.log(firebase.database.ref());
                    Secu.generateSecurityFluff(4);
                }
            }).catch((err)=>{
                console.error(err); // change later to redirect to homepage
            });

        // load the user data from Local Storage i.e. pwd and username and user id
        
        var params = this.getParams(window.location);
        this.setState({
            intent: params.intent,
            event: params.event,
            track: params.track,
            ref: params.ref
        })
    }

    render() {
        return (
            <div className="Bookings">
                <Header/>
                    <section>
                        <h1>Bookings</h1>

                        {/* <Router>
                            
                        </Router> */}

                        {
                            this.state.intent==="book" ? <Main data={this.state.event}/> : <Loading/>
                        }
                    </section>
                <Footer/>
            </div>
        );
    }
}

export default Bookings;
