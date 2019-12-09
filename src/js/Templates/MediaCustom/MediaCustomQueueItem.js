import React from 'react';

class MediaCustomQueueItem extends React.Component {
    render() {
        const bgColor = this.props.theme ? '#373737' : '#FFFFFF';
        const txtColor = this.props.theme ? '#FFFFFF' : '#000000';

        return (<div key={this.props.index} onClick={this.props.onClick} 
                className="media-custom-template__queue-item" style={{background: bgColor}}>
            <div key="0" style={{color: txtColor}} className="media-custom-template__queue-item__index">{this.props.index} </div>
            <div key="1" className="media-custom-template__queue-item__info">
                <p key="0" style={{color: txtColor}} className="media-custom-template__queue-item__info__title">{this.props.song}</p>
                <p key="1" style={{color: txtColor}} className="media-custom-template__queue-item__info__artist">{this.props.artist}</p>
            </div>
        </div>)
    }
}

export default MediaCustomQueueItem