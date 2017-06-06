import React from 'react';

import AppHeader from '../../containers/Header';
import { LargeGraphic } from '../../containers/Metadata';

export default class LargeGraphicOnly extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <LargeGraphic class="large-graphic-only"/>
            </div>
        )
    }
}