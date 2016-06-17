import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="progress-bar">
                <div className="progress-bar__progress"></div>
            </div>
        )
    }
}
