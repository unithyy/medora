/* MEDORA CLINIC — демонстрационная форма записи. Данные никуда не отправляются и не сохраняются. */
(function () {
  'use strict';
  var form = document.getElementById('booking-form');
  var M = window.MEDORA;
  if (!form || !M) return;

  var f = form.elements, ok = document.getElementById('form-ok'), okText = document.getElementById('ok-text');

  // Список врачей
  var any = document.createElement('option');
  any.value = 'any'; any.textContent = 'Подберите мне врача';
  f.doctor.appendChild(any);
  M.doctors.forEach(function (d) {
    var op = document.createElement('option');
    op.value = d.id; op.textContent = d.name + ' — ' + M.specs[d.spec];
    f.doctor.appendChild(op);
  });
  var pre = new URLSearchParams(location.search).get('doctor');
  if (pre && f.doctor.querySelector('option[value="' + pre.replace(/\D/g, '') + '"]')) f.doctor.value = pre.replace(/\D/g, '');

  // Границы даты
  function iso(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var today = new Date(), max = new Date(); max.setFullYear(today.getFullYear() + 1);
  f.date.min = iso(today); f.date.max = iso(max);

  function setErr(name, msg) {
    var el = f[name], p = document.getElementById('err-' + name);
    if (msg) { el.setAttribute('aria-invalid', 'true'); p.textContent = msg; p.hidden = false; }
    else { el.removeAttribute('aria-invalid'); p.textContent = ''; p.hidden = true; }
    return !msg;
  }

  var rules = {
    name: function () {
      var v = f.name.value.trim();
      return setErr('name', /^[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё\s'-]{1,59}$/.test(v) ? '' : 'Введите имя буквами, не короче 2 символов.');
    },
    phone: function () {
      var d = f.phone.value.replace(/\D/g, '');
      var good = (d.length === 11 && /^[78]/.test(d)) || d.length === 10;
      return setErr('phone', good ? '' : 'Введите телефон полностью, например +7 900 000-00-00.');
    },
    doctor: function () { return setErr('doctor', f.doctor.value ? '' : 'Выберите врача или вариант «Подберите мне врача».'); },
    date: function () {
      var v = f.date.value;
      if (!v) return setErr('date', 'Укажите желаемую дату приёма.');
      if (v < f.date.min) return setErr('date', 'Дата не может быть в прошлом.');
      if (v > f.date.max) return setErr('date', 'Выберите дату не позднее чем через год.');
      return setErr('date', '');
    },
    consent: function () { return setErr('consent', f.consent.checked ? '' : 'Необходимо согласие на обработку персональных данных.'); }
  };

  Object.keys(rules).forEach(function (k) {
    var ev = (k === 'doctor' || k === 'date' || k === 'consent') ? 'change' : 'blur';
    f[k].addEventListener(ev, rules[k]);
    f[k].addEventListener('input', function () { if (f[k].getAttribute('aria-invalid')) rules[k](); });
  });

  // Счётчик комментария
  var cnt = document.getElementById('comment-count');
  f.comment.addEventListener('input', function () { cnt.textContent = f.comment.value.length + ' / 300'; });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ok.hidden = true;
    var firstBad = null;
    Object.keys(rules).forEach(function (k) { if (!rules[k]() && !firstBad) firstBad = f[k]; });
    if (firstBad) { firstBad.focus(); return; }

    var doc = f.doctor.options[f.doctor.selectedIndex].text;
    var parts = f.date.value.split('-');
    okText.textContent = f.name.value.trim() + ', демонстрационная заявка на ' + parts[2] + '.' + parts[1] + '.' + parts[0] + ' (' + doc + ') сформирована.';
    form.reset();
    cnt.textContent = '0 / 300';
    ok.hidden = false;
    ok.focus();
    ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });
})();
