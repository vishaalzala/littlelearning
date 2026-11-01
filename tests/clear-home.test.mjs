import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('one clear home journey without duplicate promotional game galleries',()=>{
 assert.match(html,/<section[^>]*id="llStudio"/);
 assert.match(html,/id="unifiedResume"/);
 assert.equal((html.match(/id="unifiedResume"/g)||[]).length,1);
 assert.doesNotMatch(html,/class="adventureQuickFeatures"/,'duplicate Quick Play showcase creates clutter');
 assert.match(html,/id="llQuickDetails"/,'all existing games must remain available');
 assert.equal((html.match(/data-game=/g)||[]).length,12);
});
test('children see one easy-to-read set of learning topics with an optional expand control',()=>{
 assert.match(html,/id="llShowMoreTopics"/);
 assert.match(html,/aria-controls="llTopicGrid"/);
 assert.match(html,/id="llTopicGrid"/);
 assert.match(html,/data-ll-subject="math"/);
 assert.match(html,/data-ll-subject="english"/);
 assert.match(html,/id="llGradeSelect"/);
});
test('avoid unnecessary copy and repeated category headings on home',()=>{
 assert.doesNotMatch(html,/<h2>🎮 Choose a game<\/h2>/);
 assert.doesNotMatch(html,/<h2>Quick Play<\/h2>/,'there should be just the expandable Quick Play section');
 assert.match(html,/100% free, No signup required!/);
});
