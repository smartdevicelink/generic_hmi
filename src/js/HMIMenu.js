import React from 'react';

import AppHeader from './AppHeader';
import HScrollMenu from './HScrollMenu';

let data = [
    { id: 1, class: 'with-graphic', name: 'Spotify', image: '/src/img/app-spotify.png', link: '/media' },
    { id: 2, class: 'with-graphic', name: 'NPR', image: '/src/img/app-npr.png', link: '/media' },
    { id: 3, class: 'with-graphic', name: 'VSCO', image: '/src/img/app-vsco.png', link: '/media' },
    { id: 4, class: 'with-graphic', name: 'Waze', image: '/src/img/app-waze.png', link: '/media' },
    { id: 5, class: 'with-graphic', name: 'Starbucks', image: '/src/img/app-starbucks.png', link: '/media'},
    { id: 6, class: 'with-graphic', name: 'Overcast', image: '/src/img/app-overcast.png', link: '/media'},
]

export default class HMIMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="" appName="Menu" />
                <HScrollMenu data={data} />
            </div>
        )
    }
}
