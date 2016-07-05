import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'
import bcController from '../Controllers/BCController'

/*

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
cmdID: cmdID,
parentID: menuParams.parentID,
position: menuParams.position,
menuName: menuParams.menuName,
cmdIcon: cmdIcon

*/
const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var menu = state.ui[activeApp].menu
    var data = menu.map((command) => {
        var dataClass = null
        if (command.cmdIcn) {
            dataClass = 'with-icon'
        }
        var link = '/media' // TODO: only supports media right now
        if (command.subMenu) {
            link = '/inapplist'
        }
        return {
            cmdID: command.cmdID,
            class: dataClass,
            name: command.menuName,
            image: command.cmdIcon,
            appID: activeApp,
            link: link
        }
    })
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID) => {
            console.log('selected menu item', appID, cmdID)
        }
    }
}

const Menu = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default Menu