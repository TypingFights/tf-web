/* eslint-env node */
const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const cssModules = require('./config/css-modules');

module.exports = function (defaults) {
  // Include jQuery for the testing environment only (needed for the
  // component unit tests):
  const environment = process.env.EMBER_ENV || 'development';
  const vendorFiles = environment === 'test' ? {} : {
    'jquery.js': null,
  };

  const app = new EmberApp(defaults, {
    vendorFiles,
    cssModules,
    sassOptions: {
      includePaths: ['./app/styles'],
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
