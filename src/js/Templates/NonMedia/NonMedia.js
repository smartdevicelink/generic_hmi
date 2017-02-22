import React from 'react';

import AppHeader from '../../containers/Header';
import { NonMediaMetadata } from '../../containers/Metadata';
import { NonMediaSoftButtons } from '../../containers/Buttons';

export default class NonMedia extends React.Component {
    constructor() {
        super();
    }

    render() {
        //console.log(this.props);
        console.log(NonMediaMetadata);
        return (
            <div className="non-media-template">
                <AppHeader backLink="/" menuName="Apps"/>
                <NonMediaMetadata />
                <NonMediaSoftButtons />
            </div>
        )
    }
}