import React from 'react';
import './help.css';

class Help extends React.Component {

    render() {
        return (
            <div className="help">
                <div className="english">
                    <div className="header">About</div>
                    <div className="para">
                        Compiled by Hakimul Ummmah Maulana Ashraf Ali Thanwi (R)<br />
                        Bengali Translation - Allama Shamsul Haque Faridpuri (R) and Allama Azizul Haque (R)<br />
                        English Translation - Maulana Muhammed Mahomedy
                    </div>
                    <hr></hr>
                    <div className="header">About this application</div>
                    <div className="para">
                        I wanted to create an application on this book for a long time. I have benefitted from it tremendously. 
                        I spent months trying to make it useful and organized.
                        Even only one person gets benefitted, I will consider my effort worth it.<br/><br/>
                        O my Sustainer! I am in need of the good that You bestow upon me.<br/>
                        Our Lord! Accept (this service) from us. Indeed! You are the All-Hearer, the All-Knower.
                    </div>
                    <hr></hr>
                    <div className="header">Help</div>
                    <div className="para">
                        Press 'k' to go to next prayer.<br />
                        Press 'j' to go to previous prayer.<br />
                        Press 'l' to go to next day.<br />
                        Press 'h' to go to previous day.<br />
                        <br />
                        Press 'b' to toggle bookmark this prayer.<br />
                        Press 'ctrl + b' to go to bookmarks.<br />
                        Press 'n' to go to next bookmarked prayer.<br />
                        Press 'v' to go to previous bookmarked prayer.
                    </div>
                </div>
                <button onClick={() => this.props.showComponent("content")}>OK</button>
            </div>
        );
    }
}

export default Help;