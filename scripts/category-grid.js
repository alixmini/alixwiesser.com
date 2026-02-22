function initCategoryGrid(category){
  var container = document.getElementById('category-grid');
  if(!container) return;
  var manifestUrl = category + '/images/list.json';

  function showEmpty(){
    container.innerHTML = '<p style="text-align:center;color:#6b6f73;margin:40px 0;">No projects yet.</p>';
  }

  fetch(manifestUrl).then(function(r){
    if(!r.ok) throw new Error('no manifest');
    return r.json();
  }).then(function(list){
    if(!Array.isArray(list) || list.length===0){ showEmpty(); return }
    container.innerHTML = '';
    list.forEach(function(filename){
      var name = filename.replace(/\.[^.]+$/, '');
      var link = document.createElement('a');
      link.className = 'category-item';
      link.href = category + '/' + name + '.html';

      var img = document.createElement('img');
      img.src = category + '/images/' + filename;
      img.alt = name;
      var rot = (Math.random()*4 - 2).toFixed(2); // -2 to +2
      img.style.transform = 'rotate(' + rot + 'deg)';

      link.appendChild(img);
      container.appendChild(link);
    });
  }).catch(function(){
    // if manifest fetch fails, try to guess common image names (best-effort) — otherwise empty
    showEmpty();
  });
}

window.initCategoryGrid = initCategoryGrid;
