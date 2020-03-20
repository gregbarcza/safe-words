const assert = require('assert');
const lodashStable = require('lodash');
const words = require('./index.js')

/** List of Latin Unicode letters. */
var burredLetters = [
  // Latin-1 Supplement letters.
  '\xc0', '\xc1', '\xc2', '\xc3', '\xc4', '\xc5', '\xc6', '\xc7', '\xc8', '\xc9', '\xca', '\xcb', '\xcc', '\xcd', '\xce', '\xcf',
  '\xd0', '\xd1', '\xd2', '\xd3', '\xd4', '\xd5', '\xd6', '\xd8', '\xd9', '\xda', '\xdb', '\xdc', '\xdd', '\xde', '\xdf',
  '\xe0', '\xe1', '\xe2', '\xe3', '\xe4', '\xe5', '\xe6', '\xe7', '\xe8', '\xe9', '\xea', '\xeb', '\xec', '\xed', '\xee', '\xef',
  '\xf0', '\xf1', '\xf2', '\xf3', '\xf4', '\xf5', '\xf6', '\xf8', '\xf9', '\xfa', '\xfb', '\xfc', '\xfd', '\xfe', '\xff',
  // Latin Extended-A letters.
  '\u0100', '\u0101', '\u0102', '\u0103', '\u0104', '\u0105', '\u0106', '\u0107', '\u0108', '\u0109', '\u010a', '\u010b', '\u010c', '\u010d', '\u010e', '\u010f',
  '\u0110', '\u0111', '\u0112', '\u0113', '\u0114', '\u0115', '\u0116', '\u0117', '\u0118', '\u0119', '\u011a', '\u011b', '\u011c', '\u011d', '\u011e', '\u011f',
  '\u0120', '\u0121', '\u0122', '\u0123', '\u0124', '\u0125', '\u0126', '\u0127', '\u0128', '\u0129', '\u012a', '\u012b', '\u012c', '\u012d', '\u012e', '\u012f',
  '\u0130', '\u0131', '\u0132', '\u0133', '\u0134', '\u0135', '\u0136', '\u0137', '\u0138', '\u0139', '\u013a', '\u013b', '\u013c', '\u013d', '\u013e', '\u013f',
  '\u0140', '\u0141', '\u0142', '\u0143', '\u0144', '\u0145', '\u0146', '\u0147', '\u0148', '\u0149', '\u014a', '\u014b', '\u014c', '\u014d', '\u014e', '\u014f',
  '\u0150', '\u0151', '\u0152', '\u0153', '\u0154', '\u0155', '\u0156', '\u0157', '\u0158', '\u0159', '\u015a', '\u015b', '\u015c', '\u015d', '\u015e', '\u015f',
  '\u0160', '\u0161', '\u0162', '\u0163', '\u0164', '\u0165', '\u0166', '\u0167', '\u0168', '\u0169', '\u016a', '\u016b', '\u016c', '\u016d', '\u016e', '\u016f',
  '\u0170', '\u0171', '\u0172', '\u0173', '\u0174', '\u0175', '\u0176', '\u0177', '\u0178', '\u0179', '\u017a', '\u017b', '\u017c', '\u017d', '\u017e', '\u017f'
];

var stubArray = function () { return []; }

describe('words', function () {
  // it('should match words containing Latin Unicode letters', function () {
  //   var expected = lodashStable.map(burredLetters, function (letter) {
  //     return [letter];
  //   });

  //   var actual = lodashStable.map(burredLetters, function (letter) {
  //     return words(letter);
  //   });

  //   assert.deepStrictEqual(actual, expected);
  // });

  it('should support a `pattern`', function () {
    assert.deepStrictEqual(words('abcd', /ab|cd/g), ['ab', 'cd']);
    assert.deepStrictEqual(Array.from(words('abcd', 'ab|cd')), ['ab']);
  });

  it('should work with compound words', function () {
    assert.deepStrictEqual(words('12ft'), ['12', 'ft']);
    assert.deepStrictEqual(words('aeiouAreVowels'), ['aeiou', 'Are', 'Vowels']);
    assert.deepStrictEqual(words('enable 6h format'), ['enable', '6', 'h', 'format']);
    assert.deepStrictEqual(words('enable 24H format'), ['enable', '24', 'H', 'format']);
    assert.deepStrictEqual(words('isISO8601'), ['is', 'ISO', '8601']);
    assert.deepStrictEqual(words('LETTERSAeiouAreVowels'), ['LETTERS', 'Aeiou', 'Are', 'Vowels']);
    assert.deepStrictEqual(words('tooLegit2Quit'), ['too', 'Legit', '2', 'Quit']);
    assert.deepStrictEqual(words('walk500Miles'), ['walk', '500', 'Miles']);
    assert.deepStrictEqual(words('xhr2Request'), ['xhr', '2', 'Request']);
    assert.deepStrictEqual(words('XMLHttp'), ['XML', 'Http']);
    assert.deepStrictEqual(words('XmlHTTP'), ['Xml', 'HTTP']);
    assert.deepStrictEqual(words('XmlHttp'), ['Xml', 'Http']);
  });

  it('should work with compound words containing diacritical marks', function () {
    assert.deepStrictEqual(words('LETTERSÆiouAreVowels'), ['LETTERS', 'Æiou', 'Are', 'Vowels']);
    assert.deepStrictEqual(words('æiouAreVowels'), ['æiou', 'Are', 'Vowels']);
    assert.deepStrictEqual(words('æiou2Consonants'), ['æiou', '2', 'Consonants']);
  });

  it('should not treat contractions as separate words', function () {
    var postfixes = ['d', 'll', 'm', 're', 's', 't', 've'];

    lodashStable.each(["'", '\u2019'], function (apos) {
      lodashStable.times(2, function (index) {
        var actual = lodashStable.map(postfixes, function (postfix) {
          var string = 'a b' + apos + postfix + ' c';
          return words(string[index ? 'toUpperCase' : 'toLowerCase']());
        });

        var expected = lodashStable.map(postfixes, function (postfix) {
          var words = ['a', 'b' + apos + postfix, 'c'];
          return lodashStable.map(words, function (word) {
            return word[index ? 'toUpperCase' : 'toLowerCase']();
          });
        });

        assert.deepStrictEqual(actual, expected);
      });
    });
  });

  it('should not treat ordinal numbers as separate words', function () {
    var ordinals = ['1st', '2nd', '3rd', '4th'];

    lodashStable.times(2, function (index) {
      var expected = lodashStable.map(ordinals, function (ordinal) {
        return [ordinal[index ? 'toUpperCase' : 'toLowerCase']()];
      });

      var actual = lodashStable.map(expected, function (expectedWords) {
        return words(expectedWords[0]);
      });

      assert.deepStrictEqual(actual, expected);
    });
  });

  it('should not treat mathematical operators as words', function () {
    var operators = ['\xac', '\xb1', '\xd7', '\xf7'],
      expected = lodashStable.map(operators, stubArray),
      actual = lodashStable.map(operators, words);

    assert.deepStrictEqual(actual, expected);
  });

  it('should not treat punctuation as words', function () {
    var marks = [
      '\u2012', '\u2013', '\u2014', '\u2015',
      '\u2024', '\u2025', '\u2026',
      '\u205d', '\u205e'
    ];

    var expected = lodashStable.map(marks, stubArray),
      actual = lodashStable.map(marks, words);

    assert.deepStrictEqual(actual, expected);
  });

  it('should prevent ReDoS', function () {
    var largeWordLen = 50000,
      largeWord = 'A'.repeat(largeWordLen),
      maxMs = 1000,
      startTime = lodashStable.now();

    assert.deepStrictEqual(words(largeWord + 'ÆiouAreVowels'), [largeWord, 'Æiou', 'Are', 'Vowels']);

    var endTime = lodashStable.now(),
      timeSpent = endTime - startTime;

    assert.ok(timeSpent < maxMs, 'operation took ' + timeSpent + 'ms');
  });
});