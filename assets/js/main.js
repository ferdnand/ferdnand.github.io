async function loadJSON(path){ const r = await fetch(path); return r.json(); }

function renderSocials(socials){
  const el = document.getElementById('socials');
  if(!el || !socials) return;
  socials.forEach(s=>{
    const a = document.createElement('a');
    a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
    a.textContent = s.label;
    el.appendChild(a);
  });
}

function renderSkills(groups){
  const grid = document.getElementById('skills-grid');
  groups.forEach(g=>{
    const card = document.createElement('div');
    card.className = 'skill-card';
    card.innerHTML = `<h3>${g.group}</h3>`;
    const wrap = document.createElement('div');
    wrap.className = 'skill-chips';
    g.items.forEach(name=>{
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = name;
      wrap.appendChild(span);
    });
    card.appendChild(wrap);
    grid.appendChild(card);
  });
}

function renderExperience(items){
  const wrap = document.getElementById('experience-timeline');
  items.forEach(item=>{
    const el = document.createElement('div');
    el.className = 'exp-item';
    el.innerHTML = `
      <div class="exp-header">
        <div>
          <div class="exp-role">${item.role}</div>
          <div class="exp-org">${item.org}</div>
        </div>
        <div class="exp-meta">${item.period}</div>
      </div>
      ${item.supporting ? `<div class="exp-pills">${item.supporting.map(p=>`<span class="pill">${p}</span>`).join('')}</div>` : ''}
      ${item.achievements?.length ? `<ul class="exp-list">${item.achievements.map(a=>`<li>${a}</li>`).join('')}</ul>` : ''}
      ${item.responsibilities?.length ? `<ul class="exp-list">${item.responsibilities.map(a=>`<li>${a}</li>`).join('')}</ul>` : ''}
    `;
    wrap.appendChild(el);
  });
}

function renderPublications(list){
  const ul = document.getElementById('publications-list');
  list.forEach(p=>{
    const li = document.createElement('li');
    li.className = 'pub-item';
    li.innerHTML = `
      <div>${p.citation}</div>
      <div class="pub-meta">${p.journal_year}</div>
      ${p.doi ? `<div><a href="${p.doi}" target="_blank" rel="noopener">DOI / Link</a></div>` : ''}
    `;
    ul.appendChild(li);
  });
}

function renderEducation(list, additional){
  const edu = document.getElementById('education-list');
  list.forEach(e=>{
    const li = document.createElement('li');
    li.className = 'edu-item';
    li.innerHTML = `<strong>${e.degree}</strong> — ${e.institution} <span class="pub-meta">(${e.period})</span>`;
    edu.appendChild(li);
  });
  const add = document.getElementById('additional-learning');
  additional.forEach(a=>{
    const li = document.createElement('li');
    li.className = 'edu-item';
    li.innerHTML = `<strong>${a.title}</strong> — ${a.org} <span class="pub-meta">(${a.year})</span>`;
    add.appendChild(li);
  });
}

function smoothNav(){
  document.querySelectorAll('.nav a').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const id = a.getAttribute('href');
      document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
      history.replaceState(null,'',id);
    });
  });
}

async function init(){
  document.getElementById('year').textContent = new Date().getFullYear();
  smoothNav();
  const [profile, skills, experience, pubs, edu] = await Promise.all([
    loadJSON('data/profile.json'),
    loadJSON('data/skills.json'),
    loadJSON('data/experience.json'),
    loadJSON('data/publications.json'),
    loadJSON('data/education.json')
  ]);
  if(profile?.socials) renderSocials(profile.socials);
  if(skills) renderSkills(skills);
  if(experience) renderExperience(experience);
  if(pubs) renderPublications(pubs);
  if(edu) renderEducation(edu.formal, edu.additional);
}

document.addEventListener('DOMContentLoaded', init);
