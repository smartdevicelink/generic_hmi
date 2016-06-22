import React from 'react';

import AppHeader from './AppHeader';
import TilesOnlyList from './TilesOnlyList';

let data = [
    { id: 1, image: '/src/img/albums/image-hunchback.jpeg', link: '/media' },
    { id: 2, image: '/src/img/albums/image-kurt-vile-sessions.jpg', link: '/media' },
    { id: 3, image: '/src/img/albums/image-kurt-vile-world.jpg', link: '/media' },
    { id: 4, image: '/src/img/albums/image-outta-reach.jpeg', link: '/media' },
    { id: 5, image: '/src/img/albums/image-pretty-daze-delux.jpg', link: '/media'},
    { id: 6, image: '/src/img/albums/image-pretty-daze.jpg', link: '/media'},
    { id: 7, image: '/src/img/albums/image-smoke-ring.jpg', link: '/media'},
    { id: 8, image: '/src/img/albums/image-square-shells.jpg', link: '/media'},
]

export default class TilesOnly extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                <AppHeader backLink="/" menuName="Apps" appName="Albums" />
                <TilesOnlyList data={data} />
            </div>
        )
    }
}
