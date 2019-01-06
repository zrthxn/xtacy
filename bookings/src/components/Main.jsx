import React, { Component } from 'react';
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
        this.setState({
            intent: this.props.intent,
            event: this.props.event,
            eventData: {
                "title" : "Hackathon Real Paid",
                "eventId" : "hackrp",
                "metadata" : {
                    "time" : "1:00 PM",
                    "paid" : true,
                    "price" : 10,
                    "teams" : true,
                    "teamSize" : 4,
                    "collectTeamGit": true,
                    "conductedBy" : "Omair"
                }
            },
            loaded: true
        })
        // if (this.props.intent!=='gen')
        //     Booking.getEventData(this.props.event)
        //         .then((eventData)=>{
        //             if (eventData.validation)
        //                 this.setState({
        //                     intent: this.props.intent,
        //                     event: this.props.event,
        //                     eventData: eventData.data,
        //                     loaded: true
        //                 })
        //         }).catch((err)=>{
        //             console.log(err)
        //             this.setState({ loaded: true })
        //         })
        // else
        //     this.setState({
        //         intent: this.props.intent,
        //         loaded: true
        //     })
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