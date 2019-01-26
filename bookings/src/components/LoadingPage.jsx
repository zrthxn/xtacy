import React, { Component } from 'react';
import ErrorPage from './ErrorPage';
import Loading from './partials/Loading';

import './css/Snippets.css';
import '../Global.css';

class LoadingPage extends Component {
    constructor() {
        super();
        this._isMounted = false;
        this.state = { timeOut: false }
    }

    componentDidMount() {
        this._isMounted = true;
        setTimeout(this.Timer, this.props.timeOut)
    }

    Timer = () => this._isMounted && this.setState({ timeOut: true })
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <div>
            {
                this.state.timeOut ? (
                    <ErrorPage/>
                ) : (
                    <div className="LoadingPage">
                        <div className="container">
                            <Loading/>
                            <p className="center"> loading </p>
                        </div>
                    </div>
                )
            }
            </div>
           
            
        );
    }    
}

export default LoadingPage;