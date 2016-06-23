import React from 'react';

import AppHeader from './AppHeader';
import VScrollMenu from './VScrollMenu';

let data = [
    { id: 1, name: 'Viral Hits', info: '123,456 Followers', link: '/tilesonly' },
    { id: 2, name: 'Soak Up The Sun', info: '123,456 Followers', link: '/tilesonly' },
    { id: 3, name: 'Mood Booster', info: '123,456 Followers', link: '/tilesonly' },
    { id: 4, name: 'Have A Great Day!', info: '123,456 Followers', link: '/tilesonly' },
    { id: 5, name: 'Acoustic Summer', info: '123,456 Followers', link: '/tilesonly'},
    { id: 6, name: 'Happy Hits', info: '123,456 Followers', link: '/tilesonly'},
]

export default class InAppMenu extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="APPS" appName="Playlists" />
                <VScrollMenu data={data} />
            </div>
        )
    }
}
