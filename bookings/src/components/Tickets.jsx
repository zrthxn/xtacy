import React, { Component } from 'react';

import '../Global.css'; 

// non competitve PAID i.e. Ticketed events

class Tickets extends Component {
    constructor() {
        super();
        this.state = {
            requiredFulfilled: false,
            completion: false,
            data : {
                regName: null
            },
            required: [
                'regName'
            ]
        }
    }

    // let hash = crypto.createHash('sha256').update(hashSequence).digest('hex')
    handleChange = (event) => {
        let payload = null, truth = true, _data = this.state.data
        if ( event.target.value!=="" ) payload = event.target.value
        _data[event.target.id] = payload
        for ( let field of this.state.required )
            if ( this.state.data[field]===null || (event.target.id===field && payload===null) )
                truth = false 
        this.setState({
            requiredFulfilled: truth,
            data: _data
        })
    }

    action = () => {
        
    }

    render() {
        return (
            <div className="Tickets">
            
            </div>
        );
    }
}

export default Tickets;