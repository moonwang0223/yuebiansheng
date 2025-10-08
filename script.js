// 初始化 Mermaid.js 并配置深色主题
mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      background: 'transparent',
      primaryColor: '#1f2937',
      primaryTextColor: '#e2e8f0',
      primaryBorderColor: '#4a5568',
      lineColor: '#718096',
      textColor: '#e2e8f0',
      fontSize: '14px',
      clusterBkg: 'transparent',
      clusterBorder: 'transparent',
    }
  });
  
// 脚本在HTML文档加载和解析完成后立即执行
document.addEventListener('DOMContentLoaded', () => {

    // 概念模态框逻辑
    const mainConceptTitle = document.getElementById('main-concept-title');
    const conceptModal = document.getElementById('concept-modal');
    const closeConceptModalBtn = document.getElementById('close-concept-modal');

    if (mainConceptTitle && conceptModal && closeConceptModalBtn) {
        mainConceptTitle.addEventListener('click', () => {
            conceptModal.classList.add('visible');
            conceptModal.classList.remove('hidden'); 
        });

        const closeModal = () => {
            conceptModal.classList.remove('visible');
            setTimeout(() => {
                conceptModal.classList.add('hidden'); 
            }, 300); // 与CSS的transition时间匹配
        };

        closeConceptModalBtn.addEventListener('click', closeModal);

        // 点击模态框背景关闭
        conceptModal.addEventListener('click', (e) => {
            if (e.target === conceptModal) {
                closeModal();
            }
        });
    }
    
    // ==================================================== //
    //            游戏化引导页/多页面导航逻辑               //
    // ==================================================== //
    const startPage = document.getElementById('start-page');
    const profilePage = document.getElementById('profile-page');
    const levelSelectPage = document.getElementById('level-select-page');
    const mainContent = document.getElementById('main-content');
    
    const startBtn = document.getElementById('start-btn');
    const profileNextBtn = document.getElementById('profile-next-btn');
    const levelLinks = document.querySelectorAll('.level-card');
    const backBtn = document.getElementById('back-to-levels-btn');

    function showMainContent() {
        if(startPage) startPage.classList.add('hidden');
        if(profilePage) profilePage.classList.add('hidden');
        if(levelSelectPage) levelSelectPage.classList.add('hidden');
        
        if(mainContent) {
            mainContent.style.opacity = '1';
            mainContent.style.pointerEvents = 'auto';
        }
        
        if(backBtn) backBtn.classList.add('visible');
    }

    function showLevelSelect() {
        if(mainContent) {
            mainContent.style.opacity = '0';
            mainContent.style.pointerEvents = 'none';
        }
        if(backBtn) backBtn.classList.remove('visible');
        if(levelSelectPage) levelSelectPage.classList.remove('hidden');

        window.scrollTo(0, 0);
    }
    
    if(startBtn) {
        startBtn.addEventListener('click', () => {
            if(startPage) startPage.classList.add('hidden');
            if(profilePage) profilePage.classList.remove('hidden');
        });
    }

    if(profileNextBtn) {
        profileNextBtn.addEventListener('click', () => {
            if(profilePage) profilePage.classList.add('hidden');
            if(levelSelectPage) levelSelectPage.classList.remove('hidden');
        });
    }
    
    levelLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                mainContent.style.transition = 'none';
                mainContent.style.opacity = '1';
                targetElement.scrollIntoView({ behavior: 'auto' });
                showMainContent();
                setTimeout(() => {
                    mainContent.style.transition = 'opacity 1s ease-out';
                }, 50);
            } else {
                showMainContent();
            }
        });
    });

    if(backBtn) {
        backBtn.addEventListener('click', () => {
            showLevelSelect();
        });
    }

    // ==================================================== //
    //            您原有的脚本逻辑 (已整合)                 //
    // ==================================================== //

    // 背景粒子效果
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let particlesArray;
        const particleCount = 100;
        const maxDistance = 100;

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.6 - 0.3;
                this.speedY = Math.random() * 0.6 - 0.3;
                this.color = 'rgba(100, 100, 100, 0.5)';
            }
            update() {
                if (this.x > canvas.width || this.x < 0) { this.speedX = -this.speedX; }
                if (this.y > canvas.height || this.y < 0) { this.speedY = -this.speedY; }
                this.x += this.speedX;
                this.y += this.speedY;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < particleCount; i++) {
                particlesArray.push(new Particle());
            }
        }

        function connectParticles() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                 ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (maxDistance * maxDistance)) {
                        ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / (maxDistance * maxDistance)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            connectParticles();
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        initParticles();
        animateParticles();
    }

    // 滚动显示动画
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // 数字滚动动画
    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter-value');
                counters.forEach(counter => {
                    if (counter.hasAttribute('data-animated')) return;
                    counter.setAttribute('data-animated', 'true');
                    
                    const target = +counter.getAttribute('data-target');
                    const isDecimal = counter.getAttribute('data-decimal') === 'true';
                    let current = 0;
                    const duration = 1500;
                    const stepTime = 20;
                    const steps = duration / stepTime;
                    const increment = target / steps;

                    const updateCount = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = isDecimal ? current.toFixed(isDecimal && target.toString().includes('.') ? target.toString().split('.')[1].length : 1) : Math.ceil(current).toLocaleString();
                            setTimeout(updateCount, stepTime);
                        } else {
                            counter.innerText = isDecimal ? target.toFixed(isDecimal && target.toString().includes('.') ? target.toString().split('.')[1].length : 1) : target.toLocaleString();
                        }
                    };
                    updateCount();
                });
            }
        });
    };
    
    const counterObserver = new IntersectionObserver(animateCounters, { threshold: 0.5 });
    document.querySelectorAll('.reveal .grid').forEach(section => {
        counterObserver.observe(section);
    });
    
    // 标签体系数据
    const DEMAND_DESCRIPTIONS = { "生成ppt": "用户希望生成演示文稿（PPT）的框架、单页或完整内容。", "提问解答": "用户提出以获取客观信息、知识或可操作方案为目的的具体问题。", "写作": "用户希望从无到有地创作各类文本内容。", "生图生视频": "用户希望根据文本描述生成图片、视频、图表或进行视觉设计。", "语言翻译": "用户需要进行语言之间的翻译。", "做题解题": "用户提供具体的学科题目，希望得到解答步骤、答案或思路分析。", "聊天陪伴": "用户的核心目的在于进行开放式对话、情感交流、娱乐或消遣。", "总结内容": "用户提供一段文本、文章或对话，希望提炼其核心要点。", "文字游戏": "用户与AI进行有规则或角色的互动扮演游戏。", "代码任务": "用户希望AI完成代码编写、调试、优化等任务。", "其他": "不完整的文本内容或无意义文本内容。"};
    const SUB_DOMAIN_DEFINITIONS = { "教育与学习": ["大学及以上学生做题", "论文综述", "教师模拟出题", "教学备课", "作业批改", "学习规划", "高薪人才职业考试", "考公考编", "入职培训", "考研", "生活技术证书考试", "高中及以下学生做题", "语言学习", "口语陪练", "作文写作"], "工作与职业": ["工作任务与汇报", "数据处理与分析", "求职与招聘", "技能学习", "职场科普", "职场沟通"], "商业与金融": ["市场营销", "企业管理", "财务会计", "投资理财"], "IT编程": ["代码debug", "代码生成", "代码解释", "编程学习"], "软件使用技巧": ["办公软件", "电脑操作", "手机操作", "游戏软件", "其他软件使用"], "硬件与工程": ["电子电气工程", "机械与制造工程", "土木与建筑工程", "其他技术工程"], "健康与医疗": ["医疗问诊与科普", "专业医学辅助", "营养与饮食", "运动健身", "减肥", "心理疏导"], "法律": ["法律查询", "法律文书草拟", "法律审查"], "政治与公共事务": ["国内政治与政策", "国际政治与政策"], "人文与社科": ["历史", "文学", "哲学", "社会科学"], "创作与表达": ["专业文案写作", "娱乐文案写作", "游戏动漫", "影视", "小说写作"], "日常生活与常识": ["居家生活", "餐饮烹饪", "旅行出行", "家庭事务", "恋爱教练", "闲聊"], "休闲娱乐与兴趣": ["影视", "阅读", "游戏动漫", "音乐与播客", "体育运动", "玄学占卜", "其他兴趣爱好"], "其他": ["无法区分内容"], "文字游戏": ["文字游戏"], "语言翻译": ["语言翻译"], "社会保障": ["医疗保险", "养老保险", "失业保险", "工伤保险", "生育保险", "住房公积金", "社会福利政策", "其他社会保障内容"]};
    const demandCardsContainer = document.getElementById('demand-cards');
    const domainListContainer = document.getElementById('domain-list');
    const subdomainListContainer = document.getElementById('subdomain-list');

    if (demandCardsContainer && domainListContainer && subdomainListContainer) {
        const allDemands = {...DEMAND_DESCRIPTIONS, "深度研究": "用户使用了深度研究的产品功能。"};
        for (const [demand, description] of Object.entries(allDemands)) {
            const card = document.createElement('div');
            card.className = 'demand-card glassmorphism rounded-lg p-4 flex items-center justify-center text-center h-24';
            card.innerHTML = `<h5 class="font-semibold text-white">${demand}</h5><div class="description text-slate-300">${description}</div>`;
            demandCardsContainer.appendChild(card);
        }
        for (const domain of Object.keys(SUB_DOMAIN_DEFINITIONS)) {
            const item = document.createElement('div');
            item.className = 'domain-item text-slate-300';
            item.textContent = `${domain} (${SUB_DOMAIN_DEFINITIONS[domain].length})`;
            item.dataset.domain = domain;
            domainListContainer.appendChild(item);
        }
        domainListContainer.addEventListener('click', (e) => {
            const target = e.target.closest('.domain-item');
            if (!target) return;
            domainListContainer.querySelectorAll('.domain-item').forEach(el => el.classList.remove('active'));
            target.classList.add('active');
            const domainKey = target.dataset.domain;
            const subdomains = SUB_DOMAIN_DEFINITIONS[domainKey];
            subdomainListContainer.innerHTML = '';
            const innerContainer = document.createElement('div');
            innerContainer.className = 'subdomain-list-inner';
            subdomains.forEach(sub => {
                const span = document.createElement('span');
                span.textContent = sub;
                innerContainer.appendChild(span);
            });
            subdomainListContainer.appendChild(innerContainer);
        });
        if (domainListContainer.firstChild) {
            domainListContainer.firstChild.click();
        }
    }

    // 时间轴动画
    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
        const timelineProgress = timelineContainer.querySelector('.timeline-progress');
        window.addEventListener('scroll', () => {
            const rect = timelineContainer.getBoundingClientRect();
            const start = rect.top + window.scrollY;
            const end = rect.bottom + window.scrollY;
            const height = rect.height;
            const scrollY = window.scrollY;
            let progress = 0;
            if (scrollY > start && scrollY < end) {
                progress = ((scrollY - start) / height) * 100;
            } else if (scrollY >= end) {
                progress = 100;
            }
            timelineProgress.style.height = `${progress}%`;
        });
    }

});

// 在页面所有资源加载完成后执行 (例如翻转卡片逻辑，可能依赖图片加载)
window.addEventListener('load', () => {
    
    // ==================================================== //
    //            新增：修复翻转卡片和折叠功能                //
    // ==================================================== //

    // 打字机与卡片交互逻辑
    function typeWriterForElement(element, text, callback, i = 0, speed = 15) {
        if (element.closest('.flip-card-container.is-active') && i < text.length) {
            element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
            setTimeout(() => typeWriterForElement(element, text, callback, i + 1, speed), speed);
        } else if (!element.closest('.flip-card-container.is-active')) {
            return;
        } else {
            element.innerHTML = text;
            if (callback) {
                callback();
            }
        }
    }

    function typeParagraphsSequentially(paragraphs, originalTexts, index = 0) {
        if (index >= paragraphs.length || !paragraphs[index].closest('.flip-card-container.is-active')) {
            return;
        }
        const p = paragraphs[index];
        const text = originalTexts[index];
        typeWriterForElement(p, text, () => {
            typeParagraphsSequentially(paragraphs, originalTexts, index + 1);
        });
    }

    const flipCards = document.querySelectorAll('.flip-card-container');
    const overlay = document.getElementById('modal-overlay');

    flipCards.forEach(cardContainer => {
        const cardBack = cardContainer.querySelector('.flip-card-back');
        const paragraphs = cardBack.querySelectorAll('.card-content-wrapper p');
        const originalTexts = Array.from(paragraphs).map(p => p.innerHTML);
        const closeButton = cardContainer.querySelector('.close-button');

        const openCard = () => {
            if (document.querySelector('.flip-card-container.is-active')) return;

            overlay.classList.add('visible');
            cardContainer.classList.add('is-active');
            
            paragraphs.forEach(p => p.innerHTML = '');
            
            setTimeout(() => {
                if (!cardContainer.classList.contains('is-active')) return;
                typeParagraphsSequentially(paragraphs, originalTexts);
            }, 500);
        };

        const closeCard = () => {
            if (!cardContainer.classList.contains('is-active')) return;

            overlay.classList.remove('visible');
            cardContainer.classList.remove('is-active');
            
            setTimeout(() => {
                 paragraphs.forEach((p, index) => {
                    p.innerHTML = originalTexts[index];
                });
            }, 800);
        };
        
        cardContainer.querySelector('.flip-card-front').addEventListener('click', openCard);
        if (overlay) overlay.addEventListener('click', closeCard);
        
        if (closeButton) {
          closeButton.addEventListener('click', (event) => {
              event.stopPropagation();
              closeCard();
          });
        }
    });

    // 折叠流程图的逻辑
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    collapsibleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            header.classList.toggle('active');
            const content = header.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
});
