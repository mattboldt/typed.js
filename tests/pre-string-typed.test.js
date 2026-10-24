import assert from 'node:assert/strict';
import test from 'node:test';
import Typed from '../src/typed.js';

function runStrings(t, strings, options = {}) {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const element = { tagName: 'SPAN', textContent: '' };
  const events = [];
  let completed = 0;
  const typed = new Typed(element, {
    strings,
    typeSpeed: 0,
    backSpeed: 0,
    backDelay: 0,
    showCursor: false,
    autoInsertCss: false,
    contentType: null,
    preStringTyped: (position, instance) => {
      assert.equal(instance, typed);
      events.push({ type: 'before', position, text: element.textContent });
    },
    onStringTyped: (position) => events.push({ type: 'after', position }),
    onComplete: () => completed++,
    ...options,
  });
  const loops = options.loop ? options.loopCount : 1;
  for (let tick = 0; completed < loops && tick < 1000; tick++) {
    t.mock.timers.tick(1000);
  }
  assert.equal(completed, loops, 'animation must complete within the timer limit');
  typed.destroy();
  return events;
}

for (const [description, strings] of [
  ['different suffixes', ['Hello world', 'Hello there']],
  ['a longer next string', ['Hello', 'Hello there']],
  ['a shorter next string', ['Hello there', 'Hello']],
  ['identical strings', ['Hello', 'Hello']],
]) {
  test(`preStringTyped fires before each string with ${description}`, (t) => {
    const events = runStrings(t, strings);
    assert.deepEqual(events.map(({ type, position }) => [type, position]), [
      ['before', 0], ['after', 0], ['before', 1], ['after', 1],
    ]);
  });
}

test('strings without a shared prefix still fire one callback each', (t) => {
  const events = runStrings(t, ['Hello', 'World']);
  assert.deepEqual(events.filter(({ type }) => type === 'before').map(({ position }) => position), [0, 1]);
});

test('disabling smartBackspace still fires one callback each', (t) => {
  const events = runStrings(t, ['Hello world', 'Hello there'], { smartBackspace: false });
  assert.deepEqual(events.filter(({ type }) => type === 'before').map(({ position }) => position), [0, 1]);
});

test('each loop fires the callback again for shared-prefix strings', (t) => {
  const events = runStrings(t, ['Hello world', 'Hello there'], { loop: true, loopCount: 2 });
  assert.deepEqual(events.filter(({ type }) => type === 'before').map(({ position }) => position), [0, 1, 0, 1]);
});
