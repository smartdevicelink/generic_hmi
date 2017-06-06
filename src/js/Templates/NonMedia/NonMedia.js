import React from 'react';

import AppHeader from '../../containers/Header';
import { NonMediaMetadata } from '../../containers/Metadata';
import { SoftButtons } from '../../containers/Buttons';

export default class NonMedia extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div className="non-media-template">
                <AppHeader backLink="/" menuName="Apps"/>
                <NonMediaMetadata />
                <SoftButtons class="non-media"/>
            </div>
        )
    }
}