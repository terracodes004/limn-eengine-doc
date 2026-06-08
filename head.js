let head = document.head;
head.innerHTML += `
<meta name="description" content="Limn Engine — A lightweight, high-performance 2D HTML5 Canvas game engine framework featuring an automated dual-canvas baking system, advanced physics, kinematic projectiles, multi-channel sound cloning, and built-in particle systems for rapid indie web game development.">
<meta name="keywords" content="Limn Engine, HTML5 game engine, 2D canvas framework, javascript game development, epic.js, dual canvas optimization, performance.now easing, web audio polyphony, game physics library, indie game tools">
<meta name="author" content="Owolabi Kehinde">
<meta name="robots" content="index, follow">

<meta property="og:type" content="website">
<meta property="og:title" content="Limn Engine — High-Performance 2D HTML5 Canvas Game Framework">
<meta property="og:description" content="Build fast browser games without the overhead. Features native dynamic tile blitting, multi-channel sound mixing, automatic viewport culling, and zero-dependency math pipelines.">
<meta property="og:image" content="img/logo.png">

<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="Limn Engine — High-Performance 2D HTML5 Canvas Game Framework">
<meta property="twitter:description" content="Build fast browser games without the overhead. Features native dynamic tile blitting, multi-channel sound mixing, automatic viewport culling, and zero-dependency math pipelines.">
<meta property="twitter:image" content="img/logo.png">

<meta name="theme-color" content="#000321">
`;

document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav ul li').forEach(li => {
    const a = li.querySelector('a');
    if (a && a.getAttribute('href') === path) li.classList.add('active');
  });

  // Burger menu toggle
  const burger = document.getElementById('nav-burger');
  const aside  = document.querySelector('aside');
  if (burger && aside) {
    burger.addEventListener('click', () => aside.classList.toggle('open'));
  }
});
