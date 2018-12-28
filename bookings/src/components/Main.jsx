import React, { Component } from 'react';
import '../Global.css';

const firebase  = require('../util/database');

class Main extends Component {
    componentDidMount() {
        // load the user data from Local Storage i.e. pwd and username and user id
    }

    render() {
        return (
            <div className="Main">
                <section>
                    <h2>Main</h2>

                    <p>{this.props.data}</p>

                    <div className="container center">
                        <input type="text" className="textbox" placeholder="Name"/>
                        <input type="number" className="textbox" placeholder="Phone"/>
                        <input type="text" className="textbox" placeholder="Institution"/>
                        <input type="text" className="textbox" placeholder="y u wanna come m8?"/>
                    </div>
                </section>
            </div>
        );
    }
}

export default Main;