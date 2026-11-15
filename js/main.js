/* MEDORA CLINIC — общий скрипт. Все данные демонстрационные и вымышленные. */
(function () {
  'use strict';

  var SPECS = {
    therapy: 'Терапевт', cardio: 'Кардиолог', neuro: 'Невролог', ortho: 'Ортопед-травматолог',
    peds: 'Педиатр', eye: 'Офтальмолог', gyn: 'Гинеколог', derm: 'Дерматолог'
  };

  // Вымышленные персонажи
  var DOCTORS = [
    { id: 1, name: 'Елена Воронцова', spec: 'therapy', exp: 18, desc: 'Ведёт взрослых пациентов, помогает разобраться с жалобами и составляет понятный план обследования.' },
    { id: 2, name: 'Михаил Ларионов', spec: 'cardio', exp: 22, desc: 'Консультирует по давлению, ритму сердца и профилактике сердечно-сосудистых заболеваний.' },
    { id: 3, name: 'Ирина Кравец', spec: 'neuro', exp: 15, desc: 'Работает с головной болью, головокружениями и болью в спине, объясняет каждый шаг лечения.' },
    { id: 4, name: 'Дмитрий Орлов', spec: 'ortho', exp: 12, desc: 'Принимает при болях в суставах и после травм, подбирает реабилитацию без спешки.' },
    { id: 5, name: 'Светлана Белова', spec: 'peds', exp: 9, desc: 'Наблюдает детей с рождения, спокойно общается и с малышами, и с родителями.' },
    { id: 6, name: 'Андрей Никитин', spec: 'eye', exp: 14, desc: 'Проверяет зрение, подбирает коррекцию и следит за состоянием глаз при работе за экраном.' },
    { id: 7, name: 'Мария Тихонова', spec: 'gyn', exp: 16, desc: 'Ведёт плановые осмотры и консультации, уделяя время вопросам пациенток.' },
    { id: 8, name: 'Олег Зайцев', spec: 'derm', exp: 7, desc: 'Консультирует по состоянию кожи, родинкам и повседневному уходу.' }
  ];

  var KEY = 'medora:favorites';
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.3C1.2 8.4 3 5 6.3 5c2 0 3.6 1.1 4.4 2.6h.6C12.1 6.1 13.7 5 15.7 5 19 5 20.8 8.400 19.500 11.700 17.500 16.400 12 21 12 21z"/></svg>';

  function getFav() {
    try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function setFav(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { /* хранилище недоступно */ } }
  function toggleFav(id) {
    var f = getFav(), i = f.indexOf(id);
    if (i > -1) { f.splice(i, 1); } else { f.push(id); }
    setFav(f);
    return i < 0;
  }

  function card(d) {
    var on = getFav().indexOf(d.id) > -1;
    var yrs = d.exp % 10 === 1 && d.exp !== 11 ? 'год' : (d.exp % 10 > 1 && d.exp % 10 < 5 && (d.exp < 12 || d.exp > 14) ? 'года' : 'лет');
    return '<article class="card doc" data-reveal>' +
      '<img src="assets/images/doctor-' + d.id + '.svg" width="400" height="400" loading="lazy" alt="Условный портрет врача (иллюстрация): ' + d.name + '">' +
      '<div class="doc-b"><span class="tag">' + SPECS[d.spec] + '</span>' +
      '<h3>' + d.name + '</h3><p class="exp">Стаж: ' + d.exp + ' ' + yrs + '</p><p>' + d.desc + '</p>' +
      '<div class="doc-a"><a class="btn btn-s" href="contacts.html?doctor=' + d.id + '#booking">Записаться</a>' +
      '<button type="button" class="fav" data-fav="' + d.id + '" aria-pressed="' + on + '" aria-label="' +
      (on ? 'Убрать из избранного: ' : 'Добавить в избранное: ') + d.name + '">' + HEART + '</button></div></div></article>';
  }

  window.MEDORA = { specs: SPECS, doctors: DOCTORS, card: card, getFav: getFav };

  // Избранное: одно делегированное обработчик на все страницы
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-fav]');
    if (!b) return;
    var id = Number(b.getAttribute('data-fav'));
    var on = toggleFav(id);
    var d = DOCTORS.filter(function (x) { return x.id === id; })[0];
    b.setAttribute('aria-pressed', on);
    b.setAttribute('aria-label', (on ? 'Убрать из избранного: ' : 'Добавить в избранное: ') + d.name);
    document.dispatchEvent(new CustomEvent('medora:fav'));
  });

  // Мобильное меню
  var btn = document.querySelector('.burger'), nav = document.getElementById('nav');
  if (btn && nav) {
    var setMenu = function (open) {
      btn.setAttribute('aria-expanded', open);
      nav.classList.toggle('open', open);
      document.body.classList.toggle('no-scroll', open);
    };
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 900) setMenu(false); });
  }

  // Популярные врачи на главной
  var pop = document.getElementById('popular-doctors');
  if (pop) {
    pop.innerHTML = [1, 2, 3, 5].map(function (id) {
      return card(DOCTORS.filter(function (d) { return d.id === id; })[0]);
    }).join('');
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // GSAP: одна сцена на первом экране и мягкое появление блоков
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.gsap && window.ScrollTrigger && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    var hero = document.querySelectorAll('[data-hero]');
    if (hero.length) {
      gsap.from(hero, { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 });
    }
    var items = gsap.utils.toArray('[data-reveal]');
    if (items.length) {
      gsap.set(items, { opacity: 0, y: 28 });
      ScrollTrigger.batch(items, {
        start: 'top 90%', once: true,
        onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out', overwrite: true }); }
      });
    }
  }
})();
