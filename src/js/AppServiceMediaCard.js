import React from 'react';
import MediaServiceDataImage from "./MediaServiceDataImage";

export default class AppServiceMediaCard extends React.Component {
    render() {
        if (!this.props.mediaActive || !this.props.mediaData) {
            return null;
        }

        var mediaData = this.props.mediaData;

        var titleLine = mediaData.title ? (
            <p className="t-large t-medium th-f-color ">
                {mediaData.title}
            </p>
        ) : null;

        var artistLine = mediaData.artist ? (
            <p className="t-light t-small th-f-color">
                {mediaData.artist}
            </p>) : null;

        var albumLine = mediaData.album ? (
            <p className="t-light t-small th-f-color">
                {mediaData.album}
            </p>
        ) : null;

        return (
            <div className="app-service-media-card app-service-medium-tab">
                <MediaServiceDataImage image={mediaData.mediaImage} />
                {titleLine}
                {artistLine}
                {albumLine}
                <p className="app-service-card-footer th-f-color">
                    MEDIA
                </p>
            </div>
        )
    }
}
