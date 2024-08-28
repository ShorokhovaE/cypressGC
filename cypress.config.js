const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '59m14d',
  e2e: {
    watchForFileChanges: false,
    baseUrl: 'https://autotestsshorokhova.eshorohova.gcrc.ru',
    testIsolation: false,
    // projectId: "x5nia7",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});