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
                <ControlBarItem icon={iconRepeat}/>
                <ControlBarItem icon={iconSeekLeft}/>
                <ControlBarItem icon={iconPlay}/>
                <ControlBarItem icon={iconSeekRight}/>
                <ControlBarItem icon={iconPlaylists}/>
            </div>
        )
    }
}
