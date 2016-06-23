import { connect } from 'react-redux'
import HScrollMenu from '../HScrollMenu'

let data = [
    { id: 1, class: 'with-image', name: 'Spotify', image: '/src/img/app-spotify.png', link: '/media' },
    { id: 2, class: 'with-image', name: 'NPR', image: '/src/img/app-npr.png', link: '/media' },
    { id: 3, class: 'with-image', name: 'VSCO', image: '/src/img/app-vsco.png', link: '/media' },
    { id: 4, class: 'with-image', name: 'Waze', image: '/src/img/app-waze.png', link: '/media' },
    { id: 5, class: 'with-image', name: 'Starbucks', image: '/src/img/app-starbucks.png', link: '/media'},
    { id: 6, class: 'with-image', name: 'Overcast', image: '/src/img/app-overcast.png', link: '/media'},
]

const mapStateToProps = (state) => {
    return {data: data}
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

const AppList = connect(
    mapStateToProps,
    mapDispatchToProps
)(HScrollMenu)

export default AppList