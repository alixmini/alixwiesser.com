/* Shared mapping of project external links.
   The script will: 
   - On category pages: append an external CTA under each .card if mapping exists
   - On project.html: show a top-level external CTA for the current project (if mapping exists)
*/
(function(){
  const PROJECT_LINKS = {
    internet: {
      1: { url: 'http://tmmtou.com', label: 'visit tmmtou.com →', page: 'internet/tmmtou.html' },
      2: { url: 'https://alixw.substack.com/p/prompting', label: 'read bookbound write-up →', page: 'internet/bookbound.html' },
      3: { url: 'https://x.com/alixwiessser/status/1824810849350943231', label: 'see the old site →', page: 'internet/old-site.html' },
      4: { url: 'https://www.instagram.com/p/Ck4NSiCrOsC/', label: 'watch 21st bday video →', page: 'internet/21st-bday.html' },
      5: { url: 'https://www.instagram.com/p/Cy3l20MNFpZ/', label: 'watch 22nd bday video →', page: 'internet/22nd-bday.html' },
      6: { url: 'https://www.instagram.com/p/DBZzWCftS3K/', label: 'watch 23rd bday video →', page: 'internet/23rd-bday.html' }
    },
    irl: {
      1: { url: 'https://www.instagram.com/p/DR0bSA2DDHk/', label: 'see posters →', page: 'irl/cny-2025.html' },
      2: { url: 'https://www.strava.com/activities/14520417794', label: 'view on Strava →', page: 'irl/half-marathon.html' },
      3: { url: 'https://www.youtube.com/watch?v=Br0pPviZ6Zo', label: 'watch rag++ talk →', page: 'irl/rag-talk.html' },
      4: { url: 'https://luma.com/foclondon', label: 'event page →', page: 'irl/foc-talk.html' }
    },
    making: {
      1: { url: 'https://alixwiesser.tumblr.com/', label: 'visit film gallery →', page: 'making/film-gallery.html' },
      2: { url: 'https://www.instagram.com/p/DR0bSA2DDHk/', label: 'see posters →', page: 'making/home-posters.html' },
      3: { url: 'https://cerealboxyay.mmm.page/', label: 'open cereal box project →', page: 'making/cereal-box.html' },
      4: { url: 'https://www.instagram.com/reel/DD1heQ5sr4D/', label: 'watch →', page: 'making/christmas-hamper.html' },
      5: { url: 'https://www.instagram.com/p/DR2asn2jCEY/', label: 'see →', page: 'making/rothko.html' }
    }
    ,
    deepcuts: {
      1: { url: 'https://chickrecycledfunkyfashion.blogspot.com/2011/07/items-page-being-upgraded.html', label: 'visit chick rff →', page: 'deepcuts/chick-rff.html' },
      2: { url: 'https://mini-and-friends.blogspot.com/', label: 'visit mini-and-friends →', page: 'deepcuts/mini-and-friends.html' },
      3: { url: 'https://wiesserfood.blogspot.com/', label: 'visit ooh mummy! →', page: 'deepcuts/ooh-mummy.html' },
      4: { url: '', label: 'private (minyeatz)', page: 'deepcuts/minyeatz.html' },
      5: { url: 'https://www.youtube.com/watch?v=q9LY1kGIvls', label: 'watch kayaking →', page: 'deepcuts/kayaking.html' },
      6: { url: 'https://www.youtube.com/watch?v=V_M-ZDN09jI', label: 'watch annecy →', page: 'deepcuts/annecy.html' }
    }
  };

  function addCardExternalLinks(){
    const path = location.pathname.split('/').pop();
    const category = path.replace('.html','');
    if(!PROJECT_LINKS[category]) return;
    document.querySelectorAll('.card').forEach(card => {
      try{
        // attempt to deduce id via data-id or by matching href to mapping page
        const id = card.getAttribute('data-id');
        var info = null;
        if(id && PROJECT_LINKS[category][id]){
          info = PROJECT_LINKS[category][id];
        } else if(card.href){
          // try to find mapping by page path
          const rel = card.getAttribute('href');
          const p = rel && rel.replace(/^\/?/, '');
          for(const k in PROJECT_LINKS[category]){
            if(PROJECT_LINKS[category][k].page === p){ info = PROJECT_LINKS[category][k]; break }
          }
        }
        if(info){
          // avoid adding twice
          if(card.querySelector('.external-link')) return;
          const a = document.createElement('a');
          a.className = 'external-link';
          a.href = info.url;
          a.target = '_blank';
          a.rel = 'noopener';
          a.textContent = info.label;
          const title = card.querySelector('.card-title');
          if(title) title.insertAdjacentElement('afterend', a);
        }
      }catch(e){}
    });
  }

  function addProjectExternalCTA(){
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const id = params.get('id');
    if(!category || !id) return;
    const info = (PROJECT_LINKS[category] || {})[id];
    if(!info) return;
    // create CTA and insert below title
    const header = document.querySelector('.project-title') || document.querySelector('.top');
    if(!header) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'external-cta-wrap';
    const a = document.createElement('a');
    a.className = 'external-cta';
    a.href = info.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.textContent = info.label;
    wrapper.appendChild(a);
    header.insertAdjacentElement('afterend', wrapper);
  }

  // Return an array of all internal project URLs (project.html?category=...&id=...)
  window.__getAllProjectUrls = function(){
    const urls = [];
    Object.keys(PROJECT_LINKS).forEach(cat => {
      Object.keys(PROJECT_LINKS[cat]).forEach(id => {
        urls.push('project.html?category=' + cat + '&id=' + id);
      });
    });
    return urls;
  };

  // Return a random project URL (internal)
  window.__randomProjectUrl = function(){
    const all = window.__getAllProjectUrls();
    if(!all.length) return null;
    return all[Math.floor(Math.random() * all.length)];
  };
  
  // Return a random project URL and open it (helper used by feeling-lucky)
  window.__openRandomProject = function(){
    const url = window.__randomProjectUrl();
    if(url) location.href = url;
  };

  // Expose init function
  window.__projectLinksInit = function(){
    addCardExternalLinks();
    addProjectExternalCTA();
  };
})();
