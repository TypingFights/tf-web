/* eslint-env node, es6 */

const characters = 'abcdefghijklmnopqrstuvwxyz';
const classNamesMap = new Map;

// Generate short sequential classNames:
function generateShortClassName(number) {
  const length = characters.length;
  return characters[length - 1]
    .repeat(Math.floor(number / length)) + characters[number % length];
}

module.exports = {
  generateScopedName(className, modulePath) {
    const id = modulePath + className;
    let shortClassName = classNamesMap.get(id);
    if (typeof shortClassName === 'undefined') {
      shortClassName = generateShortClassName(classNamesMap.size);
      classNamesMap.set(id, shortClassName);
    }

    return shortClassName;
  },

  // TODO: find better way to deal with the ember-css-modules-sass
  // scss files concatenation:
  headerModules: [
    'typing-fights/styles/_reset',
    'typing-fights/styles/application',
  ],
};
