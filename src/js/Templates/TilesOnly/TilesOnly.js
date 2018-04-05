import React from 'react';

import AppHeader from '../../containers/Header';
import { SoftButtons } from '../../containers/Buttons';

export default class TilesOnly extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <div className="tiles-only-template">
                    <SoftButtons class="tiles-only-container"/>
                </div>
            </div>
        )
    }
}
