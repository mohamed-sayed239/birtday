// ============================================
// ديباج لتشخيص مشاكل الصوت
// ============================================
function checkAudioSupport() {
    console.log('🔍 فحص دعم الصوت في المتصفح...');
    
    // فحص واجهة Audio
    if (!window.Audio) {
        console.error('❌ المتصفح لا يدعم واجهة Audio API');
        return false;
    }
    
    // فحص Web Audio API
    if (!window.AudioContext && !window.webkitAudioContext) {
        console.warn('⚠️ Web Audio API غير متوفر، بعض التأثيرات قد لا تعمل');
    }
    
    console.log('✅ دعم الصوت: جيد');
    return true;
}

// ============================================
// الفئة الرئيسية للتجربة - المحدثة
// ============================================
class BirthdayExperience {
    constructor() {
        this.currentScene = 1;
        this.totalScenes = 6;
        this.isMuted = false;
        this.hasOpenedGift = false;
        this.isMusicPlaying = false;
        this.isCelebrationSoundPlaying = false;
        this.celebrationTimer = null;
        this.autoProgressTimer = null;
        this.readingProgressTimer = null;
        this.messageReadComplete = false;
        this.audioManager = new AudioManager();
        this.sceneTimers = {
            1: 5000,    // 5 ثواني
            2: 4000,    // 4 ثواني
            3: 0,       // انتظار تفاعل
            4: 12000,   // 12 ثواني
            5: 10000,   // 10 ثواني
            6: 0        // لا تقدم تلقائي
        };
        this.init();
    }

    async init() {
        this.showEnhancedLoading();
        this.createSceneElements();
        this.setupEventListeners();
        
        // تحميل الصوتيات
        await this.audioManager.loadSounds();
        
        // Start after loading
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startExperience();
        }, 2500);
    }

    showEnhancedLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'flex';
        
        const loadingMessages = [
            "بيجهزوا الهدايا 🎁",
            "بيلموا البالونات 🎈",
            "بيجهزوا المفاجآت ✨",
            "بيكتبوا الرسائل 💌",
            "بتشغّل الموسيقى 🎵",
            "بيجهزوا الألعاب النارية 🎆"
        ];
        
        let messageIndex = 0;
        const messageElement = document.getElementById('loadingMessage');
        const percentageElement = document.querySelector('.loading-percentage');
        
        // تغيير الرسائل
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            messageElement.textContent = loadingMessages[messageIndex];
        }, 1800);
        
        // محاكاة تحميل التقدم
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 8 + 7;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                clearInterval(messageInterval);
                messageElement.textContent = "جاهز للفرحة! 🎉";
            }
            document.getElementById('loadingProgress').style.width = `${progress}%`;
            percentageElement.textContent = `${Math.min(100, Math.round(progress))}%`;
        }, 150);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // إظهار مؤشر الصوت
            document.getElementById('audioIndicator').classList.add('show');
            this.updateAudioIndicator('🔇 اضغط في أي مكان لتشغيل الصوت');
        }, 500);
    }

    createSceneElements() {
        // إنشاء النجوم للنهاية
        this.createStars();
        
        // إنشاء قلوب طافية
        this.createFloatingHearts();
        
        // إنشاء أضواء خلفية إضافية
        this.createBackgroundEffects();
        
        // إنشاء بالونات للمشهد 4
        this.createBalloonsForCelebration();
        
        // إنشاء كونفيتي للمشهد 4
        this.createConfettiForCelebration();
        
        // إنشاء نجوم متحركة
        this.createMovingStars();
    }

    createStars() {
        const starsContainer = document.getElementById('endingStars');
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.animationDuration = `${Math.random() * 3 + 2}s`;
            starsContainer.appendChild(star);
        }
    }

    createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts') || document.body;
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = ['❤️', '💖', '💗', '💓', '💞'][i % 5];
                heart.style.position = 'absolute';
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.fontSize = `${Math.random() * 20 + 15}px`;
                heart.style.opacity = '0';
                heart.style.animation = `heartFloat ${Math.random() * 8 + 8}s linear infinite`;
                heart.style.animationDelay = `${i * 0.4}s`;
                heart.style.zIndex = '1';
                heartsContainer.appendChild(heart);
            }, i * 300);
        }
    }

    createBackgroundEffects() {
        // أضواء خلفية للرسالة
        const messageCard = document.querySelector('.message-card');
        if (messageCard) {
            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    const light = document.createElement('div');
                    light.className = 'background-light';
                    light.style.position = 'absolute';
                    light.style.width = `${Math.random() * 150 + 50}px`;
                    light.style.height = light.style.width;
                    light.style.background = `radial-gradient(circle, 
                        rgba(${Math.floor(Math.random() * 100 + 155)}, 
                        ${Math.floor(Math.random() * 100 + 155)}, 
                        255, 0.1) 0%, 
                        transparent 70%)`;
                    light.style.borderRadius = '50%';
                    light.style.top = `${Math.random() * 100}%`;
                    light.style.left = `${Math.random() * 100}%`;
                    light.style.opacity = '0';
                    light.style.animation = `lightPulse ${Math.random() * 8 + 4}s infinite alternate`;
                    light.style.zIndex = '-1';
                    messageCard.appendChild(light);
                }, i * 400);
            }
        }
    }

    createBalloonsForCelebration() {
        const container = document.getElementById('interactiveBalloons');
        if (!container) return;
        
        const balloonColors = [
            'linear-gradient(135deg, #ff4da6, #ff66b3)',
            'linear-gradient(135deg, #00ffcc, #00e6b8)',
            'linear-gradient(135deg, #ffcc00, #ff9900)',
            'linear-gradient(135deg, #9966ff, #6600cc)',
            'linear-gradient(135deg, #ff6666, #ff3366)',
            'linear-gradient(135deg, #66ffcc, #33cc99)'
        ];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.style.background = balloonColors[i % balloonColors.length];
                balloon.style.left = `${Math.random() * 100}%`;
                balloon.style.animationDuration = `${Math.random() * 10 + 15}s`;
                balloon.style.animationDelay = `${Math.random() * 5}s`;
                container.appendChild(balloon);
                
                // إضافة حدث النقر
                balloon.addEventListener('click', () => this.popBalloon(balloon));
            }, i * 500);
        }
    }

    createConfettiForCelebration() {
        const container = document.getElementById('confettiZone');
        if (!container) return;
        
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                confetti.style.background = [
                    '#ff4da6', '#00ffcc', '#ffcc00', 
                    '#ffffff', '#9966ff', '#ff6666'
                ][Math.floor(Math.random() * 6)];
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDuration = `${Math.random() * 4 + 3}s`;
                confetti.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(confetti);
            }, i * 30);
        }
    }

    createMovingStars() {
        const scene4 = document.getElementById('scene4');
        if (!scene4) return;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'moving-star';
                star.style.position = 'absolute';
                star.style.width = '20px';
                star.style.height = '20px';
                star.style.background = 'radial-gradient(circle, white 30%, transparent 70%)';
                star.style.borderRadius = '50%';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animation = `starMove ${Math.random() * 15 + 10}s linear infinite`;
                star.style.opacity = '0.6';
                star.style.filter = 'blur(1px)';
                scene4.appendChild(star);
            }, i * 300);
        }
    }

    setupEventListeners() {
        // تفاعل الهدية
        const giftWrapper = document.getElementById('giftWrapper');
        if (giftWrapper) {
            giftWrapper.addEventListener('click', (e) => {
                e.preventDefault();
                this.openGift();
            });

            giftWrapper.addEventListener('mouseenter', () => {
                this.audioManager.playSound('hoverSound', 0.1);
            });
        }

        // تفاعل البالونات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('balloon')) {
                this.popBalloon(e.target);
            }
        });

        // زر التخطي العام
        document.getElementById('globalSkipButton')?.addEventListener('click', () => {
            this.nextScene();
        });

        // زر التالي في المشهد 4
        document.getElementById('nextToMessage')?.addEventListener('click', () => {
            this.showScene(5);
        });

        // زر التخطي في المشهد 5
        document.getElementById('skipButton')?.addEventListener('click', () => {
            this.nextScene();
        });

        // زر إعادة القراءة
        document.getElementById('rereadBtn')?.addEventListener('click', () => {
            this.rereadMessage();
        });

        // زر تحكم الموسيقى
        document.getElementById('musicControl')?.addEventListener('click', () => {
            this.toggleMusic();
        });

        // نقاط التقدم
        document.querySelectorAll('.progress-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                const scene = parseInt(e.target.dataset.scene);
                if (scene && scene <= this.currentScene) {
                    this.showScene(scene);
                }
            });

            dot.addEventListener('mouseenter', () => {
                this.audioManager.playSound('hoverSound', 0.05);
            });
        });

        // تحكم الصوت
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const volume = parseFloat(e.target.value);
                this.audioManager.setVolume(volume);
                this.updateAudioIndicator(`🔊 مستوى الصوت: ${Math.round(volume * 100)}%`);
            });
        }

        // زر كتم الصوت
        document.getElementById('muteButton')?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        // إعادة التشغيل
        document.getElementById('restartButton')?.addEventListener('click', () => {
            this.restartExperience();
        });

        // تحكم لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case ' ':
                case 'Enter':
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextScene();
                    break;
                case 'ArrowLeft':
                    if (this.currentScene > 1) {
                        e.preventDefault();
                        this.showScene(this.currentScene - 1);
                    }
                    break;
                case 'm':
                case 'M':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'r':
                case 'R':
                    e.preventDefault();
                    this.restartExperience();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.toggleMusic();
                    break;
            }
        });

        // تفاعل النقر للصوت
        let audioActivated = false;
        document.addEventListener('click', () => {
            if (!audioActivated) {
                this.audioManager.activateAudio();
                this.updateAudioIndicator('🔊 الصوت مفعل الآن!');
                audioActivated = true;
                
                // إذا كنا في المشهد 4 أو 5 ونريد الموسيقى
                if (this.currentScene >= 4 && !this.isMusicPlaying) {
                    setTimeout(() => {
                        this.audioManager.playMusic(0.3);
                        this.isMusicPlaying = true;
                    }, 500);
                }
            }
        }, { once: false });

        // منع قائمة السياق
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
    }

    startExperience() {
        // إظهار زر التخطي
        document.getElementById('globalSkipButton')?.classList.add('show');
        
        // بدء التقدم التلقائي للمشهد الأول
        this.startAutoProgress();
        
        // تشغيل صوت خفيف للمشهد الأول
        setTimeout(() => {
            this.audioManager.playSound('transitionSound', 0.2);
        }, 1000);
    }

    animateAgeTransition() {
        const age17 = document.getElementById('age17');
        const age18 = document.getElementById('age18');
        const message = document.getElementById('transitionMessage');
        
        if (!age17 || !age18) return;
        
        // تشغيل صوت انتقالي
        this.audioManager.playSound('transitionSound', 0.3);
        
        // تحريك الرسالة
        setTimeout(() => {
            if (message) {
                message.style.opacity = '1';
                message.style.transition = 'opacity 1s ease';
            }
        }, 500);
        
        // تحريك العمر 17 للخروج
        setTimeout(() => {
            age17.style.opacity = '0';
            age17.style.transform = 'translateY(-100px) scale(0.8)';
            age17.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 1000);
        
        // تحريك العمر 18 للدخول
        setTimeout(() => {
            age18.style.opacity = '1';
            age18.style.transform = 'translateY(0) scale(1.1)';
            age18.style.transition = 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // تأثير اهتزاز خفيف عند ظهور العمر الجديد
            setTimeout(() => {
                age18.style.transform = 'translateY(0) scale(1)';
            }, 200);
        }, 1500);
        
        // إخفاء الرسالة
        setTimeout(() => {
            if (message) {
                message.style.opacity = '0';
            }
        }, 3500);
    }

    openGift() {
        if (this.hasOpenedGift) return;
        
        this.hasOpenedGift = true;
        const giftBox = document.getElementById('giftBox');
        const giftLight = document.getElementById('giftLight');
        
        // إضافة شرائط ضوئية
        for(let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createLightBeam(i * 45);
            }, i * 100);
        }
        
        // تشغيل صوت فتح الهدية
        this.audioManager.playSound('giftSound', 0.7);
        
        // تأثير اهتزاز
        if (giftBox && giftBox.parentElement) {
            giftBox.parentElement.style.transform = 'scale(1.15)';
            giftBox.parentElement.style.transition = 'transform 0.3s ease';
        }
        
        setTimeout(() => {
            if (giftBox && giftBox.parentElement) {
                giftBox.parentElement.style.transform = 'scale(1)';
                
                // فتح الهدية
                giftBox.classList.add('opened');
                
                // انفجار الضوء
                if (giftLight) {
                    giftLight.classList.add('active');
                }
                
                // نشر شرائط ضوئية
                setTimeout(() => {
                    this.createSparkleBurst();
                }, 500);
                
                // الانتقال لمشهد الاحتفال بعد 2 ثانية
                setTimeout(() => {
                    this.nextScene();
                }, 2000);
            }
        }, 300);
    }

    createLightBeam(angle) {
        const beam = document.createElement('div');
        beam.className = 'light-beam';
        beam.style.position = 'absolute';
        beam.style.width = '4px';
        beam.style.height = '150px';
        beam.style.background = 'linear-gradient(to top, transparent, var(--color-aqua), transparent)';
        beam.style.borderRadius = '2px';
        beam.style.top = '50%';
        beam.style.left = '50%';
        beam.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateY(-100px)`;
        beam.style.opacity = '0';
        beam.style.animation = `beamExpand 1s ease-out forwards`;
        beam.style.zIndex = '1';
        
        const giftWrapper = document.getElementById('giftWrapper');
        if (giftWrapper) {
            giftWrapper.appendChild(beam);
        }
        
        setTimeout(() => {
            beam.remove();
        }, 1000);
    }

    createSparkleBurst() {
        const container = document.getElementById('giftSparkles');
        if (!container) return;
        
        for(let i = 0; i < 30; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'mini-sparkle';
                sparkle.style.position = 'absolute';
                sparkle.style.width = '8px';
                sparkle.style.height = '8px';
                sparkle.style.background = ['#ff4da6', '#00ffcc', '#ffcc00', '#ffffff'][i % 4];
                sparkle.style.borderRadius = '50%';
                sparkle.style.top = '50%';
                sparkle.style.left = '50%';
                sparkle.style.transform = 'translate(-50%, -50%)';
                sparkle.style.opacity = '0';
                sparkle.style.animation = `sparkleBurst 1.5s ease-out forwards`;
                container.appendChild(sparkle);
                
                setTimeout(() => {
                    sparkle.remove();
                }, 1500);
            }, i * 30);
        }
    }

    startScene4Celebration() {
        const container = document.getElementById('celebrationParticles');
        
        // تشغيل صوت الاحتفال لمدة 4 ثواني فقط
        this.isCelebrationSoundPlaying = true;
        this.audioManager.playSound('celebrationSound', 0.6);
        
        // إيقاف صوت الاحتفال بعد 4 ثواني
        this.celebrationTimer = setTimeout(() => {
            this.isCelebrationSoundPlaying = false;
        }, 4000);
        
        // تشغيل الموسيقى الرئيسية بعد 2 ثانية من صوت الاحتفال
        setTimeout(() => {
            if (!this.isMuted) {
                this.audioManager.playMusic(0.3);
                this.isMusicPlaying = true;
                this.updateAudioIndicator('🎵 موسيقى تامر حسني تشتغل');
            }
        }, 2000);
        
        // إضافة تأثيرات خاصة للمشهد 4
        this.createCelebrationIntro();
        
        // إنشاء بالونات إضافية
        this.createAdditionalBalloons();
        
        // بدء التقدم التلقائي بعد 12 ثانية
        this.startAutoProgress();
    }

    createCelebrationIntro() {
        const container = document.getElementById('celebrationParticles');
        if (!container) return;
        
        // تأثير انفجار بداية الاحتفال
        for(let i = 0; i < 30; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.className = 'celebration-burst';
                burst.style.position = 'absolute';
                burst.style.width = `${Math.random() * 80 + 40}px`;
                burst.style.height = burst.style.width;
                burst.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)`;
                burst.style.borderRadius = '50%';
                burst.style.top = '50%';
                burst.style.left = '50%';
                burst.style.transform = 'translate(-50%, -50%) scale(0)';
                burst.style.opacity = '0.7';
                burst.style.animation = `burstExpand ${Math.random() * 0.5 + 0.5}s ease-out forwards`;
                container.appendChild(burst);
                
                setTimeout(() => {
                    burst.remove();
                }, 1000);
            }, i * 50);
        }
    }

    createAdditionalBalloons() {
        const container = document.getElementById('interactiveBalloons');
        if (!container) return;
        
        const balloonShapes = ['🎈', '🎈', '🎈', '💝', '🎀', '✨'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.innerHTML = balloonShapes[Math.floor(Math.random() * balloonShapes.length)];
                balloon.style.fontSize = '40px';
                balloon.style.background = 'transparent';
                balloon.style.textShadow = '0 0 10px currentColor';
                balloon.style.left = `${Math.random() * 100}%`;
                balloon.style.animationDuration = `${Math.random() * 12 + 18}s`;
                balloon.style.animationDelay = `${Math.random() * 3}s`;
                container.appendChild(balloon);
                
                // إضافة حدث النقر
                balloon.addEventListener('click', () => this.popBalloon(balloon));
            }, i * 400);
        }
    }

    popBalloon(balloon) {
        // تشغيل صوت فرقعة البالون
        this.audioManager.playSound('popSound', 0.4);
        
        balloon.classList.add('pop');
        
        // تحديث عداد الفرح
        this.updateCelebrationCounter();
        
        // إضافة شرائط عند فرقعة البالون
        setTimeout(() => {
            for(let i = 0; i < 8; i++) {
                const strip = document.createElement('div');
                strip.className = 'balloon-strip';
                strip.style.position = 'absolute';
                strip.style.width = '3px';
                strip.style.height = '20px';
                strip.style.background = balloon.style.background || '#ff4da6';
                strip.style.top = `${balloon.offsetTop}px`;
                strip.style.left = `${balloon.offsetLeft}px`;
                strip.style.transform = `rotate(${i * 45}deg) translateY(-10px)`;
                strip.style.animation = `stripFall ${Math.random() * 1 + 0.5}s ease-out forwards`;
                
                const particlesContainer = document.getElementById('celebrationParticles');
                if (particlesContainer) {
                    particlesContainer.appendChild(strip);
                }
                
                setTimeout(() => {
                    strip.remove();
                }, 1000);
            }
        }, 100);
        
        setTimeout(() => {
            if (balloon.parentNode) {
                balloon.remove();
            }
        }, 500);
    }

    updateCelebrationCounter() {
        const counterElement = document.getElementById('celebrationCount');
        if (!counterElement) return;
        
        let currentCount = parseInt(counterElement.textContent) || 18;
        currentCount += 1;
        counterElement.textContent = currentCount;
        
        // تأثير على العداد
        counterElement.style.transform = 'scale(1.3)';
        counterElement.style.color = '#ffcc00';
        setTimeout(() => {
            counterElement.style.transform = 'scale(1)';
            counterElement.style.color = '';
        }, 300);
    }

    startMessageScene() {
        // توقف التقدم التلقائي القديم
        this.stopAutoProgress();
        
        // إذا كانت الموسيقى مشتغلة من المشهد السابق، نستمر فيها
        if (this.isMusicPlaying) {
            // تخفيف الموسيقى قليلاً للمشهد العاطفي
            this.audioManager.setMusicVolume(0.2);
            this.updateAudioIndicator('💌 رسالة مع موسيقى هادئة');
        }
        
        // بدء شريط قراءة الرسالة
        this.startReadingProgress();
        
        // بدء التقدم التلقائي بعد 10 ثواني
        this.autoProgressTimer = setTimeout(() => {
            if (!this.messageReadComplete) {
                this.nextScene();
            }
        }, this.sceneTimers[5]);
    }

    startReadingProgress() {
        const progressBar = document.getElementById('readingProgress');
        if (!progressBar) return;
        
        progressBar.style.width = '0%';
        this.messageReadComplete = false;
        
        setTimeout(() => {
            progressBar.style.transition = 'width 8s linear';
            progressBar.style.width = '100%';
            
            this.readingProgressTimer = setTimeout(() => {
                this.messageReadComplete = true;
                progressBar.style.background = 'linear-gradient(90deg, var(--color-aqua), var(--color-blush))';
            }, 8000);
        }, 1000);
    }

    rereadMessage() {
        // إعادة تعيين شريط القراءة
        const progressBar = document.getElementById('readingProgress');
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.transition = 'width 8s linear';
                progressBar.style.width = '100%';
                
                if (this.readingProgressTimer) {
                    clearTimeout(this.readingProgressTimer);
                }
                
                this.readingProgressTimer = setTimeout(() => {
                    this.messageReadComplete = true;
                    progressBar.style.background = 'linear-gradient(90deg, var(--color-aqua), var(--color-blush))';
                }, 8000);
            }, 10);
        }
        
        // تشغيل صوت للتفاعل
        this.audioManager.playSound('hoverSound', 0.2);
        this.updateAudioIndicator('📖 إعادة قراءة الرسالة');
    }

    startEndingScene() {
        // تخفيف الموسيقى تدريجياً
        if (this.isMusicPlaying) {
            this.audioManager.fadeOutMusic(5000);
            this.isMusicPlaying = false;
        }
        
        // إضافة نجوم إضافية
        this.createAdditionalStars();
        
        // لا يوجد تقدم تلقائي للنهاية
        this.stopAutoProgress();
    }

    createAdditionalStars() {
        const container = document.getElementById('endingStars');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'star';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animationDelay = `${Math.random() * 3}s`;
                star.style.animationDuration = `${Math.random() * 4 + 2}s`;
                container.appendChild(star);
            }, i * 100);
        }
    }

    nextScene() {
        if (this.currentScene < this.totalScenes) {
            this.currentScene++;
            this.showScene(this.currentScene);
        }
    }

    showScene(sceneNumber) {
        // إيقاف أي مؤقتات سابقة
        this.stopAutoProgress();
        if (this.celebrationTimer) {
            clearTimeout(this.celebrationTimer);
            this.isCelebrationSoundPlaying = false;
        }
        if (this.readingProgressTimer) {
            clearTimeout(this.readingProgressTimer);
            this.messageReadComplete = false;
        }
        
        // تحديث نقاط التقدم
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index + 1 === sceneNumber);
        });
        
        // إخفاء جميع المشاهد
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });
        
        // إظهار المشهد المطلوب
        const targetScene = document.getElementById(`scene${sceneNumber}`);
        if (targetScene) {
            targetScene.classList.add('active');
            this.currentScene = sceneNumber;
            
            // إعدادات خاصة بكل مشهد
            switch(sceneNumber) {
                case 2:
                    setTimeout(() => this.animateAgeTransition(), 500);
                    this.startAutoProgress();
                    this.updateAudioIndicator('🎂 عمر جديد وحياة جديدة');
                    break;
                    
                case 3:
                    // لا تقدم تلقائي - انتظار تفاعل المستخدم
                    this.updateAudioIndicator('🎁 اضغطي على الهدية!');
                    break;
                    
                case 4:
                    setTimeout(() => this.startScene4Celebration(), 500);
                    this.updateAudioIndicator('🎉 احتفال وموسيقى تامر حسني!');
                    break;
                    
                case 5:
                    setTimeout(() => this.startMessageScene(), 500);
                    break;
                    
                case 6:
                    setTimeout(() => this.startEndingScene(), 500);
                    this.updateAudioIndicator('✨ النهاية.. أتمنى تكوني عجبتك الهدية 💝');
                    break;
                    
                default:
                    this.startAutoProgress();
                    break;
            }
            
            // تشغيل صوت انتقال
            if (sceneNumber > 1) {
                this.audioManager.playSound('transitionSound', 0.2);
            }
        }
    }

    startAutoProgress() {
        // إيقاف أي مؤقت سابق
        this.stopAutoProgress();
        
        const sceneTime = this.sceneTimers[this.currentScene];
        if (sceneTime > 0) {
            this.autoProgressTimer = setTimeout(() => {
                this.nextScene();
            }, sceneTime);
        }
    }

    stopAutoProgress() {
        if (this.autoProgressTimer) {
            clearTimeout(this.autoProgressTimer);
            this.autoProgressTimer = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const button = document.getElementById('muteButton');
        const icon = button?.querySelector('.sound-icon');
        const soundWave = document.getElementById('soundWave');
        
        if (this.isMuted) {
            if (icon) icon.textContent = '🔇';
            if (soundWave) soundWave.style.opacity = '0.3';
            this.audioManager.muteAll();
            this.updateAudioIndicator('🔇 الصوت مكتوم');
        } else {
            if (icon) icon.textContent = '🔈';
            if (soundWave) soundWave.style.opacity = '1';
            this.audioManager.unmuteAll();
            this.updateAudioIndicator('🔊 الصوت شغال');
            
            // استئناف الموسيقى إذا كنا في المشهد 4 أو 5
            if (this.currentScene >= 4 && !this.isMusicPlaying) {
                setTimeout(() => {
                    this.audioManager.playMusic(0.3);
                    this.isMusicPlaying = true;
                }, 500);
            }
        }
    }

    toggleMusic() {
        if (this.currentScene < 4) {
            this.updateAudioIndicator('🎵 الموسيقى تبدأ من المشهد 4');
            return;
        }
        
        if (this.isMusicPlaying) {
            this.audioManager.fadeOutMusic(1000);
            this.isMusicPlaying = false;
            this.updateAudioIndicator('⏸️ توقفت الموسيقى');
        } else {
            this.audioManager.playMusic(0.3);
            this.isMusicPlaying = true;
            this.updateAudioIndicator('▶️ عادت الموسيقى');
        }
    }

    updateAudioIndicator(text) {
        const indicator = document.getElementById('audioIndicator');
        if (!indicator) return;
        
        const statusElement = indicator.querySelector('.audio-status') || indicator;
        statusElement.textContent = text;
        indicator.classList.add('show', 'playing');
        
        setTimeout(() => {
            indicator.classList.remove('playing');
        }, 3000);
    }

    restartExperience() {
        // إيقاف كل المؤقتات
        this.stopAutoProgress();
        if (this.celebrationTimer) {
            clearTimeout(this.celebrationTimer);
        }
        if (this.readingProgressTimer) {
            clearTimeout(this.readingProgressTimer);
        }
        
        // إعادة تعيين المتغيرات
        this.currentScene = 1;
        this.hasOpenedGift = false;
        this.isMusicPlaying = false;
        this.isCelebrationSoundPlaying = false;
        this.messageReadComplete = false;
        this.audioManager.stopAll();
        
        // تنظيف التأثيرات السابقة
        this.cleanupEffects();
        
        // إعادة تعيين المشاهد
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });
        
        // إعادة تعيين الهدية
        const giftBox = document.getElementById('giftBox');
        if (giftBox) {
            giftBox.classList.remove('opened');
        }
        
        // إعادة تعيين شريط القراءة
        const readingProgress = document.getElementById('readingProgress');
        if (readingProgress) {
            readingProgress.style.width = '0%';
            readingProgress.style.background = '';
        }
        
        // إعادة تعيين عداد الفرح
        const celebrationCount = document.getElementById('celebrationCount');
        if (celebrationCount) {
            celebrationCount.textContent = '18';
        }
        
        // إظهار المشهد الأول
        const scene1 = document.getElementById('scene1');
        if (scene1) {
            scene1.classList.add('active');
        }
        
        // تحديث نقاط التقدم
        document.querySelectorAll('.progress-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === 0);
        });
        
        // إعادة تشغيل التجربة
        setTimeout(() => {
            this.startExperience();
        }, 1000);
        
        this.updateAudioIndicator('🔄 ابتدي من جديد');
    }

    cleanupEffects() {
        // تنظيف حاويات التأثيرات
        const containers = [
            'celebrationParticles',
            'giftSparkles',
            'interactiveBalloons',
            'confettiZone',
            'sparkleField'
        ];
        
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '';
            }
        });
        
        // تنظيف العناصر المضافة ديناميكياً
        document.querySelectorAll('.background-light, .ending-light, .floating-heart, .moving-star, .celebration-burst, .balloon-strip, .mini-sparkle, .light-beam').forEach(el => {
            if (el.parentNode) el.remove();
        });
        
        // إعادة إنشاء العناصر الأساسية
        setTimeout(() => {
            this.createBalloonsForCelebration();
            this.createConfettiForCelebration();
            this.createMovingStars();
        }, 500);
    }
}

// ============================================
// مدير الصوتيات - المحدث
// ============================================
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volume = 0.7;
        this.isMuted = false;
        this.audioEnabled = false;
        this.musicVolume = 0.3;
        this.currentMusic = null;
    }

    async loadSounds() {
        try {
            console.log('🎵 بدء تحميل الصوتيات...');
            
            // تحميل الأصوات مع fallback
            this.sounds['giftSound'] = this.createAudio('sounds/gift-open.mp3', 'fallback-gift');
            this.sounds['celebrationSound'] = this.createAudio('sounds/celebration.mp3', 'fallback-celebration');
            this.sounds['hoverSound'] = this.createFallbackSound(800, 0.05);
            this.sounds['transitionSound'] = this.createFallbackSound(1200, 0.1);
            this.sounds['popSound'] = this.createFallbackSound(200, 0.1);
            
            // تحميل الموسيقى الرئيسية
            this.music = this.createAudio(
                'sounds/تامر حسني - كل سنة وانت طيب بدون موسيقى(360P).mp4',
                'fallback-music'
            );
            
            if (this.music) {
                this.music.loop = true;
                this.music.volume = 0;
            }
            
            console.log('✅ صوتيات جاهزة تقريبًا');
            
            return new Promise((resolve) => {
                // انتظار قصير ثم المتابعة
                setTimeout(() => {
                    console.log('🎵 الصوتيات جاهزة للاستخدام');
                    resolve();
                }, 1000);
            });
        } catch (error) {
            console.log('⚠️ بعض الصوتيات قد لا تعمل:', error);
            return Promise.resolve();
        }
    }

    createAudio(src, fallbackName) {
        try {
            const audio = new Audio();
            audio.src = src;
            audio.preload = 'auto';
            audio.crossOrigin = 'anonymous';
            
            audio.addEventListener('error', (e) => {
                console.warn(`⚠️ ملف ${src} غير موجود، استخدام بديل`);
                this.useFallbackSound(audio, fallbackName);
            });
            
            audio.load();
            return audio;
        } catch (error) {
            console.log(`❌ خطأ في إنشاء ${src}:`, error);
            return this.createFallbackSound(1000, 0.2);
        }
    }

    useFallbackSound(audio, fallbackName) {
        if (fallbackName === 'fallback-gift') {
            this.createBeepSound(audio, 1500, 0.5, 'sine');
        } else if (fallbackName === 'fallback-celebration') {
            this.createBeepSound(audio, 800, 1, 'square');
        } else if (fallbackName === 'fallback-music') {
            // موسيقى خلفية بسيطة
            this.createBackgroundMusic(audio);
        }
    }

    createFallbackSound(frequency, duration) {
        const audio = new Audio();
        this.createBeepSound(audio, frequency, duration, 'sine');
        return audio;
    }

    createBeepSound(audioElement, frequency, duration, type = 'sine') {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0.3, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
            
            oscillator.start(now);
            oscillator.stop(now + duration);
            
            // تحويل إلى MediaStream
            const destination = audioContext.createMediaStreamDestination();
            oscillator.connect(destination);
            
            audioElement.srcObject = destination.stream;
        } catch (e) {
            console.log('⚠️ Web Audio API غير متاح');
        }
    }

    createBackgroundMusic(audioElement) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator1 = audioContext.createOscillator();
            const oscillator2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator1.frequency.value = 440; // نت A
            oscillator2.frequency.value = 550; // نت C#
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            // إيقاع بسيط
            const now = audioContext.currentTime;
            gainNode.gain.setValueAtTime(0.1, now);
            
            // نمط إيقاعي بسيط
            const pattern = [0.1, 0.05, 0.1, 0.05];
            pattern.forEach((value, index) => {
                gainNode.gain.setValueAtTime(value, now + index * 0.5);
            });
            
            oscillator1.start(now);
            oscillator2.start(now);
            oscillator1.stop(now + 2);
            oscillator2.stop(now + 2);
            
            // تكرار
            setInterval(() => {
                this.createBackgroundMusic(audioElement);
            }, 2000);
            
            const destination = audioContext.createMediaStreamDestination();
            oscillator1.connect(destination);
            oscillator2.connect(destination);
            
            audioElement.srcObject = destination.stream;
        } catch (e) {
            console.log('⚠️ لا يمكن إنشاء موسيقى خلفية');
        }
    }

    activateAudio() {
        if (!this.audioEnabled) {
            this.audioEnabled = true;
            console.log('✅ تفعيل الصوت');
            
            // تشغيل موسيقى خافتة جداً للتأكد
            const testSound = new Audio();
            testSound.volume = 0.001;
            
            testSound.play().then(() => {
                console.log('✅ الصوت مفعل في المتصفح');
                testSound.pause();
            }).catch(e => {
                console.log('⚠️ قد تحتاج إلى تفعيل الصوت يدويًا في المتصفح');
            });
        }
    }

    playSound(soundName, volume = 1) {
        if (this.isMuted || !this.audioEnabled) {
            return null;
        }
        
        try {
            let sound;
            
            if (this.sounds[soundName]) {
                sound = this.sounds[soundName].cloneNode();
            } else {
                sound = new Audio();
            }
            
            sound.volume = Math.min(volume, this.volume);
            sound.currentTime = 0;
            
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (e.name === 'NotAllowedError') {
                        console.log(`🔔 يحتاج تفعيل الصوت: ${soundName}`);
                    }
                });
            }
            
            return sound;
        } catch (error) {
            console.log(`⚠️ خطأ في تشغيل ${soundName}:`, error);
            return null;
        }
    }

    playMusic(volume = 0.3) {
        if (this.isMuted || !this.music || !this.audioEnabled) {
            return;
        }
        
        try {
            this.musicVolume = volume;
            this.music.volume = Math.min(volume, this.volume);
            this.music.currentTime = 0;
            
            const playPromise = this.music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('🎵 موسيقى تامر حسني تشتغل');
                    this.currentMusic = this.music;
                }).catch(e => {
                    console.log('❌ فشل تشغيل الموسيقى:', e);
                });
            }
        } catch (error) {
            console.log('❌ خطأ في تشغيل الموسيقى:', error);
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.music && this.currentMusic === this.music) {
            this.music.volume = Math.min(volume, this.volume);
        }
    }

    fadeOutMusic(duration = 3000) {
        if (!this.music || this.currentMusic !== this.music) return;
        
        const startVolume = this.music.volume;
        const fadeStep = startVolume / (duration / 100);
        
        const fadeInterval = setInterval(() => {
            if (this.music.volume > 0.01) {
                this.music.volume -= fadeStep;
            } else {
                this.music.pause();
                this.music.currentTime = 0;
                this.currentMusic = null;
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    setVolume(volume) {
        this.volume = volume;
        
        if (!this.isMuted && this.audioEnabled) {
            // تحديث مستوى أصوات المؤثرات
            Object.values(this.sounds).forEach(sound => {
                if (sound.volume !== undefined) {
                    sound.volume = volume;
                }
            });
            
            // تحديث مستوى الموسيقى إذا كانت مشتغلة
            if (this.music && this.currentMusic === this.music) {
                this.music.volume = Math.min(this.musicVolume, volume);
            }
        }
        
        const slider = document.getElementById('volumeSlider');
        if (slider) {
            slider.value = volume;
        }
    }

    muteAll() {
        this.isMuted = true;
        
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;
        });
        
        if (this.music) {
            this.music.muted = true;
            this.music.pause();
        }
    }

    unmuteAll() {
        this.isMuted = false;
        
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
            if (sound.volume !== undefined) {
                sound.volume = this.volume;
            }
        });
        
        if (this.music && this.currentMusic === this.music && this.audioEnabled) {
            this.music.muted = false;
            this.music.volume = Math.min(this.musicVolume, this.volume);
            
            this.music.play().catch(e => {
                console.log('❌ فشل استئناف الموسيقى:', e);
            });
        }
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.currentMusic = null;
        }
    }
}

// ============================================
// بدء التجربة عند تحميل الصفحة
// ============================================
window.addEventListener('load', () => {
    console.log('🎉 بدء تحميل هدية عيد الميلاد...');
    console.log('✨ المميزات:');
    console.log('- توقيتات تلقائية بين المشاهد');
    console.log('- موسيقى تامر حسني في المشهد 4 و5');
    console.log('- تفاعل مع البالونات والهدايا');
    console.log('- مؤشرات صوتية وتقدم');
    
    // فحص دعم الصوت
    if (!checkAudioSupport()) {
        const indicator = document.getElementById('audioIndicator');
        if (indicator) {
            indicator.innerHTML = '<span class="audio-status">⚠️ تأكد من تفعيل الصوت</span>';
            indicator.classList.add('show');
        }
    }
    
    // إنشاء وتشغيل التجربة
    window.birthdayExperience = new BirthdayExperience();
    
    // تفعيل الصوت عند أول نقر
    let audioActivated = false;
    document.addEventListener('click', function initAudio() {
        if (!audioActivated && window.birthdayExperience && window.birthdayExperience.audioManager) {
            window.birthdayExperience.audioManager.activateAudio();
            audioActivated = true;
            
            const indicator = document.getElementById('audioIndicator');
            if (indicator) {
                indicator.innerHTML = '<span class="audio-status">✅ الصوت مفعل! استمتعي بالتجربة 🎵</span>';
                setTimeout(() => {
                    indicator.innerHTML = '<span class="audio-status">🎵 جاهز للفرحة!</span>';
                }, 2000);
            }
        }
    }, { once: false });
});

// ============================================
// التأثيرات الإضافية
// ============================================

// تأثيرات النوتات الموسيقية
function createMusicNotes() {
    const container = document.querySelector('.music-notes-container');
    if (!container) return;
    
    setInterval(() => {
        const note = document.createElement('div');
        note.className = 'music-note';
        note.innerHTML = ['🎵', '🎶', '🎼'][Math.floor(Math.random() * 3)];
        note.style.left = `${Math.random() * 100}%`;
        note.style.fontSize = `${Math.random() * 20 + 15}px`;
        note.style.opacity = '0.7';
        note.style.animationDuration = `${Math.random() * 3 + 2}s`;
        container.appendChild(note);
        
        setTimeout(() => {
            if (note.parentNode) note.remove();
        }, 4000);
    }, 1000);
}

// تشغيل تأثيرات النوتات عندما تكون الموسيقى شغالة
setTimeout(() => {
    createMusicNotes();
}, 3000);

// تحسينات إضافية للتفاعل
document.addEventListener('DOMContentLoaded', () => {
    // إضافة تأثيرات عند تمرير الماوس على العناصر التفاعلية
    const interactiveElements = document.querySelectorAll('.balloon, .gift-wrapper, .celebration-action, .next-scene-btn, .skip-btn, .reread-btn, .restart-button');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'translateY(-2px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translateY(0)';
        });
    });
    
    // تأثير اهتزاز خفيف لعناصر معينة
    setInterval(() => {
        const hearts = document.querySelectorAll('.celebration-heart, .heartbeat-emoji');
        hearts.forEach(heart => {
            heart.style.transform = `scale(${1 + Math.sin(Date.now() / 500) * 0.1})`;
        });
    }, 50);
});