// this is default constants which are advised at https://en.bem.info/method/naming-convention/
let elementSeparator = '__';
let modifierSeparator = '--';

/**
 * Parsing array of classes, providing list of modifiers and usual classes
 * (which shouldn't be prefixed with bem block & element)
 *
 * @param {array} classList – array of all classes and mods which should be applied
 * @returns {array} [ mods, classes ] – tuple of two arrays – modifiers and classes
 */
function parseWithoutEntity(classList) {
  return classList.reduce(([ mods, classes ], className) => {
    const newMods = [];
    const newClasses = [];
    if (className.startsWith(modifierSeparator))
      newMods.push(className.slice(modifierSeparator.length));
    else
      newClasses.push(className);

    return [ mods.concat(newMods), classes.concat(newClasses)];
  }, [ [], [] ]);
}

/**
 * parsing with block/element distinction
 *
 * @param {string} classList – list of all classes in bem-to notation
 * @returns {array} – tuple of entity name, modifiers and usual classes
 */
export function parseClasses(classList) {
  const classes = classList.split('.');

  const entityWithModifier = classes[0].split(modifierSeparator);
  const entityName = entityWithModifier[0];
  const entityModifiers = entityWithModifier[1] ? [ entityWithModifier[1] ] : [];
  const usualClasses = [];

  const [ newMods, newClasses ] = parseWithoutEntity(classes.slice(1));

  return [entityName, entityModifiers.concat(newMods), usualClasses.concat(newClasses)];
}

function createClassName({ block, element, mods, classes }) {
  const prefix = element ? `${block}${elementSeparator}${element}` : block;
  return prefix + ' '
    + mods.map(mod => `${prefix}${modifierSeparator}${mod}`).join(' ') + ' '
    + classes.join(' ');
}

/**
 * entry point for creating block scope
 *
 * @param {string} block – list of classes.
 * @returns {function} which will create block and element classes for you
 */
export default function bem(block) {
  if (typeof block !== 'string') throw new Error('you should provide string for block creating');

  const [ blockName, mods, usualClasses ] = parseClasses(block);

  /**
   * Actual constructor of classNames
   *
   * @param {string} classes – list of classes, just like above
   * @returns {string} – actual string of class names
   */
  return function bemto(classes) {
    if (typeof classes === 'string') {
      if (classes.startsWith(modifierSeparator)) {
        // if we start with modifier separator, it means that it's a block with amends
        const [ newMods, newClasses ] = parseWithoutEntity(classes.split('.'));
        return createClassName({ block: blockName, mods: mods.concat(newMods), classes: usualClasses.concat(newClasses)});
      } else {
        // this is a usual case for an element return
        const [ elementName, mods, usualClasses ] = parseClasses(classes);
        return createClassName({ block: blockName, element: elementName, mods, classes: usualClasses });
      }
    } else {
      // if we are here, it means that we should return block
      return createClassName({ block: blockName, mods, classes: usualClasses });
    }
  };
}

/**
 * Checking of separator validity. It passes when provide non-empty string
 *
 * @param {string} separator – new separator value
 * @returns {boolean} – whether it is correct or not separator
 */
function checkSeparatorValidity(separator) {
  if (typeof separator !== 'string') return false;
  if (!separator.length) return false;

  return true;
}

/**
 * apply new separators
 *
 * @param {object} separators
 * @param {string} object.element – new element separator, optional
 * @param {string} object.modifier – new modifier separator, optional
 * @returns {void}
 */
export const useSeparators = ({ element, modifier }) => {
  if (checkSeparatorValidity(element)) elementSeparator = element;
  if (checkSeparatorValidity(modifier)) modifierSeparator = modifier;
};

/**
 * apply only element separator
 *
 * @param {string} separator – new element separator
 * @returns {void}
 */
export const useElementSeparator = (separator) => {
  if (checkSeparatorValidity(separator)) elementSeparator = separator;
};

/**
 * apply only modifier separator
 *
 * @param {string} separator – new modifier separator
 * @returns {void}
 */
export const useModifierSeparator = (separator) => {
  if (checkSeparatorValidity(separator)) modifierSeparator = separator;
};
