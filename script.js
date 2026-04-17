(function () {
  var overlay  = document.getElementById('loader-overlay');
  var output   = document.getElementById('loader-output');
  var cursor   = document.getElementById('loader-cursor');
  var terminal = document.getElementById('loader-terminal');

  if (!overlay || !output) return;

  if (sessionStorage.getItem('loaderShown')) {
    overlay.style.display = 'none';
    return;
  }

  document.body.style.overflow = 'hidden';

  /* ── timer tracking so skip-click can cancel everything ── */
  var _timeouts  = [];
  var _intervals = [];
  var _exiting   = false;

  function t(id)  { _timeouts.push(id);  return id; }
  function iv(id) { _intervals.push(id); return id; }
  function cancelAll() {
    _timeouts.forEach(clearTimeout);
    _intervals.forEach(clearInterval);
  }

  /* ── skip on click / tap ── */
  overlay.addEventListener('click', function () { triggerTransition(); });

  /* ── helpers ── */
  function scrollDown() {
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }

  function typeText(text, delay, done) {
    var i = 0;
    function step() {
      if (i < text.length) {
        output.textContent += text[i++];
        scrollDown();
        t(setTimeout(step, delay));
      } else if (done) {
        done();
      }
    }
    step();
  }

  function typeLines(lines, delay, done) {
    var i = 0;
    function next() {
      if (i < lines.length) {
        typeText(lines[i++] + '\n', delay, next);
      } else if (done) {
        done();
      }
    }
    next();
  }

  function flickerIn(text, done) {
    var span = document.createElement('span');
    span.textContent = text;
    span.style.opacity = '0';
    span.style.transition = 'opacity 300ms ease';
    output.appendChild(span);
    scrollDown();
    t(setTimeout(function () {
      span.style.opacity = '1';
      t(setTimeout(done || function () {}, 350));
    }, 30));
  }

  function animateProgressBar(done) {
    var total  = 20;
    var filled = 0;
    var span   = document.createElement('span');
    span.textContent = '\n       Progress: [                    ]   0%\n';
    output.appendChild(span);
    scrollDown();
    iv(setInterval(function () {
      filled++;
      var pct = Math.round((filled / total) * 100);
      var pad = pct < 10 ? '  ' : pct < 100 ? ' ' : '';
      span.textContent =
        '\n       Progress: [' +
        '\u2588'.repeat(filled) +
        ' '.repeat(total - filled) +
        '] ' + pad + pct + '%\n';
      scrollDown();
      if (filled >= total) {
        cancelAll();
        if (done) t(setTimeout(done, 150));
      }
    }, 55));
  }

  function triggerTransition() {
    if (_exiting) return;
    _exiting = true;
    cancelAll();
    sessionStorage.setItem('loaderShown', '1');
    if (cursor) cursor.classList.add('cursor-hidden');
    overlay.classList.add('loader-exit');
    setTimeout(function () {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    }, 870);
  }

  /* ── content ── */
  var p1 = [
    '\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557',
    '\u2551           LIAM GOSS \u2014 FORENSICS SUITE           \u2551',
    '\u2551                  v4.2.1-release                 \u2551',
    '\u255a\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255d',
    '',
    '[SYS]  Initializing acquisition module...',
    '[SYS]  Loading device drivers...',
    '[OK ]  Driver stack ready.',
  ];

  var p2 = [
    '[SCAN] Scanning USB bus for connected devices...',
    '[SCAN] .......',
    '',
    '[DEV]  Device detected:',
    '       Manufacturer : Apple Inc.',
    '       Model        : iPhone',
    '       Serial       : \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2588 (masked)',
    '       Status       : LOCKED',
  ];

  var art =
    '\n' +
    '       \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n' +
    '       \u2502           \u2502\n' +
    '       \u2502  [APPLE]  \u2502\n' +
    '       \u2502           \u2502\n' +
    '       \u2502 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 \u2502\n' +
    '       \u2502 \u2591  SOS  \u2591 \u2502\n' +
    '       \u2502 \u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591\u2591 \u2502\n' +
    '       \u2502           \u2502\n' +
    '       \u2514\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2518\n' +
    '             \u2502\n' +
    '        \u2500\u2500\u2500\u2500\u2500\u2524 USB-C\n' +
    '             \u2502\n' +
    '    \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n' +
    '    \u2502  FORENSIC WORKSTATION             \u2502\n' +
    '    \u2502  [ACQUISITION ENGINE ACTIVE]  \u2588\u2588  \u2502\n' +
    '    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n';

  var p4 = [
    '[ACQ]  Beginning logical acquisition...',
    '[ACQ]  Bypassing lock screen heuristics...',
    '[ACQ]  Mounting filesystem image...',
  ];

  var p5 = [
    '',
    '[OK ]  ACQUISITION COMPLETE.',
    '[OK ]  Integrity hash: SHA-256 verified \u2713',
    '[OK ]  Loading operator profile...',
  ];

  /* ── animation chain ── */
  typeLines(p1, 15, function () {
    t(setTimeout(function () {
      typeLines(p2, 15, function () {
        t(setTimeout(function () {
          flickerIn(art, function () {
            typeLines(p4, 15, function () {
              animateProgressBar(function () {
                typeLines(p5, 18, function () {
                  t(setTimeout(triggerTransition, 400));
                });
              });
            });
          });
        }, 300));
      });
    }, 400));
  });
})();

function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}
