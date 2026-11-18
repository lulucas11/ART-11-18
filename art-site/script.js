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

/* ===== Contact form -> FormSubmit AJAX ===== */
const contactForm = document.getElementById('contactForm');
const formMsg = document.getElementById('formMsg');

contactForm.addEventListener('submit', async e => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const endpoint = contactForm.dataset.email;

  if (!endpoint || endpoint.indexOf('__FORM_EMAIL__') !== -1) {
    formMsg.textContent = 'The contact form is not configured yet. Please contact us directly by email.';
    formMsg.className = 'form-msg error';
    return;
  }

  submitBtn.disabled = true;
  const original = submitBtn.innerHTML;
  submitBtn.textContent = 'Sending…';
  formMsg.textContent = '';

  const payload = {
    name: contactForm.elements.name.value,
    organisation: contactForm.elements.org.value,
    email: contactForm.elements.email.value,
    region: contactForm.elements.region.value,
    message: contactForm.elements.message.value,
    _subject: 'ART website enquiry — ' + contactForm.elements.org.value
  };

  try {
    const res = await fetch('https://formsubmit.co/ajax/' + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success !== false) {
      formMsg.textContent = 'Thank you — your enquiry has been sent. We will be in touch shortly.';
      formMsg.className = 'form-msg success';
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    formMsg.textContent = 'Sorry, we could not send your message. Please try again or contact us directly by email.';
    formMsg.className = 'form-msg error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = original;
  }
});
