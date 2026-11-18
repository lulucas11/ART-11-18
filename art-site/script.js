/* ===== Mobile navigation ===== */
const toggle = document.getElementById('menuToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

/* ===== FAQ accordion ===== */
document.querySelectorAll('.acc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const panel = item.querySelector('.acc-panel');
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    // close others
    document.querySelectorAll('.acc-btn').forEach(other => {
      other.setAttribute('aria-expanded', 'false');
      other.parentElement.querySelector('.acc-panel').style.maxHeight = null;
    });
    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

/* ===== Gallery filters ===== */
document.querySelectorAll('.gtab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.gtab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    const filter = tab.dataset.filter;
    document.querySelectorAll('.gitem').forEach(item => {
      item.classList.toggle('hide', filter !== 'all' && item.dataset.cat !== filter);
    });
  });
});

/* ===== Lightbox ===== */
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCap');
document.querySelectorAll('.gitem').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = item.querySelector('figcaption').textContent;
    lb.classList.add('open');
  });
});
function closeLb(){ lb.classList.remove('open'); lbImg.src=''; }
document.getElementById('lbClose').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if(e.target === lb) closeLb(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLb(); });

/* ===== Contact form -> mailto ===== */
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const body = [
    'Name: ' + f.name.value,
    'Organisation: ' + f.org.value,
    'Email: ' + f.email.value,
    'Region of interest: ' + f.region.value,
    '',
    'Message:',
    f.message.value
  ].join('\n');
  window.location.href = 'mailto:307534719@qq.com?subject=' + encodeURIComponent('ART enquiry from ' + f.org.value) + '&body=' + encodeURIComponent(body);
});
