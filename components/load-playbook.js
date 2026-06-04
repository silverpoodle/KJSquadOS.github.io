/**
 * Playbook Section Importer
 * Loads playbook.html and injects it into #playbook-placeholder.
 * Falls back to inline content when running via file:// protocol (CORS restriction).
 */
(function loadPlaybook() {
  var placeholder = document.getElementById('playbook-placeholder');
  if (!placeholder) return;

  var isFileProtocol = window.location.protocol === 'file:';

  if (isFileProtocol) {
    // ── file:// fallback: inject known playbook markup directly ──
    var html = [
      '<!-- ── PLAYBOOK SECTION ── -->',
      '<section id="playbook">',
      '  <div class="container">',
      '    <div class="section-head text-center">',
      '      <div class="section-label">Playbook Library</div>',
      '      <h2 class="section-title">바로 실행하는 캠페인 플레이북</h2>',
      '      <p class="section-sub">채널별·목적별로 큐레이션된 30개 플레이북. 폴더를 선택해 즉시 실행하세요.</p>',
      '    </div>',
      '    <div class="pb-filter-row" id="pbFilters"></div>',
      '    <div class="pb-grid" id="pbGrid"></div>',
      '  </div>',
      '</section>'
    ].join('\n');

    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    var section = wrapper.querySelector('section#playbook');
    if (section) placeholder.replaceWith(section);

    // inject playbook CSS
    var css = document.createElement('style');
    css.textContent = [
      '#playbook { background: var(--primary); padding: 0 0 6rem; position: relative; }',
      '#playbook::before { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 40% at 50% 0%, rgba(232,68,26,0.06) 0%, transparent 70%), linear-gradient(170deg, rgba(37,211,102,0.04) 0%, rgba(59,130,246,0.03) 20%, rgba(99,102,241,0.04) 40%, rgba(232,68,26,0.03) 55%, rgba(16,185,129,0.04) 75%, rgba(245,158,11,0.03) 100%), var(--primary); pointer-events: none; z-index: 1; }',
      '#playbook::after { content: ""; position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 60%; max-width: 500px; height: 1px; background: linear-gradient(to right, transparent 0%, rgba(37,211,102,0.12) 15%, rgba(99,102,241,0.18) 40%, rgba(232,68,26,0.25) 50%, rgba(99,102,241,0.18) 60%, rgba(37,211,102,0.12) 85%, transparent 100%); pointer-events: none; z-index: 3; }',
      '#playbook .container { position: relative; z-index: 2; padding-top: 5rem; }',
      '#playbook .section-label { color: rgba(232,68,26,0.9); }',
      '#playbook .section-title { color: #fff; }',
      '#playbook .section-sub { color: rgba(255,255,255,0.5); }',
      '#playbook .section-head { position: relative; margin-bottom: 2.5rem; }',
      '#playbook .section-head::after { content: ""; position: absolute; bottom: -1rem; left: 50%; transform: translateX(-50%); width: 48px; height: 2px; border-radius: 2px; background: linear-gradient(to right, rgba(37,211,102,0.5), rgba(99,102,241,0.5), rgba(232,68,26,0.6), rgba(99,102,241,0.5), rgba(37,211,102,0.5)); background-size: 200% 100%; animation: shimmer 4s ease-in-out infinite; }',
      '@keyframes shimmer { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }',
      '.pb-filter-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2.5rem; justify-content: center; }',
      '.pb-filter { padding: 0.35rem 1rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; letter-spacing: 0.03em; border: 1px solid rgba(255,255,255,0.15); color: rgba(255,255,255,0.55); background: transparent; cursor: pointer; transition: all 0.2s; font-family: "DM Sans", sans-serif; }',
      '.pb-filter:hover { border-color: rgba(255,255,255,0.4); color: rgba(255,255,255,0.85); }',
      '.pb-filter.active { background: var(--accent); border-color: var(--accent); color: #fff; }',
      '.pb-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.1rem; }',
      '.pb-folder { position: relative; border-radius: 16px; padding: 1.6rem 1.4rem 1.25rem; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.04); cursor: pointer; transition: all 0.25s; display: flex; flex-direction: column; gap: 0.6rem; opacity: 0; animation: fadeUp 0.4s ease forwards; }',
      '.pb-folder:hover { background: rgba(255,255,255,0.09); border-color: rgba(255,255,255,0.2); transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.35); }',
      '.pb-folder.hidden { display: none; }',
      '.pb-folder-tab { position: absolute; top: -1px; left: 12px; width: 32px; height: 5px; border-radius: 3px 3px 0 0; }',
      '.pb-ch-pill { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; padding: 0.25rem 0.65rem; border-radius: 5px; width: fit-content; font-family: "JetBrains Mono", monospace; margin-top: 0.25rem; }',
      '.pb-folder-name { font-family: "Syne", sans-serif; font-weight: 700; font-size: 1rem; color: #fff; line-height: 1.35; }',
      '.pb-keyword { font-size: 0.82rem; color: rgba(255,255,255,0.4); font-family: "DM Sans", sans-serif; line-height: 1.5; }',
      '.pb-folder-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 0.65rem; border-top: 1px solid rgba(255,255,255,0.06); }',
      '.pb-client { display: flex; align-items: center; gap: 0.35rem; }',
      '.pb-client-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ch); flex-shrink: 0; box-shadow: 0 0 8px var(--ch), 0 0 16px color-mix(in srgb, var(--ch) 50%, transparent); }',
      '.pb-client-name { font-size: 0.95rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; font-family: "Syne", sans-serif; text-shadow: 0 0 20px rgba(255,255,255,0.15); }',
      '.pb-arrow { width: 22px; height: 22px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; transition: background 0.2s; }',
      '.pb-folder:hover .pb-arrow { background: var(--accent); }',
      '.pb-arrow svg { width: 12px; height: 12px; stroke: rgba(255,255,255,0.6); fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }',
      '.pb-folder:hover .pb-arrow svg { stroke: #fff; }',
      '.ch-wa   { --ch: #25D366; }',
      '.ch-sms  { --ch: #3b82f6; }',
      '.ch-rcs  { --ch: #6366f1; }',
      '.ch-ig   { --ch: #e1306c; }',
      '.ch-fb   { --ch: #1877f2; }',
      '.ch-voice{ --ch: #10b981; }',
      '.ch-email{ --ch: #f59e0b; }',
      '.ch-kk   { --ch: #FAE100; }',
      '.ch-vib  { --ch: #7360f2; }',
      '.ch-push { --ch: #ef4444; }',
      '.pb-folder-tab  { background: var(--ch); }',
      '.pb-ch-pill     { background: color-mix(in srgb, var(--ch) 18%, transparent); color: var(--ch); border: 1px solid color-mix(in srgb, var(--ch) 30%, transparent); }',
      '@media (max-width: 1100px) { .pb-grid { grid-template-columns: repeat(3, 1fr); } }',
      '@media (max-width: 760px)  { .pb-grid { grid-template-columns: repeat(2, 1fr); } }',
      '@media (max-width: 480px)  { .pb-grid { grid-template-columns: repeat(1, 1fr); } }'
    ].join(' ');
    document.head.appendChild(css);

    // run playbook JS
    initPlaybook();
    return;
  }

  // ── HTTP(S) protocol: use fetch ──
  fetch('components/playbook.html')
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    })
    .then(function(html) {
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;

      var section = wrapper.querySelector('section#playbook');
      if (section) placeholder.replaceWith(section);

      var style = wrapper.querySelector('style');
      if (style) document.head.appendChild(style.cloneNode(true));

      initPlaybook();
    })
    .catch(function(err) {
      console.error('Failed to load playbook section:', err);
      placeholder.innerHTML = '<p style="color:#e8441a;text-align:center;padding:3rem;">⚠️ Playbook을 불러오지 못했습니다.</p>';
    });
})();

/* ── Shared playbook initializer ── */
function initPlaybook() {
  var PLAYBOOKS = [
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"Chatbot Promotion",  desc:"챗봇 솔루션을 활용한 마케팅 캠페인",       client:"Nissan KSA",   link:"https://kjsquados.github.io/whatsapp-chatbot-nissan/" },
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"CTWA",           desc:"Click-to-WhatsApp 광고 전환",   client:"Lotte ON"       },
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"Re-engagement",  desc:"휴면 고객 재활성화 시퀀스",       client:"Hyundai Card"   },
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"Cart Abandon",   desc:"장바구니 이탈 복구 플로우",       client:"Coupang"        },
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"Onboarding",     desc:"신규 가입자 온보딩 여정",         client:"Kakao Pay"      },
    { ch:"WhatsApp", cls:"ch-wa",   keyword:"Flash Sale",     desc:"타임딜 긴급 프로모션 발송",       client:"SSG.COM"        },
    { ch:"SMS",      cls:"ch-sms",  keyword:"CrossSell",      desc:"구매 이력 기반 교차 판매",        client:"KB국민카드"      },
    { ch:"SMS",      cls:"ch-sms",  keyword:"OTP / Auth",     desc:"인증번호 & 보안 알림",            client:"신한은행"        },
    { ch:"SMS",      cls:"ch-sms",  keyword:"Appointment",    desc:"예약 리마인더 자동화",            client:"365mc 병원"     },
    { ch:"SMS",      cls:"ch-sms",  keyword:"Loyalty",        desc:"포인트·멤버십 리워드 알림",       client:"CJ ONE"         },
    { ch:"SMS",      cls:"ch-sms",  keyword:"Win-Back",       desc:"이탈 고객 재구매 유도",           client:"GS리테일"        },
    { ch:"RCS",      cls:"ch-rcs",  keyword:"Rich Promo",     desc:"버튼·이미지 풍부한 프로모션",     client:"삼성전자"        },
    { ch:"RCS",      cls:"ch-rcs",  keyword:"Product Launch", desc:"신제품 런칭 인터랙티브 캠페인",   client:"LG전자"         },
    { ch:"RCS",      cls:"ch-rcs",  keyword:"Survey",         desc:"인앱형 설문·피드백 수집",         client:"우리은행"        },
    { ch:"Instagram",cls:"ch-ig",   keyword:"DM Funnel",      desc:"스토리 반응 → DM 자동 전환",     client:"올리브영"        },
    { ch:"Instagram",cls:"ch-ig",   keyword:"Influencer",     desc:"인플루언서 협업 리드 수집",       client:"무신사"          },
    { ch:"Instagram",cls:"ch-ig",   keyword:"UGC Reward",     desc:"유저 콘텐츠 공유 리워드",         client:"에이블씨엔씨"     },
    { ch:"Messenger",cls:"ch-fb",   keyword:"Lead Gen",       desc:"Messenger 광고 리드 수집",       client:"현대자동차"       },
    { ch:"Messenger",cls:"ch-fb",   keyword:"Post-Purchase",  desc:"구매 후 CS & 리뷰 수집",         client:"이마트"          },
    { ch:"Messenger",cls:"ch-fb",   keyword:"Quiz Bot",       desc:"퀴즈형 제품 추천 챗봇",          client:"LG생활건강"      },
    { ch:"Voice",    cls:"ch-voice",keyword:"IVR Upsell",     desc:"통화 중 업셀 자동 안내",          client:"SK텔레콤"        },
    { ch:"Voice",    cls:"ch-voice",keyword:"Missed Call",    desc:"부재중 콜백 자동화",              client:"롯데렌탈"         },
    { ch:"Voice",    cls:"ch-voice",keyword:"NPS Survey",     desc:"통화 후 NPS 음성 설문",           client:"KT"             },
    { ch:"Email",    cls:"ch-email",keyword:"Drip Nurture",   desc:"리드 육성 자동 드립 시퀀스",      client:"토스"            },
    { ch:"Email",    cls:"ch-email",keyword:"Reactivation",   desc:"비활성 구독자 재참여 캠페인",     client:"야놀자"           },
    { ch:"Email",    cls:"ch-email",keyword:"Anniversary",    desc:"가입 기념일 개인화 발송",         client:"배달의민족"       },
    { ch:"Kakao",    cls:"ch-kk",   keyword:"알림톡 CS",      desc:"주문·배송 상태 자동 알림",        client:"마켓컬리"         },
    { ch:"Kakao",    cls:"ch-kk",   keyword:"친구톡 Promo",   desc:"카카오 채널 프로모션 발송",        client:"CU편의점"        },
    { ch:"Viber",    cls:"ch-vib",  keyword:"Broadcast",      desc:"동남아 타겟 대량 프로모션",        client:"하나투어"         },
    { ch:"Viber",    cls:"ch-vib",  keyword:"Chatbot CX",     desc:"Viber 채널 CS 자동화",           client:"모두투어"         },
    { ch:"Push",     cls:"ch-push", keyword:"Geo-Trigger",    desc:"위치 기반 실시간 푸시",            client:"스타벅스 코리아"  },
  ];

  var ALL_CHANNELS = ['전체'].concat(
    PLAYBOOKS.map(function(p) { return p.ch; })
      .filter(function(v, i, a) { return a.indexOf(v) === i; })
  );

  // render filters
  var pfRow = document.getElementById('pbFilters');
  if (!pfRow) return;
  ALL_CHANNELS.forEach(function(ch, i) {
    var btn = document.createElement('button');
    btn.className = 'pb-filter' + (i === 0 ? ' active' : '');
    btn.textContent = ch;
    btn.dataset.ch = ch;
    btn.addEventListener('click', function() {
      document.querySelectorAll('.pb-filter').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filterPlaybooks(ch);
    });
    pfRow.appendChild(btn);
  });

  // render folders
  var pbGrid = document.getElementById('pbGrid');
  if (!pbGrid) return;
  PLAYBOOKS.forEach(function(pb, i) {
    var el = document.createElement('div');
    el.className = 'pb-folder ' + pb.cls;
    el.dataset.ch = pb.ch;
    el.style.animationDelay = (i * 0.04) + 's';
    el.innerHTML =
      '<div class="pb-folder-tab"></div>' +
      '<div class="pb-ch-pill">' + pb.ch + '</div>' +
      '<div class="pb-folder-name">' + pb.keyword + '</div>' +
      '<div class="pb-keyword">' + pb.desc + '</div>' +
      '<div class="pb-folder-footer">' +
        '<div class="pb-client">' +
          '<span class="pb-client-dot"></span>' +
          '<span class="pb-client-name">' + pb.client + '</span>' +
        '</div>' +
        '<div class="pb-arrow"><svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>' +
      '</div>';
    if (pb.link) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function() { window.open(pb.link, '_blank'); });
    }
    pbGrid.appendChild(el);
  });

  function filterPlaybooks(ch) {
    document.querySelectorAll('.pb-folder').forEach(function(el) {
      if (ch === '전체' || el.dataset.ch === ch) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  // observe playbook folders for scroll animation
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.style.opacity = '';
        e.target.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.pb-folder').forEach(function(el) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}
