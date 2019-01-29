import React, { Component } from 'react';
import Booking from '../util/booking';
import '../Global.css';

import Register from './Register';
import Tickets from './Tickets';
import Compete from './Compete';
import LoadingPage from './LoadingPage';
import ErrorPage from './ErrorPage';

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
            this.setState({
                intent: 'tic',
                event: 'dastan',
                eventData: {
                    "title": "Mehmood Bhai",
                    "eventId": "dastan",
                    "dates": "16",
                    "type": "tic",
                    "metadata": {
                        "time": "1:00 PM",
                        "paid": true,
                        "price": 5,
                        "teams": false,
                        "teamSize": null,
                        "teamSizeType": null,
                        "collectTeamGit": false,
                        "conductedBy": "Daniyal"
                    }
                },
                loaded: true
            })
            // ---------------------------------------------- //
            // Booking.getEventData(this.props.event)
            //     .then((eventData)=>{
            //         this.setState({
            //             intent: this.props.intent,
            //             event: this.props.event,
            //             eventData: eventData.data,
            //             loaded: true
            //         })
            //     }).catch((err)=>{
            //         console.log(err)
            //     })
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
                        <Register/>
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