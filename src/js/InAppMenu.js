import React from 'react';

import AppHeader from './containers/Header';
import { VMenu, HMenu } from './containers/Menu';
import store from './store'

export default class InAppMenu extends React.Component {
    render() {
        const state = store.getState()
        const app = state.ui[state.activeApp]
        var menu = (app && app.menuLayout === "LIST") ? (<VMenu/>) : (<HMenu/>);

        return (
            <div>
<<<<<<< HEAD
                <AppHeader backLink="/" menuName="Back"/>
                <Menu />
=======
                <AppHeader backLink="/" menuName="APPS"/>
                { menu }
>>>>>>> origin/develop
            </div>
        )
    }
}
