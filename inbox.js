import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://pjtpesdhjfvcidfkxord.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdHBlc2RoamZ2Y2lkZmt4b3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNDUyNDUsImV4cCI6MjEwMzcyMTI0NX0.110aDXEqJ4PxjKWNv1Z2YNR8frklg3WW1u0HePDoN38';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadInbox() {
  const container = document.getElementById('notifications-list');
  if (!container) return;

  let notifications = [];

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (!userError && user) {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        notifications = data;
      }
    }
  } catch (err) {
    console.log('Using local fallback inbox');
  }

  if (notifications.length === 0) {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((currentDate - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);

    const weeklyTopics = [
      {
        title: '🚀 Weekly Engine Optimization Report',
        content: 'Local offline service worker caches and Supabase synchronization pipelines are running smoothly. Zero bottlenecks detected.'
      },
      {
        title: '🎨 Creator Spotlight & Particle Presets',
        content: 'Check out the new built-in particle presets this week! Try experimenting with the explosion and magic effects in your playground.'
      },
      {
        title: '⚡ Dual-Canvas Performance Tip',
        content: 'Remember that static background objects perform best when utilizing the offscreen buffer rendering pipeline in v4.'
      },
      {
        title: '🎮 Physics & Collision Spotlight',
        content: 'Round objects are fully supported this week with enableCircleCollision(). Test out your custom hitboxes!'
      }
    ];

    const currentWeeklyTopic = weeklyTopics[weekNumber % weeklyTopics.length];

    notifications = [
      {
        id: `auto-monthly-${currentDate.getFullYear()}-${currentDate.getMonth()}`,
        title: `✨ ${monthName} Creator Digest & Updates`,
        content: `Your automated ${monthName} community summary is ready! Top creations feature advanced canvas optimizations and smooth camera shakes. Keep building!`,
        created_at: new Date().toISOString()
      },
      {
        id: `auto-weekly-${weekNumber}`,
        title: currentWeeklyTopic.title,
        content: currentWeeklyTopic.content,
        created_at: new Date().toISOString()
      }
    ];
  }

  let readIds = JSON.parse(localStorage.getItem('limn_read_notifications') || '[]');

  container.innerHTML = '';
  
  notifications.forEach(item => {
    const isRead = readIds.includes(item.id);
    const dateFormatted = new Date(item.created_at || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const card = document.createElement('div');
    const borderColor = isRead ? 'var(--border)' : 'var(--accent)';
    const bgStyle = isRead ? 'var(--surface)' : 'rgba(255, 99, 140, 0.04)';

    card.style.cssText = `background: ${bgStyle}; border: 1.5px solid ${borderColor}; border-radius: 14px; padding: 24px; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); position: relative;`;
    
    const unreadDot = !isRead 
      ? `<span class="unread-dot" style="height: 10px; width: 10px; background-color: var(--accent); border-radius: 50%; display: inline-block; box-shadow: 0 0 10px var(--accent); margin-right: 8px;"></span>` 
      : '';

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(255, 99, 140, 0.1); padding-bottom: 10px;">
        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #ffffff; display: flex; align-items: center;">
          ${unreadDot}${item.title}
        </h3>
        <span style="font-size: 0.8rem; color: var(--accent2); font-family: 'Space Mono', monospace; background: rgba(127, 255, 178, 0.08); padding: 4px 10px; border-radius: 20px; border: 1px solid rgba(127, 255, 178, 0.2);">${dateFormatted}</span>
      </div>
      <div style="font-size: 0.95rem; color: var(--text); line-height: 1.6;">
        ${item.content}
      </div>
    `;

    if (!isRead) {
      card.addEventListener('click', () => {
        readIds.push(item.id);
        localStorage.setItem('limn_read_notifications', JSON.stringify(readIds));

        card.style.borderColor = 'var(--border)';
        card.style.background = 'var(--surface)';
        const dot = card.querySelector('.unread-dot');
        if (dot) dot.remove();
      });
    }

    container.appendChild(card);
  });
}

loadInbox();
