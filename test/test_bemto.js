import chai from 'chai';
import bem, { parseClasses, useSeparators } from '../src/index';

const assert = chai.assert;

// I prefer mirrored separators
useSeparators({ element: '--', modifier: '__' });

suite('class names', () => {
  test('basic class parsing', () => {
    const [ name, mods, classes ] = parseClasses('title__big.main');

    assert.equal(name, 'title');
    assert.deepEqual(mods, ['big']);
    assert.deepEqual(classes, ['main']);
  });

  test('correct block declaration', () => {
    const b = bem('title__big');
    assert.equal(b().trim(), 'title title__big');
  });

  test('correct element declaration', () => {
    const e = bem('tile.col-xs-2');

    const prefix = 'tile--title';
    assert.equal(e('title__small.__highlighted').trim(),
      `${prefix} ${prefix}__small ${prefix}__highlighted`);
  });

  test('should treat several usual classes correctly', () => {
    const b = bem('tile__big.__active.col-xs-2.mb10');
    const e = b;

    assert.equal(b().trim(),
      'tile tile__big tile__active col-xs-2 mb10');

    assert.equal(e('subtitle__small.xs-2.md-4').trim(),
      'tile--subtitle tile--subtitle__small xs-2 md-4');
  });

  test('should be able to add new modifiers to block', () => {
    const b = bem('tile__big.xs-4');

    assert.equal(b('__active').trim(),
      'tile tile__big tile__active xs-4');
  });

  test('should treat several modifiers correctly', () => {
    const b = bem('tile__big.__active');
    const el = b('logo__active.__small');

    assert.equal(b().trim(), 'tile tile__big tile__active');
    assert.equal(el.trim(), 'tile--logo tile--logo__active tile--logo__small');
  });
});
