/**
* @component:     Namespace - The MVW root namespace
* @product:       MVW - A micro extension framework
* @author:        DataDink - https://github.com/DataDink
* @license:       Unlicense - https://unlicense.org/
* @documentation: https://github.com/DataDink/mvw/wiki
*/

(function() { return this; })().MVW = // Expose to global namespace
/**
* @class {MVW} - MVW configuration and root namespace
*/
Object.freeze(
  class MVW {
    /**
    * @class {Settings} - A global registry for MVW settings
    */
    static Settings = Object.freeze(
      class Settings {
        /**
        * @property {object} reg - The settings registry map
        */
        static #reg = {};
        /**
        * @function register - Registers a new setting
        * @parameter {string} name - The name of the new setting
        * @parameter {any} initial - The default value of the new setting
        * @returns {void}
        */
        static register(name, initial) {
          name=`${name}`;
          if (name in Settings.#reg) { throw `Setting '${name}' is already registered`; }
          Settings.#reg[name] = initial;
          return name;
        }
        /**
        * @function get - Gets the registered setting value
        * @parameter {object} overrides - An optional object with override values to be considered for the return value
        * @returns {any} - The setting value
        */
        static get(name, overrides = null) {
          name=`${name}`;
          if (!overrides||typeof(overrides)!=='object'||!(name in overrides)) {
            return Settings.#reg[name];
          }
          return overrides[name];
        }
        /**
        * @function export - Exports all registered settings
        * @parameter {object} overrides - An optional object(s) with override values to be applied to the export
        * @returns {object} - An object with all of the currently registered MVW settings
        */
        static export(...overrides) {
          return overrides
            .reduce((ex,or) =>
              Object.keys(or)
                .filter(name => name in ex)
                .forEach(name => ex[name]=or[name])
            &&ex||ex, Object.assign({}, Settings.#reg));
        }
      }
    );
  }
);
