# JS-BEMTO
[![Build Status](https://travis-ci.org/Bloomca/js-bemto.svg?branch=master)](https://travis-ci.org/Bloomca/js-bemto)

Very simple and elegant way to write bem classes inside js.

```javascript
import bem from 'js-bemto';
const isActive = false;
const isBright = true;
const b = bem(`tile--big.--active?${isActive}.--bright?${isBright}`);
const e = b;

assert.equal(b(), 'tile tile--big tile--bright');
assert.equal(e('logo--active.col-xs-2'), 'tile__logo tile__logo--active col-xs-2');
```

## Table of Contents

1. [Install](#install)
2. [Settings](#settings)
3. [Overview](#overview)
4. [Conditional Classes](#conditional-classes)
5. [Usage](#usage)

## Install
it is a common npm module. Works both for node and browser (for tools like [browserify](http://browserify.org/) and [webpack](https://webpack.github.io/))

```javascript
npm i --save js-bemto
```

## Settings
By default this library uses default separators which is advised by [BEM](https://en.bem.info/method/naming-convention/)

If you prefer something else, you could extract next methods:
```javascript
import bem, { useSeparators, useElementSeparator, useModifierSeparator } from 'js-bemto';

useSeparators({ element: '--', modifier: '__' });
useElementSeparator('--');
useModifierSeparator('__');
```

## Overview
### Blocks
Block is the main entry point for an entity. In terms of components, it's usually a separated entity (for instance, react component usually has it's own block).

To create a block, just create new block and invoke it without any arguments:
```javascript
import bem from 'js-bemto';
const b = bem('tile');
assert.equal(b(), 'tile');
```
If you decide to create another block with some additional modifiers, just invoke it with string starting with modifier prefix:
```javascript
assert.equal(b('--big'), 'tile tile--big');
```
And, of course, you could add usual classes. Just pass them after block name when create one:
```javascript
const b = bem('tile.col-xs-2.no-mobile');
assert.equal(b(), 'tile col-xs-2 no-mobile');
```
### Elements
Elements are bricks of your blocks. You could read more about it [here](https://en.bem.info/method/) here.
To create element, just invoke created block with string which represents element name and it's modifiers + usual classes:
```javascript
const b = bem('tile--big');
// there are no meaning in this, but it could be more readable
const e = b;

assert.equal(e('logo--active.col-xs-2'), 'tile__logo tile__logo--active col-xs-2');
```
As you can see, you can apply the same rules as for blocks for usual classes.
And if you need several modifiers, just list them one by one (applicable both for blocks and elements):
```javascript
const b = bem('tile--big.--active');

assert.equal(b(), 'tile tile--big tile--active');
```

## Conditional Classes
There are two options to use arbitrary classes – string inlining or object notation.
String is very intuitive – just pass *?* mark after your class and then *true* of *false* string.
Combining with es6 syntax it is very easy:
```javascript
const b = bem('tile');

const isActive = false;
const isDark = true;
assert.equal(b(`--active?${isActive}.--dark?${isDark}`), 'tile tile--dark');
```

Of course, it isn't great idea to put too much modifiers in a row, so you could object notation:
```javascript
const b = bem('tile');

const isActive = true;
const isDark = false;
assert.equal(b({
  '--active': isActive,
  '--dark': isDark
}), 'tile tile--dark')
```

If you want to create element, just pass it as a first class name inside string or as '&element' key in object notation. And you could usual classes with conditions too:
```javascript
const b = bem('tile');
const e = b;

const isActive = true;
const isHidden = true;
assert.equal(e(`title.__active?${isActive}.hidden${isHidden}`),
  'tile__title tile__title--active hidden');
assert.equal(e({
  '&element': 'title',
  '-active': isActive,
  'hidden': isHidden
}), 'tile__title tile__title--active hidden');
```

You can't use both options when you actually create block (when invoking *bem*).

## Usage
The goal of this library to minimize pain (mostly for react.js and it's jsx, but it could be applied to any classes which are generated from js). You could simple change one letter in initializing and all your block and elements would correspond!

```javascript
import bem from 'js-bemto';
const b = bem('tile--big');
const e = b;

return (
  <div className={b()}>
    <img className={e('logo__small')} />
    <h2 className={e('title__active.col-xs-4')}>
      {'My own title!'}
    </h2>
  </div>
);
```

this will turn into:
```html
<div class="tile tile--big">
  <img class="tile__logo tile__logo tile__logo--small" />
  <h2 class="tile__title tile__title--active col-xs-4">My own title!</h2>
</div>
```

If you will render this component very often, it could make sense to put it in component closure, though you lose creating new class names in runtime. In case of static components it isn't a problem, so you could try it.

And you could use this approach with other frameworks as well, for instance, you could expose it in your knockout components as well.

This library was inspired by [bemto](https://github.com/kizu/bemto) jade mixins.
