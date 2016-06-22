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
            <div className="progress-bar th-bg-color th-bb-color">
                <div className="progress-bar__progress" style={ progress }></div>
            </div>
        )
    }
}
