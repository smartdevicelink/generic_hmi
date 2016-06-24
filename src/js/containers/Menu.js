import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import bcController from '../Controllers/BCController'

///////////////////// TEMP ////////////////////////////////////////////////////

import iconPlaylists from '../../img/icons/icon-playlists.svg';
import iconAlbums from '../../img/icons/icon-albums.svg';
import iconStations from '../../img/icons/icon-stations.svg';
import iconSongs from '../../img/icons/icon-songs.svg';
import iconArtists from '../../img/icons/icon-artists.svg';
import iconPodcasts from '../../img/icons/icon-podcasts.svg';

let data = [
    { id: 1, class: 'with-icon', name: 'Playlists', image: iconPlaylists, link: '/media' },
    { id: 2, class: 'with-icon', name: 'Albums', image: iconAlbums, link: '/inapplist' },
    { id: 3, class: 'with-icon', name: 'Stations', image: iconStations, link: '/inapplist' },
    { id: 4, class: 'with-icon', name: 'Podcasts', image: iconPodcasts, link: '/inapplist' },
    { id: 5, class: 'with-icon', name: 'Songs', image: iconSongs, link: '/inapplist'},
    { id: 6, class: 'with-icon', name: 'Artists', image: iconArtists, link: '/inapplist'},
]

//////////////////////////////////////////////////////////////////////

const mapStateToProps = (state) => {
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default Menu