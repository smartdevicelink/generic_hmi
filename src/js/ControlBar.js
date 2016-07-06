import React from 'react';
import ControlBarItem from './ControlBarItem'
import iconSeekLeft from '../img/icons/icon-seek-left.svg';
import iconSeekRight from '../img/icons/icon-seek-right.svg';
import iconPlay from '../img/icons/icon-play.svg';
import iconPlaylists from '../img/icons/icon-playlists.svg';
import iconRepeat from '../img/icons/icon-repeat.svg';


export default class ControlBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="control-bar th-bg-color">
                <ControlBarItem class="tertiary" icon={iconRepeat}/>
                <ControlBarItem class="secondary" icon={iconSeekLeft}/>
                <ControlBarItem class="primary" icon={iconPlay}/>
                <ControlBarItem class="secondary"icon={iconSeekRight}/>
                <ControlBarItem class="tertiary" icon={iconPlaylists}/>
            </div>
        )
    }
}
