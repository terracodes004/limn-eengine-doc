document.addEventListener('DOMContentLoaded', () => {
  const searchModalOverlay = document.getElementById('universal-search-overlay');
  const openSearchBtn = document.getElementById('open-search-modal');
  const closeSearchBtn = document.getElementById('close-search-overlay');
  const searchInput = document.getElementById('overlay-search-input');
  const searchResults = document.getElementById('overlay-search-results');

  const fullSiteIndex = [
    { title: "What is Limn Engine?", snippet: "A zero-config 2D game engine for the browser. One file. No npm.", category: "Overview", url: "index.html#overview" },
    { title: "Your First Game – Setup", snippet: "Draw your game into existence with a single file setup.", category: "Tutorials", url: "index.html#setup" },
    { title: "Learn the Engine (Levels 1-4)", snippet: "Step-by-step progression through Limn Engine mechanics.", category: "Tutorials", url: "tutorial.html" },
    { title: "API Reference Guide", snippet: "Core methods, parameters, rendering loops, and utilities.", category: "Reference", url: "reference.html" },
    { title: "Download epic.js", snippet: "Get the latest core file for Limn Engine.", category: "Resources", url: "download.html" },
    { title: "Space Shooter Case Study", snippet: "Building an alien arcade game from scratch.", category: "Case Study", url: "alien.html" },
    { title: "Particle System Presets", snippet: "Advanced visual effects and particle emitters.", category: "Advanced", url: "advance.html" }
  ];

  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchModalOverlay) {
        searchModalOverlay.classList.add('active');
        if (searchInput) searchInput.focus();
      }
    });
  }

  const closeSearch = () => {
    if (searchModalOverlay) {
      searchModalOverlay.classList.remove('active');
      if (searchInput) searchInput.value = '';
      if (searchResults) searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">Start typing to search across all pages...</div>';
    }
  };

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', closeSearch);
  }

  if (searchModalOverlay) {
    searchModalOverlay.addEventListener('click', (e) => {
      if (e.target === searchModalOverlay) {
        closeSearch();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
    }
  });

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      if (query === '') {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">Start typing to search across all pages...</div>';
        return;
      }

      const matches = fullSiteIndex.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.snippet.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );

      if (matches.length === 0) {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 14px;">No results found for "<b>' + e.target.value + '</b>"</div>';
        return;
      }

      let html = '<div style="display: flex; flex-direction: column;">';
      matches.forEach((item) => {
        html += `
          <a href="${item.url}" class="page-search-result-link" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); text-decoration: none; display: flex; justify-content: space-between; align-items: center; transition: background 0.1s;">
            <div style="display: flex; flex-direction: column; gap: 2px; pointer-events: none;">
              <span style="color: #f8fafc; font-size: 14px; font-weight: 500;">${item.title}</span>
              <span style="color: #94a3b8; font-size: 12px;">${item.snippet}</span>
            </div>
            <span style="background: rgba(127,255,178,0.1); color: #7fffb2; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-family: 'Space Mono', monospace; pointer-events: none; white-space: nowrap; margin-left: 10px;">${item.category}</span>
          </a>
        `;
      });
      html += '</div>';

      searchResults.innerHTML = html;
    });
  }
});
     
