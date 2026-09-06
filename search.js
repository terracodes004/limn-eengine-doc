document.addEventListener('DOMContentLoaded', () => {
  const searchModalOverlay = document.getElementById('universal-search-overlay');
  const openSearchBtn = document.getElementById('open-search-modal');
  const closeSearchBtn = document.getElementById('close-search-overlay');
  const searchInput = document.getElementById('overlay-search-input');
  const searchResults = document.getElementById('overlay-search-results');

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
      if (searchResults) searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">Start typing to search across the page...</div>';
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
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b; font-size: 14px;">Start typing to search across the page...</div>';
        return;
      }

      const searchableElements = document.querySelectorAll('article h1, article h2, article h3, article p, article li, td');
      const matches = [];

      searchableElements.forEach((el) => {
        const text = el.textContent || '';
        if (text.toLowerCase().includes(query)) {
          matches.push(el);
        }
      });

      if (matches.length === 0) {
        searchResults.innerHTML = '<div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 14px;">No words found for "<b>' + e.target.value + '</b>"</div>';
        return;
      }

      let html = '<div style="display: flex; flex-direction: column;">';
      matches.forEach((el, index) => {
        let snippet = el.textContent.trim();
        if (snippet.length > 60) snippet = snippet.substring(0, 60) + '...';

        html += `
          <div class="page-search-result-item" data-match-index="${index}" style="padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); text-decoration: none; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.1s;">
            <span style="color: #f8fafc; font-size: 14px; font-weight: 500;">${snippet}</span>
            <span style="background: rgba(127,255,178,0.1); color: #7fffb2; font-size: 11px; padding: 2px 8px; border-radius: 4px; font-family: 'Space Mono', monospace;">Found on page</span>
          </div>
        `;
      });
      html += '</div>';

      searchResults.innerHTML = html;

      const resultNodes = searchResults.querySelectorAll('.page-search-result-item');
      resultNodes.forEach((node, index) => {
        node.addEventListener('click', () => {
          const targetElement = matches[index];
          closeSearch();
          
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          targetElement.style.transition = 'background 0.3s ease';
          const originalBg = targetElement.style.backgroundColor;
          targetElement.style.backgroundColor = 'rgba(127, 255, 178, 0.25)';
          setTimeout(() => {
            targetElement.style.backgroundColor = originalBg;
          }, 1200);
        });
      });
    });
  }
});
    
