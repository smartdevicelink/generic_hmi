import React from 'react';

import AppHeader from './AppHeader';
import HScrollMenu from './HScrollMenu';

import iconPlaylists from '../img/icons/icon-playlists.svg';
import iconAlbums from '../img/icons/icon-albums.svg';
import iconStations from '../img/icons/icon-stations.svg';
import iconSongs from '../img/icons/icon-songs.svg';
import iconArtists from '../img/icons/icon-artists.svg';
import iconPodcasts from '../img/icons/icon-podcasts.svg';


let data = [
    { id: 1, class: 'with-icon', name: 'Playlists', image: iconPlaylists, link: '/inapplist' },
    { id: 2, class: 'with-icon', name: 'Albums', image: iconAlbums, link: '/inapplist' },
    { id: 3, class: 'with-icon', name: 'Stations', image: iconStations, link: '/inapplist' },
    { id: 4, class: 'with-icon', name: 'Podcasts', image: iconPodcasts, link: '/inapplist' },
    { id: 5, class: 'with-icon', name: 'Songs', image: iconSongs, link: '/inapplist'},
    { id: 6, class: 'with-icon', name: 'Artists', image: iconArtists, link: '/inapplist'},
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
