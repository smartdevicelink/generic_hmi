import React from 'react';

export default class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="control-bar">
                <div className="control-bar__control"></div>
                <div className="control-bar__control"></div>
                <div className="control-bar__control"></div>
                <div className="control-bar__control"></div>
                <div className="control-bar__control"></div>
            </div>
        )
    }
}
