import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 75
        };
    }

    render() {

        let progress = {
            width: this.state.progress + "%"
        }

        return (
            <div className="progress-bar">
                <div className="progress-bar__progress" style={ progress }></div>
            </div>
        )
    }
}
