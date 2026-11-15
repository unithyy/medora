/* MEDORA CLINIC — каталог врачей: поиск, фильтр, сортировка, избранное */
(function () {
  'use strict';
  var M = window.MEDORA, grid = document.getElementById('doctor-grid');
  if (!M || !grid) return;

  var q = document.getElementById('search'), s = document.getElementById('spec'), o = document.getElementById('sort'),
      f = document.getElementById('favonly'), c = document.getElementById('count'), e = document.getElementById('empty'),
      r = document.getElementById('reset');

  Object.keys(M.specs).forEach(function (k) {
    var op = document.createElement('option');
    op.value = k; op.textContent = M.specs[k];
    s.appendChild(op);
  });

  var pre = new URLSearchParams(location.search).get('spec');
  if (pre && M.specs[pre]) s.value = pre;

  function plural(n) {
    var m = n % 10;
    return (m === 1 && n !== 11) ? 'врач' : (m > 1 && m < 5 && (n < 12 || n > 14)) ? 'врача' : 'врачей';
  }

  function render() {
    var term = q.value.trim().toLowerCase(), fav = M.getFav();
    var list = M.doctors.filter(function (d) {
      return (!s.value || d.spec === s.value) &&
             (!term || d.name.toLowerCase().indexOf(term) > -1) &&
             (!f.checked || fav.indexOf(d.id) > -1);
    });
    list.sort(function (a, b) {
      if (o.value === 'asc') return a.exp - b.exp;
      if (o.value === 'desc') return b.exp - a.exp;
      return a.id - b.id;
    });
    grid.innerHTML = list.map(function (d) { return M.card(d); }).join('');
    c.textContent = 'Найдено: ' + list.length + ' ' + plural(list.length);
    e.hidden = list.length > 0;
  }

  [q, s, o, f].forEach(function (el) { el.addEventListener(el === q ? 'input' : 'change', render); });
  document.addEventListener('medora:fav', function () { if (f.checked) render(); });
  r.addEventListener('click', function () { q.value = ''; s.value = ''; o.value = ''; f.checked = false; render(); q.focus(); });
  render();
})();
