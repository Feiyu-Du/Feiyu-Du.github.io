const OWN_NAME = 'Feiyu Du';

const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const authorHTML = authors => authors.map(name => name === OWN_NAME ? `<strong>${escapeHTML(name)}</strong>` : escapeHTML(name)).join(', ');
const statusClass = status => status === 'Under Review' ? 'under-review' : '';
const linksHTML = links => Object.entries(links || {}).map(([label, url]) => `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">${escapeHTML(label)}</a>`).join('');

async function getJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

function renderPublications(publications, filter = 'all') {
  // Explicit current-work display order; target venue years are not publication dates.
  const currentWorkOrder = [
    'ttm-2026',
    'physics-2026',
    'gradual-da-2026',
    'representation-reuse-2026',
    'feature-interactions-2027',
    'calibration-2027'
  ];
  const matching = publications
    .filter(item => filter === 'all' || item.category === filter)
    .map((item, index) => ({ item, index }));
  const currentWork = currentWorkOrder
    .map(id => matching.find(entry => entry.item.id === id)?.item)
    .filter(Boolean);
  const published = matching
    .filter(entry => !currentWorkOrder.includes(entry.item.id))
    .sort((a, b) => b.item.year - a.item.year || a.index - b.index)
    .map(entry => entry.item);
  const publicationHTML = item => `
        <article class="publication ${item.status === 'Under Review' ? 'is-under-review' : ''}">
          <div class="publication-image"><img src="${escapeHTML(item.image || 'assets/images/publications/paper-placeholder.svg')}" alt="${!item.image || item.image.includes('paper-placeholder') ? 'Paper figure pending' : `Figure from ${escapeHTML(item.title)}`}" width="480" height="300" loading="lazy"></div>
          <div class="publication-content">
            <h3>${escapeHTML(item.title)}</h3>
            <p class="authors">${authorHTML(item.authors)}</p>
            ${item.status === 'Under Review'
              ? '<p class="venue"><span class="status under-review">Under Review</span></p>'
              : `<p class="venue">${escapeHTML(item.venue)}<span class="status ${statusClass(item.status)}">${escapeHTML(item.status)}</span></p>`}
            ${item.description ? `<p class="description">${escapeHTML(item.description)}</p>` : ''}
            ${Object.keys(item.links || {}).length ? `<div class="paper-links">${linksHTML(item.links)}</div>` : ''}
          </div>
        </article>`;
  const currentWorkHTML = currentWork.length
    ? `<section class="year-group" aria-labelledby="year-2026"><h3 id="year-2026">2026</h3><div>${currentWork.map(publicationHTML).join('')}</div></section>`
    : '';
  const years = [...new Set(published.map(item => item.year))];
  const publishedHTML = years.map(year => `
      <section class="year-group" aria-labelledby="year-${year}">
      <h3 id="year-${year}">${year}</h3>
      <div>${published.filter(item => item.year === year).map(publicationHTML).join('')}</div>
      </section>`).join('');
  document.querySelector('#publication-list').innerHTML = currentWorkHTML + publishedHTML || '<p>No publications in this category.</p>';
}

async function initPublications() {
  try {
    const publications = await getJSON('data/publications.json');
    renderPublications(publications);
    document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-pressed', 'false'); });
      button.classList.add('active'); button.setAttribute('aria-pressed', 'true');
      renderPublications(publications, button.dataset.filter);
    }));
  } catch (error) {
    document.querySelector('#publication-list').innerHTML = '<p>Publication data could not be loaded.</p>';
  }
}

async function initNews() {
  try {
    const news = await getJSON('data/news.json');
    const list = document.querySelector('#news-list');
    const button = document.querySelector('#news-more');
    let expanded = false;
    const paint = () => {
      list.innerHTML = (expanded ? news : news.slice(0, 5)).map(item => {
        let content = escapeHTML(item.text);
        if (item.link && item.text.includes(item.link.text)) {
          const [before, ...after] = item.text.split(item.link.text);
          content = `${escapeHTML(before)}<a href="${escapeHTML(item.link.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.link.text)}</a>${escapeHTML(after.join(item.link.text))}`;
        }
        return `<article class="news-item"><time class="news-date">${escapeHTML(item.date)}</time><p>${content}</p></article>`;
      }).join('');
      if (news.length > 5) { button.hidden = false; button.textContent = expanded ? 'Show less' : 'Show more'; }
    };
    button.addEventListener('click', () => { expanded = !expanded; paint(); }); paint();
  } catch (error) { document.querySelector('#news-list').innerHTML = '<p>News data could not be loaded.</p>'; }
}

function initUI() {
  document.querySelector('#year').textContent = new Date().getFullYear();
  const portrait = document.querySelector('.portrait img');
  portrait.addEventListener('error', () => { portrait.closest('.portrait').classList.add('placeholder'); portrait.src = portrait.dataset.fallback; }, { once: true });
  const toggle = document.querySelector('.nav-toggle'); const links = document.querySelector('#nav-links');
  toggle.addEventListener('click', () => { const open = links.classList.toggle('open'); toggle.setAttribute('aria-expanded', String(open)); });
  links.addEventListener('click', () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); });
}

initUI(); initNews(); initPublications();
