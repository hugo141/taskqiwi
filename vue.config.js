module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions:{
        productName: "TaskQiwi",
        appId: "app.hugo141",
        copyright: "Copyright © 2021 hugo141",
        win: {
          icon: "build/picker.bmp",
          target: [{
            target: 'portable',
            arch: ['x64']
          }]
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true
        }
      }
    },
  },
};
