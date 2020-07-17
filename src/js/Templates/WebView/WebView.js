import React from 'react';
import { connect } from 'react-redux'
import AppHeader from '../../containers/Header';

class WebView extends React.Component {
    render() {
        return (
            <div className="webView">
                <AppHeader backLink="/" menuName="Apps" icon="false"/>
            </div>
        )
    }
}

const mapStateToProps = (state) => { 
    return {
        
    };
};

export default connect(mapStateToProps)(WebView);