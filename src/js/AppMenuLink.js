import React from 'react';
import { Link } from 'react-router';

export default class AppMenuLink extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Link
                    to={this.props.backLink}
                    href=""
                    className="t-small t-medium th-f-color t-ls1"
                    onClick={() => this.props.onSelection(this.props.appID)}>
                    {this.props.menuName}
                </Link>
            </div>
        )
    }
}