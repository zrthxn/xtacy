import React, { Component } from 'react';
import Booking from './util/booking';
import './Global.css';

import Register from './components/Register';
import Tickets from './components/Tickets';
import Compete from './components/Compete';
import LoadingPage from './components/LoadingPage';
import ErrorPage from './components/ErrorPage';
import Loading from './components/partials/Loading';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            intent: null,
            event: null,
            eventData: null,
            loaded: false
        }
    }

    componentDidMount() {
        if (this.props.intent!=='gen')
            // DEBUG ======================================== //
            // this.setState({
            //     intent: this.props.intent,
            //     event: 'dastan',
            //     eventData: {
            //         title: 'Mehmood Bhai',
            //         eventId: 'dastan',
            //         dates: 16,
            //         type: this.props.intent,
            //         published: true,
            //         metadata: {
            //             time: '1:00 PM',
            //             paid: true,
            //             price: 5,
            //             teams: false,
            //             teamSize: null,
            //             teamSizeType: null,
            //             collectTeamGit: false,
            //             conductedBy: 'Daniyal'
            //         }
            //     },
            //     loaded: true
            // })
            // ---------------------------------------------- //
            Booking.getEventData(this.props.event)
                .then((eventData)=>{
                    this.setState({
                        intent: this.props.intent,
                        event: this.props.event,
                        eventData: eventData.data,
                        loaded: true
                    })
                }).catch((err)=>{
                    console.log(err)
                })
            // ============================================== //
        else
            this.setState({
                intent: this.props.intent,
                loaded: true
            })
    }

    render() {
        return (
            <div className="Main">
            {
                this.state.loaded ? (
                    this.state.intent!== 'gen' ? (
                        this.state.eventData.published ? (
                            this.state.intent!=='com' ? (
                                this.state.intent!=='tic' ? (
                                    <ErrorPage/>
                                ) : (
                                    <Tickets eventData={this.state.eventData}/>
                                )
                            ) : (
                                <Compete eventData={this.state.eventData}/>
                            )
                        ) : (
                            <div className="container">
                                <Loading/>
                                <h2>Not Published</h2>
                                <p>Registrations are disabled for this event</p>
                            </div>
                        )
                    ) : (
                        <Register eventData={this.state.eventData}/>
                    )
                ) : (
                    <LoadingPage timeOut={2500}/>
                )
            }
            </div>
        );
    }
}

export default Main;