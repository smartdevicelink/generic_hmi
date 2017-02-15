import React from 'react';

import AppHeader from '../../containers/Header';
import { NonMediaMetadata } from '../../containers/Metadata';
import { NonMediaSoftButtons } from '../../containers/Buttons';

export default class NonMedia extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <NonMediaMetadata />
                <NonMediaSoftButtons />
            </div>
        )
    }
}