/* ==========================================
   OZO — Interactive Application Engine
   Motion Design, 3D Tilt, Particle Physics & Micro-Interactions
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initInterestCounter();
  initSurveyOptions();
  initProcedural3DChassis();
  initO3ParticleSimulation();
  initScrollReveal();
  init3DCardTilt();
  initNavbarScroll();
});

/* ==========================================
   0. HERO PRODUCT DEMO VIDEO CONTROLLER
   Seamless play/pause toggle, overlay sync & accessibility
   ========================================== */
function initHeroVideo() {
  const video = document.getElementById('heroProductVideo');
  const overlay = document.getElementById('videoPlayOverlay');
  if (!video || !overlay) return;

  const hideOverlay = () => {
    overlay.classList.add('is-hidden');
  };

  const showOverlay = () => {
    overlay.classList.remove('is-hidden');
  };

  const startPlayback = () => {
    if (video.paused) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          hideOverlay();
        }).catch(() => {
          // Fallback if browser blocks unmuted autoplay
          video.muted = true;
          video.play().then(() => {
            hideOverlay();
          }).catch(() => {
            showOverlay();
          });
        });
      }
    } else {
      video.pause();
    }
  };

  overlay.addEventListener('click', (e) => {
    e.stopPropagation();
    startPlayback();
  });

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      overlay.click();
    }
  });

  video.addEventListener('play', hideOverlay);
  video.addEventListener('pause', showOverlay);
  video.addEventListener('ended', showOverlay);

  if (!video.paused) {
    hideOverlay();
  }
}

/* ==========================================
   1. SCROLL-DRIVEN REVEAL ANIMATIONS
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealElement = (el) => {
    el.classList.add('is-revealed');
  };

  let observer = null;
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(revealElement);
  }

  const checkViewport = () => {
    const threshold = (window.innerHeight || document.documentElement.clientHeight || 800) + 60;
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom >= 0) {
        revealElement(el);
        if (observer) observer.unobserve(el);
      }
    });
  };

  checkViewport();
  window.addEventListener('scroll', checkViewport, { passive: true });
  window.addEventListener('resize', checkViewport, { passive: true });
}

/* ==========================================
   2. NAVBAR STICKY SCROLL MICRO-INTERACTION
   ========================================== */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('is-scrolled');
    } else {
      navbar.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================
   3. INTERACTIVE 3D CARD TILT EFFECTS
   Subtle Apple-grade 3D tilt with dynamic specular glare
   ========================================== */
function init3DCardTilt() {
  const tiltCards = document.querySelectorAll('[data-tilt], .spec-item, .spatial-comparison-card, .bento-card');
  if (!tiltCards.length) return;

  tiltCards.forEach(card => {
    if (card.dataset.tiltInitialized) return;
    card.dataset.tiltInitialized = "true";

    // Inject specular glare layer if not present
    let glare = card.querySelector('.card-tilt-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-tilt-glare';
      card.appendChild(glare);
    }

    let isHovered = false;
    let animId = null;
    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;

    function renderTilt() {
      if (!isHovered) return;
      currentTiltX += (targetTiltX - currentTiltX) * 0.16;
      currentTiltY += (targetTiltY - currentTiltY) * 0.16;

      card.style.transform = `perspective(1000px) rotateX(${currentTiltX.toFixed(2)}deg) rotateY(${currentTiltY.toFixed(2)}deg) translateY(-3px)`;
      animId = requestAnimationFrame(renderTilt);
    }

    card.addEventListener('mouseenter', () => {
      isHovered = true;
      card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
      glare.style.opacity = '1';
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(renderTilt);
    });

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle tilt max (5.5 - 7 degrees)
      const maxTilt = parseFloat(card.dataset.tiltMax) || 6.0;
      targetTiltX = -((y - centerY) / centerY) * maxTilt;
      targetTiltY = ((x - centerX) / centerX) * maxTilt;

      // Position specular sheen
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      cancelAnimationFrame(animId);
      targetTiltX = 0;
      targetTiltY = 0;
      card.style.transition = 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      glare.style.opacity = '0';
    });
  });
}

/* ==========================================
   4. PROCEDURAL 3D MATTE-WHITE CHASSIS RENDERER
   Proportions: 114mm x 76mm x 25mm (4.5" x 3.0" x 1.0")
   Three.js WebGL with auto-rotation resume + inertia fallback
   ========================================== */
let scene, camera, renderer, controls;
let chassisMesh = null;
let isUserInteractingWithChassis = false;
let chassisResumeTimeout = null;

function initProcedural3DChassis() {
  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas) return;

  // Attempt Three.js WebGL initialization
  let threeSuccess = false;
  if (typeof THREE !== 'undefined') {
    try {
      scene = new THREE.Scene();
      const rect = canvas.getBoundingClientRect();
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(rect.width, rect.height);
      renderer.shadowMap.enabled = true;

      camera = new THREE.PerspectiveCamera(38, rect.width / rect.height, 0.1, 1000);
      camera.position.set(0, 120, 220);

      if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.8;
        controls.enableZoom = false; // Prevent wheel hijacking while scrolling page
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2 + 0.1;

        controls.addEventListener('start', () => {
          isUserInteractingWithChassis = true;
          if (chassisResumeTimeout) clearTimeout(chassisResumeTimeout);
        });

        controls.addEventListener('end', () => {
          if (chassisResumeTimeout) clearTimeout(chassisResumeTimeout);
          chassisResumeTimeout = setTimeout(() => {
            isUserInteractingWithChassis = false;
          }, 700);
        });
      }

      // Studio Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555, 0.5);
      hemiLight.position.set(0, 200, 0);
      scene.add(hemiLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
      dirLight.position.set(120, 180, 150);
      dirLight.castShadow = true;
      scene.add(dirLight);

      const fillLight = new THREE.DirectionalLight(0x0071e3, 0.4);
      fillLight.position.set(-120, -50, -100);
      scene.add(fillLight);

      // Procedural Chassis Geometry: 114 x 25 x 76 (X, Y, Z)
      const chassisGroup = new THREE.Group();

      // Body Shell
      const bodyGeo = new THREE.BoxGeometry(114, 25, 76);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xededf2,
        roughness: 0.35,
        metalness: 0.1
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.castShadow = true;
      body.receiveShadow = true;
      chassisGroup.add(body);

      // Glowing Power Switch Ring (Side-mounted)
      const switchGeo = new THREE.CylinderGeometry(4, 4, 2, 16);
      const switchMat = new THREE.MeshBasicMaterial({ color: 0x0071e3 });
      const powerSwitch = new THREE.Mesh(switchGeo, switchMat);
      powerSwitch.rotation.z = Math.PI / 2;
      powerSwitch.position.set(57.5, 0, 0);
      chassisGroup.add(powerSwitch);

      // Side Ventilation Slots (Array on Left Side Wall)
      const ventGroup = new THREE.Group();
      const ventMat = new THREE.MeshBasicMaterial({ color: 0x1d1d1f });
      for (let i = -3; i <= 3; i++) {
        const ventGeo = new THREE.BoxGeometry(2, 12, 4);
        const vent = new THREE.Mesh(ventGeo, ventMat);
        vent.position.set(-57.2, 0, i * 9);
        ventGroup.add(vent);
      }
      chassisGroup.add(ventGroup);

      // USB-C Charging Port Outline (Right Side Wall)
      const usbcGeo = new THREE.BoxGeometry(2, 4, 10);
      const usbcMat = new THREE.MeshBasicMaterial({ color: 0x86868b });
      const usbcPort = new THREE.Mesh(usbcGeo, usbcMat);
      usbcPort.position.set(57.2, -4, 20);
      chassisGroup.add(usbcPort);

      scene.add(chassisGroup);
      chassisMesh = chassisGroup;

      camera.lookAt(0, 0, 0);

      window.addEventListener('resize', () => {
        if (!canvas) return;
        const r = canvas.getBoundingClientRect();
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        renderer.setSize(r.width, r.height);
      });

      let autoRotSpeed = 0.003;
      function animateThree() {
        requestAnimationFrame(animateThree);
        if (chassisMesh && !isUserInteractingWithChassis) {
          chassisMesh.rotation.y += autoRotSpeed;
        }
        if (controls) controls.update();
        renderer.render(scene, camera);
      }
      animateThree();
      threeSuccess = true;
    } catch (err) {
      console.warn("Three.js initialization failed, activating 3D box fallback:", err);
      threeSuccess = false;
    }
  }

  // High-Fidelity 3D Box Fallback with Inertia and Damping
  if (!threeSuccess) {
    init3DChassisFallback(canvas);
  }
}

/* 2D Canvas Procedural 3D Box Fallback with Inertia & Damping */
function init3DChassisFallback(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function setSize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
  }
  setSize();
  window.addEventListener('resize', setSize);

  let rotX = 0.45;
  let rotY = 0.65;
  let velX = 0;
  let velY = 0;
  let isDragging = false;
  let lastX = 0, lastY = 0;

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    velX = 0;
    velY = 0;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    velY = dx * 0.008;
    velX = dy * 0.008;
    rotY += velY;
    rotX += velX;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('pointerup', () => { isDragging = false; });
  window.addEventListener('pointercancel', () => { isDragging = false; });

  function renderFallback() {
    requestAnimationFrame(renderFallback);

    if (!isDragging) {
      velX *= 0.93; // Smooth damping
      velY *= 0.93;
      rotX += velX;
      rotY += velY;

      // Subtle ambient auto-rotation once velocity settles
      if (Math.abs(velX) < 0.0002 && Math.abs(velY) < 0.0002) {
        rotY += 0.0025;
      }
    }

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const scale = Math.min(w, h) * 0.0028;

    // Dimensions: 114 x 25 x 76
    const hw = (114 / 2) * scale;
    const hh = (25 / 2) * scale;
    const hd = (76 / 2) * scale;

    const vertices = [
      [-hw, -hh, -hd], [hw, -hh, -hd], [hw, hh, -hd], [-hw, hh, -hd],
      [-hw, -hh,  hd], [hw, -hh,  hd], [hw, hh,  hd], [-hw, hh,  hd]
    ];

    const proj = vertices.map(([x, y, z]) => {
      // Rotate Y
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      // Rotate X
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const fov = 450;
      const pz = fov / (fov + z2);
      return [cx + x1 * pz, cy + y2 * pz, z2];
    });

    const faces = [
      { idx: [0, 1, 2, 3], color: '#e2e2e8', border: '#d2d2d7' }, // Back
      { idx: [4, 5, 6, 7], color: '#f0f0f4', border: '#d2d2d7' }, // Front
      { idx: [0, 1, 5, 4], color: '#f8f8fb', border: '#dcdce0' }, // Top
      { idx: [2, 3, 7, 6], color: '#d8d8de', border: '#c8c8cf' }, // Bottom
      { idx: [0, 3, 7, 4], color: '#e8e8ee', border: '#d0d0d5' }, // Left
      { idx: [1, 2, 6, 5], color: '#dedee4', border: '#ceced4' }  // Right
    ];

    // Sort faces by average z depth
    faces.forEach(f => {
      f.avgZ = (proj[f.idx[0]][2] + proj[f.idx[1]][2] + proj[f.idx[2]][2] + proj[f.idx[3]][2]) / 4;
    });
    faces.sort((a, b) => b.avgZ - a.avgZ);

    // Subtle drop shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy + hh + 40, hw * 1.3, hd * 0.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
    ctx.filter = 'blur(10px)';
    ctx.fill();
    ctx.restore();

    faces.forEach(f => {
      ctx.beginPath();
      ctx.moveTo(proj[f.idx[0]][0], proj[f.idx[0]][1]);
      for (let i = 1; i < f.idx.length; i++) {
        ctx.lineTo(proj[f.idx[i]][0], proj[f.idx[i]][1]);
      }
      ctx.closePath();
      ctx.fillStyle = f.color;
      ctx.fill();
      ctx.strokeStyle = f.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }
  renderFallback();
}

/* ==========================================
   5. SPATIAL SCALE COMPARISON SWITCHER
   Fluid CSS morph cross-fading & smooth metric transitions
   ========================================== */
const spatialData = {
  iphone: {
    name: "iPhone 17",
    dims: "149.6mm × 71.5mm",
    ratio: "76.2%",
    label: "Length Relative to iPhone 17"
  },
  airpods: {
    name: "AirPods Pro Case",
    dims: "60.6mm × 45.2mm",
    ratio: "188.1%",
    label: "OZO is 1.88× Size of AirPods Pro Case"
  },
  shaker: {
    name: "Gym Shaker Bottle (28 oz)",
    dims: "220.0mm × 90.0mm",
    ratio: "51.8%",
    label: "Height Relative to 28 oz Shaker Bottle"
  }
};

function switchSpatialTab(itemKey, btnElement) {
  document.querySelectorAll('.spatial-tab-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  // Fluid cross-fade between target device models
  document.querySelectorAll('.device-target-view').forEach(v => {
    v.classList.remove('active-view');
  });

  const targetView = document.getElementById(`targetView_${itemKey}`);
  if (targetView) {
    targetView.classList.add('active-view');
  }

  // Smooth metric text transition
  const data = spatialData[itemKey];
  const ratioVal = document.getElementById('spatialRatioVal');
  const ratioLabel = document.getElementById('spatialRatioLabel');

  if (data && ratioVal && ratioLabel) {
    ratioVal.style.opacity = '0';
    ratioVal.style.transform = 'translateY(4px)';
    ratioLabel.style.opacity = '0';
    ratioLabel.style.transform = 'translateY(4px)';

    setTimeout(() => {
      ratioVal.textContent = data.ratio;
      ratioLabel.textContent = data.label;
      ratioVal.style.opacity = '1';
      ratioVal.style.transform = 'translateY(0)';
      ratioLabel.style.opacity = '1';
      ratioLabel.style.transform = 'translateY(0)';
    }, 140);
  }
}

/* ==========================================
   6. ENHANCED O3 GAS NEUTRALIZATION PARTICLE SIMULATION
   Interactive cursor ripple & magnetic repulsion physics
   ========================================== */
let speedCanvas, speedCtx;
let targetSpeedMultiplier = 1.0;
let currentSpeedMultiplier = 1.0;
let simulationRunning = false;
let odorParticles = [];
let o3Particles = [];
let neutralizationBursts = [];
let ripples = [];

// Pointer tracking on simulation canvas
let isCursorOverCanvas = false;
let cursorCanvasX = -999;
let cursorCanvasY = -999;
let lastRippleTime = 0;

function initO3ParticleSimulation() {
  speedCanvas = document.getElementById('speedCanvas');
  if (!speedCanvas) return;

  speedCtx = speedCanvas.getContext('2d');
  resizeSimCanvas();
  window.addEventListener('resize', resizeSimCanvas);

  // Mouse & Touch Pointer Listeners
  const updatePointerPos = (clientX, clientY) => {
    const rect = speedCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    cursorCanvasX = (clientX - rect.left) * dpr;
    cursorCanvasY = (clientY - rect.top) * dpr;
    isCursorOverCanvas = true;

    // Emit gentle ripple waves on cursor movement
    const now = performance.now();
    if (now - lastRippleTime > 90) {
      ripples.push({
        x: cursorCanvasX,
        y: cursorCanvasY,
        r: 8,
        maxR: 85,
        alpha: 0.35
      });
      lastRippleTime = now;
    }
  };

  speedCanvas.addEventListener('mousemove', (e) => {
    updatePointerPos(e.clientX, e.clientY);
  });

  speedCanvas.addEventListener('mouseenter', (e) => {
    updatePointerPos(e.clientX, e.clientY);
  });

  speedCanvas.addEventListener('mouseleave', () => {
    isCursorOverCanvas = false;
    cursorCanvasX = -999;
    cursorCanvasY = -999;
  });

  speedCanvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  speedCanvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointerPos(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  speedCanvas.addEventListener('touchend', () => {
    isCursorOverCanvas = false;
    cursorCanvasX = -999;
    cursorCanvasY = -999;
  });

  resetParticleState();
  requestAnimationFrame(renderO3Sim);
}

function resizeSimCanvas() {
  if (!speedCanvas) return;
  const rect = speedCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  speedCanvas.width = rect.width * dpr;
  speedCanvas.height = rect.height * dpr;
}

function resetParticleState() {
  if (!speedCanvas) return;
  const w = speedCanvas.width || 400;
  const h = speedCanvas.height || 200;

  odorParticles = [];
  o3Particles = [];
  neutralizationBursts = [];
  ripples = [];

  // Create 30 Red Odor Particles with natural ambient wander
  for (let i = 0; i < 30; i++) {
    odorParticles.push({
      x: Math.random() * (w - 60) + 30,
      y: Math.random() * (h - 60) + 30,
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      radius: 4.5,
      seed: Math.random() * 50
    });
  }
}

function toggleSimulation() {
  simulationRunning = !simulationRunning;
  const btn = document.getElementById('btnSimToggle');
  const status = document.getElementById('simStatusReadout');

  if (simulationRunning) {
    if (btn) {
      btn.textContent = "Reset Simulation";
      btn.style.background = "#1d1d1f";
    }
    if (status) {
      status.textContent = "Status: O₃ Active (Neutralizing Organic Odor Particles)";
    }

    // Spawn 28 Blue/Cyan O3 Gas Particles
    const w = speedCanvas ? speedCanvas.width : 400;
    const h = speedCanvas ? speedCanvas.height : 200;
    o3Particles = [];
    for (let i = 0; i < 28; i++) {
      o3Particles.push({
        x: Math.random() * (w - 40) + 20,
        y: Math.random() * (h - 40) + 20,
        vx: (Math.random() - 0.5) * 2.8,
        vy: (Math.random() - 0.5) * 2.8,
        radius: 3.5
      });
    }
  } else {
    if (btn) {
      btn.textContent = "Start Simulation";
      btn.style.background = "#1d1d1f";
    }
    if (status) {
      status.textContent = "Status: Idle (Odor Molecules Present • Hover/Touch to Disperse)";
    }
    resetParticleState();
  }
}

function setSpeedMultiplier(multiplier, btnElement) {
  document.querySelectorAll('.speed-stage-btn').forEach(b => b.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  targetSpeedMultiplier = multiplier;
}

let respawnTimeout = null;

function renderO3Sim() {
  if (!speedCanvas || !speedCtx) return;

  const w = speedCanvas.width;
  const h = speedCanvas.height;
  speedCtx.clearRect(0, 0, w, h);

  // Smooth Speed Interpolation
  currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.08;

  // Gym Bag Chamber Boundary Stroke
  speedCtx.strokeStyle = "rgba(0, 113, 227, 0.12)";
  speedCtx.lineWidth = 2;
  speedCtx.strokeRect(10, 10, w - 20, h - 20);

  // Render Expanding Pointer Ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    const rip = ripples[i];
    speedCtx.beginPath();
    speedCtx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
    speedCtx.strokeStyle = `rgba(0, 113, 227, ${rip.alpha})`;
    speedCtx.lineWidth = 1.5;
    speedCtx.stroke();

    rip.r += 1.8;
    rip.alpha *= 0.94;
    if (rip.alpha < 0.01 || rip.r > rip.maxR) {
      ripples.splice(i, 1);
    }
  }

  // Soft Interactive Magnetic Field around Cursor
  if (isCursorOverCanvas && cursorCanvasX > 0 && cursorCanvasY > 0) {
    const grad = speedCtx.createRadialGradient(
      cursorCanvasX, cursorCanvasY, 0,
      cursorCanvasX, cursorCanvasY, 75
    );
    grad.addColorStop(0, 'rgba(0, 113, 227, 0.09)');
    grad.addColorStop(1, 'rgba(0, 113, 227, 0)');
    speedCtx.fillStyle = grad;
    speedCtx.beginPath();
    speedCtx.arc(cursorCanvasX, cursorCanvasY, 75, 0, Math.PI * 2);
    speedCtx.fill();
  }

  // Render Neutralization VFX Bursts
  for (let i = neutralizationBursts.length - 1; i >= 0; i--) {
    const burst = neutralizationBursts[i];
    speedCtx.beginPath();
    speedCtx.arc(burst.x, burst.y, burst.r, 0, Math.PI * 2);
    speedCtx.strokeStyle = `rgba(0, 163, 255, ${burst.alpha})`;
    speedCtx.lineWidth = 2;
    speedCtx.stroke();

    burst.r += 1.4;
    burst.alpha -= 0.045;
    if (burst.alpha <= 0) {
      neutralizationBursts.splice(i, 1);
    }
  }

  // Update & Render Red Odor Particles with Cursor Dispersal
  speedCtx.fillStyle = "#e11d48";
  for (let i = odorParticles.length - 1; i >= 0; i--) {
    let p = odorParticles[i];

    // Dynamic Cursor Repulsion Wave
    if (isCursorOverCanvas) {
      const dx = p.x - cursorCanvasX;
      const dy = p.y - cursorCanvasY;
      const dist = Math.hypot(dx, dy);
      const repelRadius = 80;

      if (dist < repelRadius && dist > 0.01) {
        const force = Math.pow((repelRadius - dist) / repelRadius, 1.4) * 4.2;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }
    }

    // Velocity Air Resistance Damping
    p.vx *= 0.94;
    p.vy *= 0.94;

    // Minimum Ambient Drift
    if (Math.hypot(p.vx, p.vy) < 0.3) {
      p.vx += (Math.random() - 0.5) * 0.25;
      p.vy += (Math.random() - 0.5) * 0.25;
    }

    p.x += p.vx * currentSpeedMultiplier;
    p.y += p.vy * currentSpeedMultiplier;

    // Chamber Wall Bounce
    if (p.x < 15) { p.x = 15; p.vx = Math.abs(p.vx); }
    if (p.x > w - 15) { p.x = w - 15; p.vx = -Math.abs(p.vx); }
    if (p.y < 15) { p.y = 15; p.vy = Math.abs(p.vy); }
    if (p.y > h - 15) { p.y = h - 15; p.vy = -Math.abs(p.vy); }

    speedCtx.beginPath();
    speedCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    speedCtx.fill();

    // Molecular Collision Neutralization
    if (simulationRunning) {
      for (let j = 0; j < o3Particles.length; j++) {
        let o = o3Particles[j];
        let dist = Math.hypot(p.x - o.x, p.y - o.y);
        if (dist < p.radius + o.radius + 5) {
          // Trigger neutralization burst
          neutralizationBursts.push({
            x: (p.x + o.x) / 2,
            y: (p.y + o.y) / 2,
            r: 4,
            alpha: 0.85
          });
          odorParticles.splice(i, 1);
          break;
        }
      }
    }
  }

  // Update & Render Cyan/Blue O3 Gas Particles
  if (simulationRunning) {
    speedCtx.fillStyle = "#00a3ff";
    o3Particles.forEach(o => {
      // Gentle attraction towards cursor when active
      if (isCursorOverCanvas) {
        const dx = cursorCanvasX - o.x;
        const dy = cursorCanvasY - o.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 90 && dist > 10) {
          o.vx += (dx / dist) * 0.15;
          o.vy += (dy / dist) * 0.15;
        }
      }

      o.x += o.vx * currentSpeedMultiplier;
      o.y += o.vy * currentSpeedMultiplier;

      if (o.x < 15) { o.x = 15; o.vx = Math.abs(o.vx); }
      if (o.x > w - 15) { o.x = w - 15; o.vx = -Math.abs(o.vx); }
      if (o.y < 15) { o.y = 15; o.vy = Math.abs(o.vy); }
      if (o.y > h - 15) { o.y = h - 15; o.vy = -Math.abs(o.vy); }

      speedCtx.beginPath();
      speedCtx.arc(o.x, o.y, o.radius, 0, Math.PI * 2);
      speedCtx.fill();
    });

    // Check for Complete Odor Elimination
    if (odorParticles.length === 0) {
      const status = document.getElementById('simStatusReadout');
      if (status) {
        status.textContent = "Status: 100% Elimination Achieved • Respawning test chamber in 2s...";
      }

      if (!respawnTimeout) {
        respawnTimeout = setTimeout(() => {
          resetParticleState();
          // Keep O3 active
          const sw = speedCanvas ? speedCanvas.width : 400;
          const sh = speedCanvas ? speedCanvas.height : 200;
          o3Particles = [];
          for (let i = 0; i < 28; i++) {
            o3Particles.push({
              x: Math.random() * (sw - 40) + 20,
              y: Math.random() * (sh - 40) + 20,
              vx: (Math.random() - 0.5) * 2.8,
              vy: (Math.random() - 0.5) * 2.8,
              radius: 3.5
            });
          }
          if (status) {
            status.textContent = "Status: O₃ Active (Neutralizing Organic Odor Particles)";
          }
          respawnTimeout = null;
        }, 2000);
      }
    }
  }

  requestAnimationFrame(renderO3Sim);
}

/* ==========================================
   7. MODALS, LIVE INTEREST COUNTER & PROTOTYPE SURVEY
   ========================================== */
const DEFAULT_INTEREST_COUNT = 0;
const COUNTER_VERSION_KEY = 'ozo_counter_v2_real_results';

function getStoredInterestCount() {
  // Purge legacy test counter (148/149) so real results are displayed
  if (localStorage.getItem('ozo_active_version') !== COUNTER_VERSION_KEY) {
    localStorage.removeItem('ozo_interest_count');
    localStorage.removeItem('ozo_survey_submitted');
    localStorage.removeItem('ozo_survey_data');
    localStorage.setItem('ozo_active_version', COUNTER_VERSION_KEY);
    localStorage.setItem('ozo_interest_count', '0');
    return 0;
  }

  const stored = localStorage.getItem('ozo_interest_count');
  if (stored !== null) {
    const val = parseInt(stored, 10);
    if (!isNaN(val) && val >= 0) return val;
  }
  return DEFAULT_INTEREST_COUNT;
}

function initInterestCounter() {
  const count = getStoredInterestCount();
  updateInterestCounterDisplays(count, false);
}

function updateInterestCounterDisplays(count, animate = false) {
  const countEl = document.getElementById('interestCounterVal');
  const messageEl = document.getElementById('interestMessageText');
  const successCountEl = document.getElementById('successCounterNum');
  const successMsgEl = document.getElementById('successCounterMessage');

  if (countEl) {
    countEl.textContent = count.toLocaleString();
    if (animate) {
      countEl.classList.remove('count-bumped');
      void countEl.offsetWidth;
      countEl.classList.add('count-bumped');
      setTimeout(() => countEl.classList.remove('count-bumped'), 700);
    }
  }

  if (messageEl) {
    if (count === 0) {
      messageEl.innerHTML = '<strong class="interest-number" id="interestCounterVal">0</strong> orders placed &bull; Be the first to order!';
    } else if (count === 1) {
      messageEl.innerHTML = '<strong class="interest-number" id="interestCounterVal">1</strong> order placed &bull; Reserve your spot';
    } else {
      messageEl.innerHTML = `<strong class="interest-number" id="interestCounterVal">${count.toLocaleString()}</strong> people ordered &amp; interested`;
    }
  }

  if (successCountEl) {
    successCountEl.textContent = count.toLocaleString();
  }

  if (successMsgEl) {
    if (count === 1) {
      successMsgEl.innerHTML = 'You placed order <strong>#1</strong>! Thank you for supporting OZO!';
    } else {
      successMsgEl.innerHTML = `You helped increase community orders to <strong id="successCounterNum">${count.toLocaleString()}</strong> supporters!`;
    }
  }
}

function openPrototypeModal() {
  const modal = document.getElementById('prototypeSurveyModal') || document.getElementById('comingSoonModal');
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  const alreadySubmitted = localStorage.getItem('ozo_survey_submitted') === 'true';
  const formView = document.getElementById('surveyFormView');
  const successView = document.getElementById('surveySuccessView');

  if (alreadySubmitted && formView && successView) {
    const savedData = JSON.parse(localStorage.getItem('ozo_survey_data') || '{}');
    const emailEl = document.getElementById('successEmailDisplay');
    if (emailEl) {
      emailEl.textContent = savedData.email || 'None provided (Optional)';
    }
    const priceEl = document.getElementById('successPriceDisplay');
    if (priceEl && savedData.pricePoint) {
      priceEl.textContent = savedData.pricePoint;
    }
    const currentCount = getStoredInterestCount();
    const countEl = document.getElementById('successCounterNum');
    if (countEl) countEl.textContent = currentCount.toLocaleString();

    formView.style.display = 'none';
    successView.style.display = 'block';
  } else if (formView && successView) {
    formView.style.display = 'block';
    successView.style.display = 'none';
  }
}

function closePrototypeModal() {
  const modal = document.getElementById('prototypeSurveyModal') || document.getElementById('comingSoonModal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// Aliases for backwards compatibility
const openComingSoonModal = openPrototypeModal;
const closeComingSoonModal = closePrototypeModal;

function toggleOtherGearInput(checkbox) {
  const wrap = document.getElementById('otherGearInputWrap');
  const textInput = document.getElementById('otherGearText');
  if (!wrap) return;
  if (checkbox.checked) {
    wrap.style.display = 'block';
    textInput?.focus();
  } else {
    wrap.style.display = 'none';
    if (textInput) textInput.value = '';
  }
}

function initSurveyOptions() {
  // Sync selected visual state on radio/checkbox cards
  document.querySelectorAll('.survey-option-card input, .survey-chip-card input').forEach(input => {
    input.addEventListener('change', () => {
      if (input.type === 'radio') {
        const name = input.name;
        document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
          r.closest('.survey-option-card')?.classList.remove('is-selected');
        });
        input.closest('.survey-option-card')?.classList.add('is-selected');
      } else if (input.type === 'checkbox') {
        input.closest('.survey-chip-card')?.classList.toggle('is-selected', input.checked);
      }
    });
  });

  // Modal backdrop click and Escape key listeners
  const modal = document.getElementById('prototypeSurveyModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closePrototypeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closePrototypeModal();
    }
  });
}

function handleSurveySubmit(e) {
  e.preventDefault();

  const form = document.getElementById('prototypeSurveyForm');
  if (!form) return;

  const emailInput = document.getElementById('surveyEmailInput');
  const email = emailInput ? emailInput.value.trim() : '';

  // Email is optional, but if entered, perform basic format validation
  if (email && !email.includes('@')) {
    emailInput?.focus();
    return;
  }

  const buyIntent = form.querySelector('input[name="buy_intent"]:checked')?.value || 'Yes, absolutely!';
  const gearNodes = form.querySelectorAll('input[name="gear_use"]:checked');
  const gears = Array.from(gearNodes).map(cb => {
    if (cb.value === 'Other') {
      const otherVal = document.getElementById('otherGearText')?.value.trim();
      return otherVal ? `Other: ${otherVal}` : 'Other';
    }
    return cb.value;
  });
  const pricePoint = form.querySelector('input[name="price_point"]:checked')?.value || '$50–$60';

  // Increment interest counter for real results
  let currentCount = getStoredInterestCount();
  const alreadySubmitted = localStorage.getItem('ozo_survey_submitted') === 'true';

  if (!alreadySubmitted) {
    currentCount += 1;
    localStorage.setItem('ozo_interest_count', currentCount.toString());
    localStorage.setItem('ozo_survey_submitted', 'true');
  }

  // Store user response
  const surveyData = {
    email: email || 'None provided (Optional)',
    buyIntent,
    gears,
    pricePoint,
    submittedAt: new Date().toISOString()
  };
  localStorage.setItem('ozo_survey_data', JSON.stringify(surveyData));

  // Maintain orders log in localStorage
  try {
    const orders = JSON.parse(localStorage.getItem('ozo_orders_records') || '[]');
    orders.push(surveyData);
    localStorage.setItem('ozo_orders_records', JSON.stringify(orders));
  } catch (err) {
    console.warn("Could not save to orders records:", err);
  }

  // Live update counter with bounce animation
  updateInterestCounterDisplays(currentCount, true);

  // Update success view displays
  const successEmailDisplay = document.getElementById('successEmailDisplay');
  if (successEmailDisplay) {
    successEmailDisplay.textContent = email || 'None provided (Optional)';
  }

  const successPriceDisplay = document.getElementById('successPriceDisplay');
  if (successPriceDisplay) {
    successPriceDisplay.textContent = pricePoint;
  }

  const successCounterNum = document.getElementById('successCounterNum');
  if (successCounterNum) successCounterNum.textContent = currentCount.toLocaleString();

  // Switch to animated confirmation view
  const formView = document.getElementById('surveyFormView');
  const successView = document.getElementById('surveySuccessView');
  if (formView && successView) {
    formView.style.display = 'none';
    successView.style.display = 'block';
  }
}

function toggleFaq(btnElement) {
  const item = btnElement.parentElement;
  if (!item) return;
  item.classList.toggle('active');
}
