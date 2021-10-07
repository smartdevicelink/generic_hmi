window.flags = {
    ExternalPolicies: false,
    ExternalPoliciesPackUrl: 'ws://127.0.0.1:8088',
    ExternalPoliciesUnpackUrl: 'ws://127.0.0.1:8089',
    PTUWithModemEnabled : false,
    FileSystemApiUrl: 'ws://127.0.0.1:8081',
    CoreHost: '127.0.0.1',
    CorePort: 8087,
    CoreWebEngineAppPort: 2020,
    AppStoreDirectoryUrl: 'https://sdl-webengine-app-store-example.s3.amazonaws.com/app-directory.json',
    StatusUpdateIcon: true,
    VRPlugin: {
        Url: 'http://127.0.0.1:3000', //URL path to plugin application, for web applications
        Name: 'Voice', //Title to display alongside the plugin UI
        Enabled: true, //Plugin is disabled, HMI will ignore this entry
        SidebarEnabled: true, //Plugin has a UI component, and should be displayed beside the main HMI
        MenuEnabled: true,
        MenuName: 'Voice Commands',
        MenuComponent: 'VRSettings'
    }
};
