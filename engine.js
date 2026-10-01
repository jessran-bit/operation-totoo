/* Operation Totoo engine: data, scoring, and mission codes. Shared by the game and Mission Control. */
var TOTOO = (function () {
  var SALT = "totoo~rvr~resbusm~26";
  function cyrb53(str, seed) { seed = seed || 0; var h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (var i = 0, ch; i < str.length; i++) { ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36); }
  var PUB = {"teams":[{"id":"A","name":"Alpha Squadron","mission":"LIWANAG","pin":"r8upfucmlr"},{"id":"B","name":"Bravo Command","mission":"BANTAY","pin":"1db6jvw9n40"},{"id":"C","name":"Charlie Unit","mission":"SULO","pin":"fgvobw8ejl"},{"id":"D","name":"Delta Force","mission":"TALA","pin":"12ip1vnoyvk"},{"id":"E","name":"Echo Base","mission":"DUNONG","pin":"i203p2k50a"},{"id":"F","name":"Foxtrot Division","mission":"SIYASAT","pin":"1y5htr4pwh7"}],"cards":[{"id":"C03","cite":"Buolamwini, J., & Gebru, T. (2018). Gender shades: Intersectional accuracy disparities in commercial gender classification. Proceedings of Machine Learning Research, 81, 77-91.","claim":"Commercial face analysis tools made the most errors on darker-skinned women and the fewest on lighter-skinned men."},{"id":"C04","cite":"Reyes, M. L., & Thompson, K. (2021). Algorithmic hiring and gender parity in Southeast Asian firms: Evidence from 1,200 job postings. Journal of Business Analytics and AI, 7(2), 45-63. https://doi.org/10.1016/j.jbai.2021.03.004","claim":"AI hiring tools used by Southeast Asian firms, including firms in the Philippines, ranked female applicants 18% lower than equally qualified male applicants."},{"id":"C06","cite":"Lambrecht, A., & Tucker, C. (2019). Algorithmic bias? An empirical study of apparent gender-based discrimination in the display of STEM career ads. Management Science, 65(7), 2966-2981.","claim":"A gender-neutral STEM job ad was shown to fewer women, because young women are more expensive to reach with ads."},{"id":"C07","cite":"Hardt, M., Price, E., & Srebro, N. (2016). Equality of opportunity in supervised learning. Advances in Neural Information Processing Systems, 29.","claim":"The authors prove that removing gender from the data is enough to make a model fair."},{"id":"C09","cite":"Nakamura, S., Okafor, E., & Lindqvist, A. (2022). Gendered sentiment drift in ChatGPT customer service responses. Proceedings of the 2022 ACM Conference on Fairness, Accountability, and Transparency (FAccT '22), 1123-1135.","claim":"ChatGPT gave warmer and more patient replies to customers with female names than to customers with male names."},{"id":"C11","cite":"Kotek, H., Dockum, R., & Sun, D. (2023). Gender bias and stereotypes in large language models. Proceedings of the ACM Collective Intelligence Conference (CI '23).","claim":"Large language models were 3 to 6 times more likely to pick a job that matches a gender stereotype."}],"tasks":[{"id":"P1","title":"Find search terms","task":"Your team's question: How do AI hiring tools affect women applicants in the Philippines? You need words to search Google Scholar with.","options":[{"id":"a","text":"Give me 10 sources about AI gender bias in hiring."},{"id":"b","text":"My research question is: How do AI hiring tools affect women applicants in the Philippines? Suggest search terms, synonyms, and related concepts I can use in Google Scholar."},{"id":"c","text":"What is gender bias in AI?"}]},{"id":"P2","title":"Understand a paper","task":"Your team wants to understand card C03 (Buolamwini & Gebru, 2018). Find its abstract online first.","options":[{"id":"a","text":"Summarize Buolamwini and Gebru 2018 for my literature review."},{"id":"b","text":"Is Buolamwini and Gebru 2018 a good paper?"},{"id":"c","text":"Here is the abstract of a paper: [paste abstract]. Explain the method and main finding in simple words, and list what the abstract does not tell me."}]},{"id":"P4","title":"Check a claim","task":"A classmate says: AI hiring tools rank women 18% lower. It sounds useful for your thesis.","options":[{"id":"a","text":"Find me a source that proves AI hiring tools rank women 18% lower."},{"id":"b","text":"Is it true that AI hiring tools rank women 18% lower?"},{"id":"c","text":"Where does the claim 'AI hiring tools rank women 18% lower' come from? If you cannot name a real source I can check, say so."}]}],"admin":"9b12qklsxu"};
  var BLOB = "CVQTQxBNWFZWLERcTRdaORcXHg9PTSEdQE1OTSlMEw5QWlBuU1lAF1Y9EQ4DD1RJMUZFD1lNNlodHAAKCw9USTFGSw9ZTSRMHwpWQ01uSVpQTFB/Bg4ODwlDVgwDWB1JSA1QblNcQBdWKgYdAF9YGRMCF15DHQdMFwcRC09MGgQHAlIeVkpCSxsdVAsOXxMOAFsBRgoBDEgQTwMAAkgWSxMYFg0WAQZIBk9FSk9LFxlSGhtKCxsHX1kcHwYBQx0PUhsXQ01NTg83X0BNVQ8sAxsFUl0CHwdfVAsbChwNFgQGVhdVChwWAVQOGgtPQx0CBh4XX0MLDUgHTwAHCg0SBAcEHEwPQUJ5HApUKyBkWAwdEwENDQAVRREdEUFPbhAKBhQdWRBPDUsAChpPBkMODhwCUkxDAw1OFQNUHBtYHBJSAhpMF08ERAAcVBYAWApLBhkCRABPEkgGCREMG0EBRVBaUG5TWUAXVj8BDQNECwMXElJEDU8vTBoOEwoCSBYfUiURRAYBAUhaTyAHCg0bCgcFFw0UDhENFQtUHx1EGwIcEV4NDQAWDQAHEU8OQR8EAB8GRQ5PFkwGCBEbBkMfSxUTHEkGHUJCGk8EGh1dFxgXWFABQSxSGlZVVj0KTBRLAhcCSBFDQk8VDB8YDl8cGFIFB0AODhBUWk8gBwoNGR4GHh1fEE8DXxMaEU8bRRkfUgQXQAwZC0MTTxMKAUkdGVISHUgQTyxiIE8ZDgRIWApSGx1JBgNCSxUGBkNPTx0IEwMBSEMAFkURHVQLDlkZSxEXHA0QGwNDEE8dAU9LFxlSERdDBwoQA1ZDVixfFFpRUDUaSAAEQlkcClQLDlkdRVIwM04AO0IfRF1GTxhMC0saEx5JQwYMDT4aGgpPH0hZQFpSTA0LQm4cDgAoP3lYCBMbFw0MGhYNHQFUIQBbHQYQEwANUV9QH1pPIAcGXlgYBgMWVEMMDVgYC1QBAFlYDgofAVlNTU4PN15FTVUPKB4QGhteCwoGDRUbVC4sYFgoO1ZAHVFcTA0gBxFPHFgVBhMECw0ODhZOHAoHTxtFHUsCFwJIEUFAUFhNFgocWVpRCVQiHEFVQE9WQ1Y/XQ9CSRFUXg8zW0AXVgxWEkMPDwMLVEhWQT9TD05NPRtPShEdFwVSWQsKQmw9Tw0AGl9YDgoXEVlDHhdIBxsdAAENGQUWVhNeCBxCSxsdVBwKTAoIGlYFQhELEQFUARsbT14XHgAVF15NTztCAU8ABwpDWA0bGBYNFwcHDQYKFQNPXRkbFwQBDRoAF18HChgJQQ0oGR0bAllDLkJEGhkdGwpeWAYTEhcAFh9CXxEJER0KQxsOAVhQAUE/UA9OTT0bT1oXGRkFUksRAA8NAAcRTx1IGQdSAhdVF08bQgFPBA4cWR0PXlYBQkMbCkhULj1PDEwWBR0CUkQNGQdDAE8ABwoNGwQcAhdDF0FCbAcEHQEIDQ8DEwJSWQsKQkwWHAAdDk4MSx4TE1sGHEJCARtUGwpBFBhSDx1YQxgKTABPAABPXx0KFlYbQ0MbCkhUCQEDAw0ICgITAANBQ0B9QE1OTSZZWAoBHQENBQAQDRVPBwAaXxsOUg8dWEMMA0NUDBwKDEZYChwSUkEGGxENAAcRTy5kWBgTD1JEF08GQhEcVAEAWVgAHBkFA0M/EEIZHwBPLg0IHgEeF15DGwpIVC49TxtCWBsAGRZYAApCTFQcGxodTh1LFwAXQ0MGBA0aABoKT0gAAgECAQNDRzZFEU9FV0oNGwofE1JLEQAPDRIOHwpPThkZFlYxHVdBSw8JEg==";
  var KEY = "rvr-cob-totoo-xk";
  var S = (function () { var bin = atob(BLOB), b = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length);
    return JSON.parse(new TextDecoder().decode(b)); })();
  function b64e(s) { return btoa(unescape(encodeURIComponent(s))); }
  function b64d(s) { return decodeURIComponent(escape(atob(s))); }
  function checkPin(team, pin) { return cyrb53(SALT + team + String(pin).trim()) === PUB.teams.filter(function (t) { return t.id === team; })[0].pin; }
  function checkAdmin(pw) { return cyrb53(SALT + "admin" + String(pw).trim().toUpperCase()) === PUB.admin; }
  function truth(cid) { return S.ans[cid]; }
  function clue(cid) { return S.clue[cid]; }
  function best(tid) { return S.best[tid]; }
  function why(tid) { return S.why[tid]; }
  function hasLink(s) { return /https?:\/\/\S+/i.test(s || ""); }
  function words(s) { return (String(s || "").match(/[A-Za-z0-9\u00C0-\u024F'-]+/g) || []).length; }
  function seededOrder(arr, seedStr) { var a = arr.slice(), h = parseInt(cyrb53(seedStr), 36);
    function rnd() { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x6d2b79f5) >>> 0; return h / 4294967296; }
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // ---- scoring: the single source of truth for both pages ----
  var GAME_MS = 20 * 60 * 1000;
  function score(run) {
    var r = { l1: 0, l2: 0, l3: 0, lives: 3, livesBonus: 0, timeBonus: 0, correct: 0, auto: 0, cards: {} };
    (run.l1 || []).forEach(function (a) {
      var t = S.ans[a.c];
      if (a.v && a.v === t) { r.l1 += 5; r.correct++; r.cards[a.c] = "right"; }
      else { r.cards[a.c] = a.v ? "wrong" : "timeout"; if (a.v === "Real" && t !== "Real") r.lives--; }
    });
    (run.l2 || []).forEach(function (p) { if (p.pick === S.best[p.id]) r.l2 += 5; });
    if (run.l3) {
      var themeReal = {}, placedReal = 0, pen = 0;
      Object.keys(run.l3.assign || {}).forEach(function (cid) { var ti = run.l3.assign[cid]; if (ti === null || ti === undefined || ti < 0) return;
        if (S.ans[cid] === "Real") { placedReal++; themeReal[ti] = 1; } else pen += 3; });
      var themesUsed = Object.keys(themeReal).filter(function (k) { return (run.l3.themes[k] || "").trim().length >= 3; }).length;
      r.l3 = Math.max(0, Math.min(3, placedReal) * 3 + (themesUsed >= 2 ? 6 : 0) - pen);
    }
    r.lives = Math.max(0, r.lives);
    r.livesBonus = [0, 1, 3, 5][r.lives];
    if (run.finish && run.boss && run.timeLeft) r.timeBonus = Math.max(0, Math.min(5, Math.floor(run.timeLeft / 60)));
    r.auto = r.l1 + r.l2 + r.l3 + r.livesBonus + r.timeBonus;
    return r;
  }
  function encode(run) { var p = b64e(JSON.stringify(run)); return "TOTOO1." + p + "." + cyrb53(SALT + p); }
  function decode(code) { code = String(code || "").replace(/\s+/g, ""); var m = code.match(/^TOTOO1\.([A-Za-z0-9+\/=]+)\.([a-z0-9]+)$/);
    if (!m) return { error: "This does not look like a mission code." };
    if (cyrb53(SALT + m[1]) !== m[2]) return { error: "This code was changed after the game made it." };
    try { return { run: JSON.parse(b64d(m[1])) }; } catch (e) { return { error: "This code is damaged." }; } }
  return { GAME_MS: GAME_MS, PUB: PUB, checkPin: checkPin, checkAdmin: checkAdmin, truth: truth, clue: clue, best: best, why: why, score: score,
    encode: encode, decode: decode, seededOrder: seededOrder, words: words, hasLink: hasLink };
})();
