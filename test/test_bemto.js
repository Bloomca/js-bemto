import chai from 'chai';
import bem, { parseClasses, useSeparators } from '../src/index';

const assert = chai.assert;

// I prefer mirrored separators
useSeparators({ element: '--', modifier: '__' });

suite('class names', () => {
  test('basic class parsing', () => {
    const [ name, mods, classes ] = parseClasses('title__big.main'.split('.'));

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

  test('should treat empty classes correctly – several dots in a row', () => {
    const b = bem('tile');

    assert.equal(b('.__active..__dark').trim(), 'tile tile__active tile__dark');
  });
});

suite('conditional class names', () => {
  test('should parse ? correctly', () => {
    const b = bem('tile');

    assert.equal(b('title.__active?true.__dark?false').trim(),
      'tile--title tile--title__active');
  });

  test('should treat first false conditional name correctly', () => {
    const b = bem('tile');

    assert.equal(b('__active?false.__dark?true').trim(),
      'tile tile__dark');
  });

  test('should parse object notation correctly for block', () => {
    const b = bem('tile');

    assert.equal(b({
      '__active': true,
      '__dark': true,
      '__highlighted': false
    }).trim(), 'tile tile__active tile__dark');
  });

  test('should parse object notation for elements correctly', () => {
    const b = bem('tile');

    assert.equal(b({
      '&element': 'title',
      '__active': true,
      '__dark': false
    }).trim(), 'tile--title tile--title__active');
  });

  test('should consider usual classes optionally too with string notation', () => {
    const b = bem('tile');

    const isHidden = true;
    const isDark = false;
    assert.equal(b(`__active.hidden?${isHidden}.dark?${isDark}`).trim(),
      'tile tile__active hidden');
  });

  // test('should parse ? marks in block declaration', () => {
  //   const b = bem('tile.__active?false.__dark?true');
  //
  //   assert.equal(b().trim(), 'tile tile__dark');
  // });
});
