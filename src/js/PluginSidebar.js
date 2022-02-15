import React from 'react';

export default class PluginSidebar extends React.Component {
    constructor(props) {
        super(props)
        this.state = this.getInitialState()
    }

    getEnabledWebPlugins() {
        var pluginList = []
        var plugin = window.flags.VRPlugin
        if (plugin && plugin.Url && plugin.Enabled) {
            if (!plugin.TestViewTitle) {
                plugin.TestViewTitle = "Voice Recognition";
            }
            pluginList.push(plugin)
        }

        plugin = window.flags.VIPlugin
        if (plugin && plugin.Url && plugin.Enabled) {
            if (!plugin.TestViewTitle) {
                plugin.TestViewTitle = "Vehicle Info";
            }
            pluginList.push(plugin)
        }
        
        return pluginList
    }

    getPluginFrame(plugin, index) {
        var classes = "plugin-view"
        if (!plugin.TestViewEnabled || this.state.selection !== plugin.TestViewTitle.toLowerCase()) {
            classes += " hidden"
        }

        return (
            <iframe className={classes} title={plugin.TestViewTitle} src={plugin.Url} frameBorder="0" />
        )
    }

    getTestViewPlugins(plugins) {
        return plugins.filter(val => (val.TestViewEnabled))
    }

    getInitialState() {
        let pluginList = this.getEnabledWebPlugins().filter(val => (val.TestViewEnabled))
        if (pluginList.length === 0) {
            return {
                selection: null
            }
        }
        let defaultSelection = pluginList[0].TestViewTitle.toLowerCase()
        return {
            selection: defaultSelection
        }
    }
    
    onSelection(event) {
        console.log("Selection: " + event.target.value)
        this.setState({selection: event.target.value})
    }

    render() {
        var pluginList = this.getEnabledWebPlugins()
        var pluginFrameList = []

        for (let i = 0; i < pluginList.length; i++) {
            pluginFrameList.push(this.getPluginFrame(pluginList[i], i))
        }

        var testViewPlugins = pluginList.filter(val => (val.TestViewEnabled))
        let showSidebar = (testViewPlugins.length !== 0)

        return (
            <div className="plugin-sidebar">
                {showSidebar && 
                    <select name="plugin-view-selector" onChange={this.onSelection.bind(this)} value={this.state.selection}>
                        {
                            testViewPlugins.map(val => (
                                <option value={val.TestViewTitle.toLowerCase()}>{val.TestViewTitle}</option>
                            ))
                        }
                    </select>
                }
                {pluginFrameList}
            </div>
        )
    }
}
