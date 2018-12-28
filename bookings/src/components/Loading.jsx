import React, { Component } from 'react';
import '../Global.css';
import './css/Loading.css';

class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <div className="loading-rotary">
                    <div className="rotary"></div>
                </div>
                <p className="loading-x">x</p>
            </div>
        );
    }
}

export default Loading;