function scrollToSection() {
    const content = document.getElementById("main-content");
    content.scrollIntoView({ behavior: "smooth" });
  }

  
// 스토리텔링 스크롤 애니메이션 (리버스 지원)
const storySections = document.querySelectorAll('.story-section');
let lastScrollY = window.scrollY;
let scrollDirection = 'down';

const storyOptions = {
  threshold: [0, 0.15, 0.5, 0.85, 1.0],
  rootMargin: '0px 0px -150px 0px'
};

const storyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const rect = entry.boundingClientRect;
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    const isFullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
    
    if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
      // 뷰포트에 진입할 때 - 항상 visible
      entry.target.classList.add('visible');
      entry.target.classList.remove('hidden');
    } else if (!entry.isIntersecting) {
      // 뷰포트에서 완전히 나갔을 때
      if (scrollDirection === 'down' && rect.top < -100) {
        // 아래로 스크롤해서 위로 완전히 지나간 경우
        entry.target.classList.remove('visible');
        entry.target.classList.add('hidden');
      } else if (scrollDirection === 'up' && rect.bottom > window.innerHeight + 100) {
        // 위로 스크롤해서 아래로 완전히 지나간 경우
        entry.target.classList.remove('visible');
        entry.target.classList.add('hidden');
      }
    }
  });
}, storyOptions);

storySections.forEach(section => storyObserver.observe(section));

// 스크롤 방향 추적
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

// 기존 fade-in 애니메이션 (다른 섹션용)
const fadeEls = document.querySelectorAll('.fade-in');
const options = {
  threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, options);

fadeEls.forEach(el => observer.observe(el));



  let currentIndex = 0;
  const slides = document.querySelectorAll('.hero-slide');
  const total = slides.length;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + total) % total;
    showSlide(currentIndex);
  }

  // 초기화
  showSlide(currentIndex);

  // 자동 슬라이드 (4초 간격)
  setInterval(nextSlide, 4000);

  // 버튼 이벤트 연결
  document.querySelector('.hero-next').addEventListener('click', nextSlide);
  document.querySelector('.hero-prev').addEventListener('click', prevSlide);

