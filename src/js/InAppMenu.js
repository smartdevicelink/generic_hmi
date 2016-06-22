import React from 'react';

import AppHeader from './AppHeader';
import HScrollMenu from './HScrollMenu';

let data = [
    { id: 1, name: 'Playlists', image: '/src/img/app-spotify.png', link: '/media' },
    { id: 2, name: 'Albums', image: '/src/img/app-npr.png', link: '/media' },
    { id: 3, name: 'Stations', image: '/src/img/app-vsco.png', link: '/media' },
    { id: 4, name: 'Browse', image: '/src/img/app-waze.png', link: '/media' },
    { id: 5, name: 'Saved', image: '/src/img/app-starbucks.png', link: '/media'},
    { id: 6, name: 'Artists', image: '/src/img/app-overcast.png', link: '/media'},
]

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="APPS" appName="Spotify" />
                <HScrollMenu data={data} />
            </div>
        )
    }
}
