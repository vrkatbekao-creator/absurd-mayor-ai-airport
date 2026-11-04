'use strict';

// Dependency-free regression tests for the shipped, standalone HTML game.
// This deliberately executes the actual in-page game code in a sandboxed VM;
// it does not duplicate the business rules in a separate test implementation.
// Browser layout, physical touch input and keyboard accessibility need manual testing.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const filename = path.join(__dirname, '..', '荒謬市長_v0.2.html');
const html = fs.readFileSync(filename, 'utf8');

function loadGame() {
  const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x => x[1]);
  assert.equal(scripts.length, 2, 'Unexpected script structure: update the harness intentionally');

  const legacyCut = scripts[0].indexOf("document.addEventListener('click',");
  const v2Cut = scripts[1].indexOf("document.addEventListener('click',e=>{let b=e.target.closest('[data-v2]')");
  assert.ok(legacyCut > 0, 'Missing legacy DOM setup boundary');
  assert.ok(v2Cut > 0, 'Missing v0.2 DOM setup boundary');

  const store = new Map();
  const localStorage = {
    getItem: key => store.has(key) ? store.get(key) : null,
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: key => { store.delete(key); }
  };
  const context = vm.createContext({ localStorage, console });
  vm.runInContext(scripts[0].slice(0, legacyCut), context, { timeout: 3000, filename: 'game-v01-model.js' });
  vm.runInContext(scripts[1].slice(0, v2Cut), context, { timeout: 3000, filename: 'game-v02-model.js' });

  const api = vm.runInContext(
    '({ newGame, valid, metrics, promises, endingKey, choosePolicy, develop, deferAction, upgrade, administration, doSettle, M, cards, builds, dictionaries })',
    context
  );
  return { ...api, context, localStorage };
}

const api = loadGame();
const { newGame, valid, metrics, promises, endingKey, choosePolicy, develop, deferAction, doSettle } = api;

test('game stays self-contained and has twelve turns, 15 cards, and six buildings', () => {
  assert.ok(html.includes('<!DOCTYPE html>'));
  assert.ok(!/<script[^>]+src=/i.test(html), 'External script dependency detected');
  assert.equal(api.cards.length, 15);
  assert.equal(Object.keys(api.builds).length, 6);
  assert.equal(newGame().tiles.length, 9);
  assert.equal(newGame().turn, 1);
});

test('airport begins productive and runway/tower demolition stops all flights', () => {
  const g = newGame();
  assert.equal(metrics(g).traffic, 80);
  assert.equal(metrics(g).airport, 8);
  assert.equal(metrics(g).supply, 8);
  g.phase = 'build';
  develop(g, 1, 'lab'); // main runway
  assert.equal(metrics(g).nominal, 55);
  assert.equal(metrics(g).traffic, 0);
  assert.equal(metrics(g).airport, 0);
  assert.equal(g.spent, 18);

  const tower = newGame();
  tower.phase = 'build';
  develop(tower, 2, 'lab');
  assert.equal(metrics(tower).traffic, 0);

  const terminal = newGame();
  terminal.phase = 'build';
  develop(terminal, 0, 'lab');
  assert.equal(metrics(terminal).traffic, 65);
  assert.equal(metrics(terminal).airport, 6);
});

test('policy, municipal action, settlement sequence completes all 12 turns', () => {
  const g = newGame();
  g.order = Array.from({ length: 15 }, (_, i) => i);
  for (let turn = 1; turn <= 12; turn++) {
    assert.equal(g.turn, turn);
    assert.equal(g.phase, 'policy');
    choosePolicy(g, 1);
    assert.equal(g.phase, 'build');
    deferAction(g);
    assert.equal(g.phase, 'settle');
    doSettle(g);
  }
  assert.equal(g.turn, 12);
  assert.equal(g.phase, 'done');
  assert.equal(g.finished, true);
  assert.equal(metrics(g).traffic, 80);
  assert.equal(g.lost, 0);
  assert.equal(g.milestones.length, 3);
  assert.deepEqual(Array.from(g.milestones, x => x.turn), [4, 8, 12]);
  assert.notEqual(endingKey(g), 'miracle');
  assert.equal(valid(JSON.parse(JSON.stringify(g))), true);
});

test('a scheduled policy consequence is applied exactly at its due turn', () => {
  const g = newGame();
  g.phase = 'settle';
  g.queue.push({ due: 1, effect: { money: -17 } });
  doSettle(g);
  assert.equal(g.money, 52); // 65 + 8 airport - 4 base costs - 17
  assert.equal(g.queue.length, 0);
});

test('negative cash triggers financing fee and consecutive deficit damages support', () => {
  const g = newGame();
  g.phase = 'settle';
  g.money = -20;
  g.deficit = 1;
  doSettle(g);
  assert.equal(g.money, -19); // -20 + 8 - 4 - 3 finance fee
  assert.equal(g.deficit, 2);
  assert.equal(g.pop, 57); // -3 support for consecutive deficit
});

test('power shortage halves actual AI output', () => {
  const g = newGame();
  for (const i of [6, 7, 8]) g.tiles[i] = { ...g.tiles[i], type: 'data', traffic: 0 };
  assert.equal(metrics(g).supply, 8);
  assert.equal(metrics(g).demand, 12);
  g.phase = 'settle';
  doSettle(g);
  assert.equal(g.ai, 9); // floor((6 + 6 + 6)/2)
  assert.equal(g.pop, 57);
});

test('AI miracle demands meaningful airport redevelopment and economic viability', () => {
  const g = newGame();
  g.ai = 60; g.aiValue = 100; g.lost = 20; g.money = 50; g.pop = 60; g.debt = 2;
  assert.notEqual(endingKey(g), 'miracle');
  g.tiles[0] = { ...g.tiles[0], type: 'lab', traffic: 0 };
  assert.notEqual(endingKey(g), 'miracle');
  g.tiles[3] = { ...g.tiles[3], type: 'lab', traffic: 0 };
  assert.equal(metrics(g).redeveloped, 2);
  assert.equal(endingKey(g), 'miracle');
  g.money = -1;
  assert.notEqual(endingKey(g), 'miracle');
});

test('each narrative ending has a reachable, representative state', () => {
  const miracle = newGame();
  miracle.tiles[0] = { ...miracle.tiles[0], type: 'lab', traffic: 0 };
  miracle.tiles[3] = { ...miracle.tiles[3], type: 'lab', traffic: 0 };
  miracle.ai = 60; miracle.aiValue = 100; miracle.lost = 30;
  assert.equal(endingKey(miracle), 'miracle');

  const ppt = newGame();
  ppt.hype = 80;
  assert.equal(endingKey(ppt), 'ppt');

  const pigeon = newGame();
  for (const i of [6, 7, 8]) pigeon.tiles[i] = { ...pigeon.tiles[i], type: 'park', traffic: 0 };
  assert.equal(endingKey(pigeon), 'pigeon');

  const heater = newGame();
  for (const i of [6, 7, 8]) heater.tiles[i] = { ...heater.tiles[i], type: 'data', traffic: 0 };
  assert.equal(endingKey(heater), 'heater');

  assert.equal(endingKey(newGame()), 'airport');
});

test('no-public-money promise depends on spending, not closing cash', () => {
  const g = newGame();
  g.money = 1000;
  assert.equal(promises(g)[2], true);
  g.spent = 1;
  assert.equal(promises(g)[2], false);
});

test('save validation rejects malformed or incompatible game states', () => {
  const g = newGame();
  assert.equal(valid(JSON.parse(JSON.stringify(g))), true);
  assert.equal(valid({ ...g, version: 1 }), false);
  assert.equal(valid({ ...g, tiles: [] }), false);
  assert.equal(valid({ ...g, order: Array(15).fill(0) }), false);
  assert.equal(valid({ ...g, queue: [{ due: 1, effect: { badKey: 1 } }] }), false);
});

test('UI vocabulary and all policy titles, bodies and choices cover four languages', () => {
  for (const [key, value] of Object.entries(api.M)) {
    for (const language of ['zh', 'en', 'fr', 'nl']) {
      assert.equal(typeof value[language], 'string', 'Missing ' + language + ' for UI key ' + key);
      assert.ok(value[language].length, 'Empty ' + language + ' for UI key ' + key);
    }
  }
  for (const card of api.cards) {
    for (const phrase of [card[0], card[1], ...card[2].map(x => x[0])]) {
      for (const language of ['en', 'fr', 'nl']) {
        assert.equal(typeof api.dictionaries[language][phrase], 'string',
          'Missing ' + language + ' for event text ' + phrase);
      }
    }
  }
});

test('seeded random strategies never win AI miracle with fewer than two productive plots redeveloped', () => {
  let seed = 20261104;
  function rng() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
  const types = ['lab', 'data', 'show', 'power', 'park', 'market'];
  for (let run = 0; run < 120; run++) {
    const g = newGame();
    g.order = Array.from({ length: 15 }, (_, i) => i);
    for (let turn = 0; turn < 12; turn++) {
      choosePolicy(g, Math.floor(rng() * 3));
      const eligible = g.tiles.map((t, i) => t.type === 'original' ? i : -1).filter(i => i >= 0);
      if (eligible.length && rng() < .65) {
        const plot = eligible[Math.floor(rng() * eligible.length)];
        develop(g, plot, types[Math.floor(rng() * types.length)]);
      } else {
        deferAction(g);
      }
      assert.equal(g.phase, 'settle');
      doSettle(g);
    }
    assert.equal(g.finished, true);
    if (endingKey(g) === 'miracle') assert.ok(metrics(g).redeveloped >= 2);
    assert.equal(valid(JSON.parse(JSON.stringify(g))), true);
  }
});
