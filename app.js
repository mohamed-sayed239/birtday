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
    
    // فحص وجود الملفات
    console.log('📁 ملفات الصوت المطلوبة:');
    console.log('- sounds/gift-open.mp3');
    console.log('- sounds/celebration.mp3');
    console.log('- sounds/تامر حسني - كل سنة وانت طيب بدون موسيقى(360P).mp4');
    
    // اختبار إنشاء ملف صوت
    try {
        const testAudio = new Audio();
        console.log('✅ دعم Audio API: ممتاز');
        return true;
    } catch (error) {
        console.error('❌ خطأ في Audio API:', error);
        return false;
    }
}

// ============================================
// الفئة الرئيسية للتجربة
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
        this.audioManager = new AudioManager();
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
        }, 2000);
    }

    showEnhancedLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.display = 'flex';
        
        const loadingMessages = [
            "بيجهزوا الهدايا 🎁",
            "بيلموا البالونات 🎈",
            "بيجهزوا المفاجآت ✨",
            "بيكتبوا الرسائل 💌",
            "بتشغّل الموسيقى 🎵"
        ];
        
        let messageIndex = 0;
        const messageElement = document.getElementById('loadingMessage');
        
        // تغيير الرسائل
        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % loadingMessages.length;
            messageElement.textContent = loadingMessages[messageIndex];
        }, 1500);
        
        // محاكاة تحميل التقدم
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 10 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                clearInterval(messageInterval);
            }
            document.getElementById('loadingProgress').style.width = `${progress}%`;
        }, 200);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            // إظهار مؤشر الصوت
            document.getElementById('audioIndicator').classList.add('show');
            this.updateAudioIndicator('🔇 اضغط للتشغيل');
        }, 500);
    }

    createSceneElements() {
        // إنشاء النجوم للنهاية
        const starsContainer = document.getElementById('endingStars');
        for (let i = 0; i < 80; i++) { // زدنا عدد النجوم
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
        }

        // إنشاء قلوب طافية
        const heartsContainer = document.getElementById('floatingHearts');
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'floating-heart';
                heart.innerHTML = ['❤️', '💖', '💗', '💓', '💞'][i % 5];
                heart.style.left = `${Math.random() * 100}%`;
                heart.style.fontSize = `${Math.random() * 25 + 20}px`;
                heart.style.opacity = '0.8';
                heart.style.animation = `heartFloat ${Math.random() * 8 + 8}s linear infinite`;
                heart.style.animationDelay = `${i * 0.3}s`;
                heartsContainer.appendChild(heart);
            }, i * 200);
        }

        // إنشاء أضواء خلفية إضافية
        this.createBackgroundEffects();
    }

    createBackgroundEffects() {
        // أضواء خلفية للرسالة
        const messageCard = document.querySelector('.message-card');
        if (messageCard) {
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const light = document.createElement('div');
                    light.className = 'background-light';
                    light.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1) 0%, transparent 70%)`;
                    light.style.width = `${Math.random() * 200 + 100}px`;
                    light.style.height = light.style.width;
                    light.style.position = 'absolute';
                    light.style.borderRadius = '50%';
                    light.style.top = `${Math.random() * 100}%`;
                    light.style.left = `${Math.random() * 100}%`;
                    light.style.opacity = '0';
                    light.style.animation = `lightPulse ${Math.random() * 8 + 4}s infinite alternate`;
                    light.style.zIndex = '-1';
                    messageCard.appendChild(light);
                }, i * 300);
            }
        }
    }

    setupEventListeners() {
        // تفاعل الهدية
        const giftWrapper = document.getElementById('giftWrapper');
        giftWrapper.addEventListener('click', (e) => {
            e.preventDefault();
            this.openGift();
        });

        giftWrapper.addEventListener('mouseenter', () => {
            this.audioManager.playSound('hoverSound', 0.1);
        });

        // تفاعل البالونات
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('balloon')) {
                this.popBalloon(e.target);
            }
        });

        // زر التخطي
        document.getElementById('skipButton').addEventListener('click', () => {
            this.nextScene();
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
        volumeSlider.addEventListener('input', (e) => {
            const volume = parseFloat(e.target.value);
            this.audioManager.setVolume(volume);
        });

        // زر كتم الصوت
        document.getElementById('muteButton').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMute();
        });

        // إعادة التشغيل
        document.getElementById('restartButton')?.addEventListener('click', () => {
            this.restartExperience();
        });

        // تحكم لوحة المفاتيح
        document.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextScene();
            } else if (e.key === 'ArrowLeft' && this.currentScene > 1) {
                e.preventDefault();
                this.showScene(this.currentScene - 1);
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                this.toggleMute();
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                this.restartExperience();
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                this.toggleMusic();
            }
        });

        // منع قائمة السياق
        document.addEventListener('contextmenu', (e) => e.preventDefault());

        // تفاعل النقر لتفعيل الصوت
        document.addEventListener('click', () => {
            this.audioManager.activateAudio();
        }, { once: true });
    }

    startExperience() {
        // إظهار زر التخطي
        document.getElementById('skipButton').classList.add('show');
        
        // بدء المشهد الأول
        setTimeout(() => {
            this.nextScene();
        }, 1000);
    }

    animateAgeTransition() {
        const age17 = document.getElementById('age17');
        const age18 = document.getElementById('age18');
        const message = document.getElementById('transitionMessage');
        
        // تشغيل صوت انتقالي
        this.audioManager.playSound('transitionSound', 0.3);
        
        // تحريك الرسالة
        setTimeout(() => {
            message.style.opacity = '1';
            message.style.transition = 'opacity 1s ease';
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
            message.style.opacity = '0';
        }, 3000);
        
        // الانتقال للمشهد التالي
        setTimeout(() => {
            this.nextScene();
        }, 4000);
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
        giftBox.parentElement.style.transform = 'scale(1.15)';
        giftBox.parentElement.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            giftBox.parentElement.style.transform = 'scale(1)';
            
            // فتح الهدية
            giftBox.classList.add('opened');
            
            // انفجار الضوء
            giftLight.classList.add('active');
            
            // نشر شرائط ضوئية
            setTimeout(() => {
                this.createSparkleBurst();
            }, 500);
            
            // الانتقال لمشهد الاحتفال
            setTimeout(() => {
                this.nextScene();
            }, 1800);
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
        giftWrapper.appendChild(beam);
        
        setTimeout(() => {
            beam.remove();
        }, 1000);
    }

    createSparkleBurst() {
        const container = document.getElementById('giftSparkles');
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

    createCelebration() {
        const container = document.getElementById('celebrationParticles');
        
        // تشغيل صوت الاحتفال لمدة محددة (5 ثواني)
        this.isCelebrationSoundPlaying = true;
        const celebrationSound = this.audioManager.playSound('celebrationSound', 0.8);
        
        // إيقاف صوت الاحتفال بعد 5 ثواني
        if (celebrationSound) {
            this.celebrationTimer = setTimeout(() => {
                celebrationSound.pause();
                celebrationSound.currentTime = 0;
                this.isCelebrationSoundPlaying = false;
            }, 5000);
        }
        
        // إضافة تأثير خاص عند بداية الاحتفال
        this.createCelebrationIntro();
        
        // إنشاء بالونات بأشكال مختلفة
        const balloonColors = ['#ff4da6', '#00ffcc', '#ffcc00', '#9966ff', '#ff6666', '#ff9966', '#66ffcc'];
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                
                // أشكال مختلفة للبالونات
                if (i % 3 === 0) {
                    // شكل قلب
                    balloon.innerHTML = '🎈';
                    balloon.style.fontSize = '50px';
                    balloon.style.background = 'transparent';
                } else {
                    // شكل دائري عادي
                    balloon.style.background = balloonColors[i % balloonColors.length];
                }
                
                balloon.style.left = `${Math.random() * 100}%`;
                balloon.style.animationDuration = `${Math.random() * 8 + 12}s`;
                balloon.style.animationDelay = `${Math.random() * 3}s`;
                balloon.style.zIndex = Math.floor(Math.random() * 10);
                container.appendChild(balloon);
                
                setTimeout(() => {
                    if (balloon.parentNode) {
                        balloon.remove();
                    }
                }, 20000);
            }, i * 250);
        }
        
        // إنشاء كونفيتي بكميات أكبر
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-piece';
                
                // أشكال مختلفة للكونفيتي
                if (i % 5 === 0) {
                    confetti.style.width = '15px';
                    confetti.style.height = '15px';
                    confetti.style.borderRadius = '0';
                    confetti.style.transform = `rotate(${Math.random() * 45}deg)`;
                }
                
                confetti.style.background = ['#ff4da6', '#00ffcc', '#ffcc00', '#ffffff', '#ff9966', '#9966ff'][Math.floor(Math.random() * 6)];
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.animationDuration = `${Math.random() * 4 + 3}s`;
                confetti.style.animationDelay = `${Math.random() * 3}s`;
                container.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.remove();
                    }
                }, 7000);
            }, i * 20);
        }
        
        // إنشاء بقع لامعة متحركة
        for (let i = 0; i < 40; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = `${Math.random() * 100}%`;
                sparkle.style.top = `${Math.random() * 100}%`;
                sparkle.style.animationDelay = `${Math.random() * 3}s`;
                sparkle.style.animationDuration = `${Math.random() * 3 + 2}s`;
                container.appendChild(sparkle);
            }, i * 75);
        }
        
        // إضافة نجوم متحركة
        for (let i = 0; i < 25; i++) {
            setTimeout(() => {
                const star = document.createElement('div');
                star.className = 'moving-star';
                star.style.position = 'absolute';
                star.style.width = '15px';
                star.style.height = '15px';
                star.style.background = 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'15\' height=\'15\' viewBox=\'0 0 15 15\'><polygon points=\'7.5,0 9.8,5.1 15,5.8 11.2,9.6 12.2,15 7.5,12.3 2.8,15 3.8,9.6 0,5.8 5.2,5.1\' fill=\'white\'/></svg>")';
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                star.style.animation = `starMove ${Math.random() * 10 + 5}s linear infinite`;
                star.style.opacity = '0.6';
                container.appendChild(star);
            }, i * 150);
        }
        
        // تشغيل الموسيقى الرئيسية بعد انتهاء صوت الاحتفال
        setTimeout(() => {
            this.audioManager.playMusic(0.4);
            this.updateAudioIndicator('🎵 موسيقى تامر حسني');
        }, 5000);
        
        // الانتقال التلقائي لمشهد الرسالة
        setTimeout(() => {
            this.nextScene();
        }, 10000);
    }

    createCelebrationIntro() {
        const container = document.getElementById('celebrationParticles');
        
        // تأثير انفجار بداية الاحتفال
        for(let i = 0; i < 50; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.className = 'celebration-burst';
                burst.style.position = 'absolute';
                burst.style.width = `${Math.random() * 100 + 50}px`;
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
            }, i * 30);
        }
    }

    popBalloon(balloon) {
        // تشغيل صوت فرقعة البالون
        this.audioManager.playSound('popSound', 0.4);
        
        balloon.classList.add('pop');
        
        // إضافة شرائط عند فرقعة البالون
        setTimeout(() => {
            for(let i = 0; i < 8; i++) {
                const strip = document.createElement('div');
                strip.className = 'balloon-strip';
                strip.style.position = 'absolute';
                strip.style.width = '3px';
                strip.style.height = '20px';
                strip.style.background = balloon.style.background || '#ff4da6';
                strip.style.top = balloon.offsetTop + 'px';
                strip.style.left = balloon.offsetLeft + 'px';
                strip.style.transform = `rotate(${i * 45}deg) translateY(-10px)`;
                strip.style.animation = `stripFall ${Math.random() * 1 + 0.5}s ease-out forwards`;
                document.getElementById('celebrationParticles').appendChild(strip);
                
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

    nextScene() {
        if (this.currentScene < this.totalScenes) {
            this.currentScene++;
            this.showScene(this.currentScene);
        }
    }

    showScene(sceneNumber) {
        // إيقاف أي مؤقتات سابقة
        if (this.celebrationTimer) {
            clearTimeout(this.celebrationTimer);
            this.isCelebrationSoundPlaying = false;
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
                    break;
                case 4:
                    setTimeout(() => this.createCelebration(), 500);
                    break;
                case 5:
                    // المشهد 5: الرسالة (لا يوجد صوت إضافي هنا)
                    // الموسيقى تستمر من المشهد السابق
                    this.updateAudioIndicator('🎵 موسيقى تامر حسني');
                    break;
                case 6:
                    // المشهد 6: النهاية
                    // إضافة تأثيرات خاصة للنهاية
                    setTimeout(() => this.createEndingEffects(), 1000);
                    
                    // تخفيف الموسيقى في النهاية
                    setTimeout(() => {
                        this.audioManager.fadeOutMusic(4000);
                        this.updateAudioIndicator('🎵 الموسيقى بتخلص');
                    }, 5000);
                    break;
            }
            
            // تحديث مؤشر الصوت
            this.updateSceneAudioIndicator();
        }
    }

    createEndingEffects() {
        // إضافة شعار خاص في النهاية
        const endingContainer = document.getElementById('scene6');
        
        // شعار ضوئي
        const logo = document.createElement('div');
        logo.className = 'ending-logo';
        logo.innerHTML = '🎂🎉🎁';
        logo.style.fontSize = '4rem';
        logo.style.marginTop = '40px';
        logo.style.opacity = '0';
        logo.style.animation = 'fadeIn 2s ease-out 1s forwards';
        endingContainer.appendChild(logo);
        
        // رسالة تأكيد
        const confirmation = document.createElement('div');
        confirmation.className = 'confirmation-message';
        confirmation.innerHTML = 'أتمنى تكوني عجبتك الهدية! 😊';
        confirmation.style.fontSize = '1.8rem';
        confirmation.style.marginTop = '30px';
        confirmation.style.color = 'var(--color-aqua)';
        confirmation.style.opacity = '0';
        confirmation.style.animation = 'fadeIn 2s ease-out 3s forwards';
        endingContainer.appendChild(confirmation);
        
        // إضافة أضواء متحركة في الخلفية
        for(let i = 0; i < 10; i++) {
            setTimeout(() => {
                const light = document.createElement('div');
                light.className = 'ending-light';
                light.style.position = 'absolute';
                light.style.width = '100px';
                light.style.height = '100px';
                light.style.background = `radial-gradient(circle, var(--color-${['blush', 'aqua', 'sunrise', 'mist'][i % 4]}) 0%, transparent 70%)`;
                light.style.borderRadius = '50%';
                light.style.top = `${Math.random() * 100}%`;
                light.style.left = `${Math.random() * 100}%`;
                light.style.opacity = '0.3';
                light.style.animation = `lightFloat ${Math.random() * 10 + 5}s infinite alternate`;
                endingContainer.appendChild(light);
            }, i * 500);
        }
    }

    updateSceneAudioIndicator() {
        const sceneMessages = {
            1: "🎶 استعد للفرحة",
            2: "🎂 عمر جديد",
            3: "🎁 افتح الهدية",
            4: "🎉 احتفال مع موسيقى تامر حسني",
            5: "💌 رسالة مع الموسيقى",
            6: "✨ النهاية"
        };
        
        if (sceneMessages[this.currentScene]) {
            this.updateAudioIndicator(sceneMessages[this.currentScene]);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const button = document.getElementById('muteButton');
        const icon = button.querySelector('.sound-icon');
        const indicator = document.getElementById('audioIndicator');
        
        if (this.isMuted) {
            icon.textContent = '🔇';
            this.audioManager.muteAll();
            indicator.innerHTML = '<span class="audio-status">🔇 الصوت مكتوم</span>';
        } else {
            icon.textContent = '🔈';
            this.audioManager.unmuteAll();
            indicator.innerHTML = '<span class="audio-status">🔊 الصوت شغال</span>';
            
            // استئناف الموسيقى إذا كانت مشتغلة قبل الكتم
            if (this.isMusicPlaying && this.currentScene >= 4) {
                this.audioManager.playMusic(0.3);
            }
        }
    }

    toggleMusic() {
        if (this.isMusicPlaying) {
            this.audioManager.fadeOutMusic(1000);
            this.isMusicPlaying = false;
            this.updateAudioIndicator('⏸️ توقفت الموسيقى');
        } else if (this.currentScene >= 4) {
            this.audioManager.playMusic(0.3);
            this.isMusicPlaying = true;
            this.updateAudioIndicator('▶️ عادت الموسيقى');
        }
    }

    updateAudioIndicator(text) {
        const indicator = document.getElementById('audioIndicator');
        indicator.innerHTML = `<span class="audio-status">${text}</span>`;
        indicator.classList.add('playing');
        
        setTimeout(() => {
            indicator.classList.remove('playing');
        }, 3000);
    }

    restartExperience() {
        // إيقاف كل المؤقتات
        if (this.celebrationTimer) {
            clearTimeout(this.celebrationTimer);
        }
        
        this.currentScene = 1;
        this.hasOpenedGift = false;
        this.isMusicPlaying = false;
        this.isCelebrationSoundPlaying = false;
        this.audioManager.stopAll();
        
        // تنظيف التأثيرات السابقة
        document.querySelectorAll('.background-light, .ending-light, .ending-logo, .confirmation-message, .celebration-burst, .moving-star').forEach(el => {
            if (el.parentNode) el.remove();
        });
        
        // إعادة تعيين المشاهد
        document.querySelectorAll('.scene').forEach(scene => {
            scene.classList.remove('active');
        });
        
        // إعادة تعيين الهدية
        const giftBox = document.getElementById('giftBox');
        if (giftBox) {
            giftBox.classList.remove('opened');
        }
        
        // تنظيف حاويات التأثيرات
        const containers = ['celebrationParticles', 'giftSparkles', 'floatingHearts'];
        containers.forEach(id => {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = '';
            }
        });
        
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
}

// ============================================
// مدير الصوتيات (محدث)
// ============================================
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.volume = 0.7;
        this.isMuted = false;
        this.audioEnabled = false;
    }

    async loadSounds() {
        try {
            console.log('🎵 بدء تحميل الصوتيات...');
            
            // تحميل الأصوات من مجلد sounds/
            this.sounds['giftSound'] = new Audio('sounds/gift-open.mp3');
            this.sounds['celebrationSound'] = new Audio('sounds/celebration.mp3');
            this.sounds['hoverSound'] = new Audio(); // صوت افتراضي للتفاعل
            this.sounds['transitionSound'] = new Audio(); // صوت انتقالي
            this.sounds['popSound'] = new Audio(); // صوت فرقعة
            
            // تحميل الموسيقى الرئيسية
            this.music = new Audio('sounds/تامر حسني - كل سنة وانت طيب بدون موسيقى(360P).mp4');
            this.music.loop = true;
            this.music.volume = 0;
            
            // ضبط خصائص الأصوات
            Object.values(this.sounds).forEach(sound => {
                sound.preload = 'auto';
                sound.crossOrigin = 'anonymous';
            });
            
            this.music.preload = 'auto';
            this.music.crossOrigin = 'anonymous';
            
            // انتظار تحميل الصوتيات
            return new Promise((resolve) => {
                let loaded = 0;
                const total = 3; // giftSound + celebrationSound + music
                
                const checkLoaded = () => {
                    loaded++;
                    console.log(`📊 تحميل الصوت: ${loaded}/${total}`);
                    
                    if (loaded >= total) {
                        console.log('✅ الصوتيات جاهزة تقريبًا');
                        resolve();
                    }
                };
                
                // متابعة تحميل الملفات الرئيسية فقط
                this.sounds['giftSound'].addEventListener('canplaythrough', checkLoaded);
                this.sounds['celebrationSound'].addEventListener('canplaythrough', checkLoaded);
                this.music.addEventListener('canplaythrough', checkLoaded);
                
                this.sounds['giftSound'].addEventListener('error', (e) => {
                    console.warn('⚠️ gift-open.mp3 قد لا يكون موجودًا:', e);
                    checkLoaded();
                });
                
                this.sounds['celebrationSound'].addEventListener('error', (e) => {
                    console.warn('⚠️ celebration.mp3 قد لا يكون موجودًا:', e);
                    checkLoaded();
                });
                
                this.music.addEventListener('error', (e) => {
                    console.warn('⚠️ ملف الموسيقى قد لا يكون موجودًا:', e);
                    console.log('💡 تأكد أن اسم الملف: "تامر حسني - كل سنة وانت طيب بدون موسيقى(360P).mp4"');
                    checkLoaded();
                });
                
                // بدء تحميل الملفات
                this.sounds['giftSound'].load();
                this.sounds['celebrationSound'].load();
                this.music.load();
                
                // وقت انتظار أقصى 8 ثواني
                setTimeout(() => {
                    if (loaded < total) {
                        console.log(`⚠️ تحميل ${total - loaded} ملفات استغرق وقتًا طويلاً`);
                        resolve();
                    }
                }, 8000);
            });
        } catch (error) {
            console.log('❌ خطأ في تحميل الصوتيات:', error);
            return Promise.resolve();
        }
    }

    activateAudio() {
        if (!this.audioEnabled) {
            this.audioEnabled = true;
            console.log('✅ تفعيل الصوت');
            
            // تشغيل موسيقى خافتة للتأكد من عمل الصوت
            const testSound = new Audio();
            testSound.volume = 0.001;
            testSound.play().then(() => {
                console.log('✅ الصوت مفعل في المتصفح');
                testSound.pause();
            }).catch(e => {
                console.log('⚠️ قد تحتاج إلى تفعيل الصوت يدويًا:', e);
            });
        }
    }

    playSound(soundName, volume = 1) {
        if (this.isMuted || !this.audioEnabled) {
            console.log(`🔇 الصوت مكتوم أو غير مفعل: ${soundName}`);
            return null;
        }
        
        try {
            let sound;
            
            if (this.sounds[soundName] && soundName !== 'hoverSound' && soundName !== 'transitionSound' && soundName !== 'popSound') {
                // نسخ الملفات المحملة
                sound = this.sounds[soundName].cloneNode();
            } else {
                // إنشاء أصوات افتراضية
                sound = new Audio();
                
                if (soundName === 'hoverSound') {
                    // صوت تردد بسيط للتفاعل
                    this.createBeepSound(sound, 800, 0.05);
                } else if (soundName === 'transitionSound') {
                    // صوت انتقالي
                    this.createBeepSound(sound, 1200, 0.1);
                } else if (soundName === 'popSound') {
                    // صوت فرقعة
                    this.createPopSound(sound);
                }
            }
            
            sound.volume = Math.min(volume, this.volume);
            
            const playPromise = sound.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(e => {
                    if (e.name === 'NotAllowedError') {
                        console.log(`🔔 تحتاج إلى تفاعل للموسيقى: ${soundName}`);
                    }
                });
            }
            
            console.log(`🔊 تشغيل: ${soundName}`);
            return sound;
        } catch (error) {
            console.log(`⚠️ خطأ في ${soundName}:`, error);
            return null;
        }
    }

    createBeepSound(audioElement, frequency, duration) {
        // إنشاء صوت بسيط باستخدام Web Audio API إن أمكن
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
            
            // تحويل إلى MediaStream وإضافته للعنصر الصوتي
            const destination = audioContext.createMediaStreamDestination();
            oscillator.connect(destination);
            
            audioElement.srcObject = destination.stream;
        } catch (e) {
            console.log('⚠️ Web Audio API غير متاح، استخدام صوت افتراضي');
        }
    }

    createPopSound(audioElement) {
        this.createBeepSound(audioElement, 200, 0.1);
    }

    playMusic(volume = 0.4) {
        if (this.isMuted || !this.music || !this.audioEnabled) {
            console.log('🔇 الموسيقى مكتومة أو غير جاهزة');
            return;
        }
        
        try {
            this.music.volume = Math.min(volume, this.volume);
            this.music.currentTime = 0;
            
            const playPromise = this.music.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('🎵 موسيقى تامر حسني تشتغل');
                    window.birthdayExperience.isMusicPlaying = true;
                }).catch(e => {
                    console.log('❌ فشل تشغيل الموسيقى:', e);
                    
                    if (e.name === 'NotAllowedError') {
                        console.log('🔔 المتصفح يمنع التشغيل التلقائي.');
                        console.log('💡 اضغط على أي مكان في الصفحة لتفعيل الموسيقى');
                        
                        // إضافة مستمع لتفاعل المستخدم
                        document.addEventListener('click', () => {
                            this.music.play().then(() => {
                                console.log('✅ الموسيقى شُغّلت بعد التفاعل');
                                window.birthdayExperience.isMusicPlaying = true;
                            }).catch(e2 => {
                                console.log('❌ فشل بعد التفاعل:', e2);
                            });
                        }, { once: true });
                    }
                });
            }
        } catch (error) {
            console.log('❌ خطأ في تشغيل الموسيقى:', error);
        }
    }

    fadeOutMusic(duration = 3000) {
        if (!this.music) return;
        
        const startVolume = this.music.volume;
        const fadeStep = startVolume / (duration / 100);
        const fadeInterval = setInterval(() => {
            if (this.music.volume > 0.01) {
                this.music.volume -= fadeStep;
            } else {
                this.music.pause();
                this.music.currentTime = 0;
                window.birthdayExperience.isMusicPlaying = false;
                clearInterval(fadeInterval);
                console.log('🔇 الموسيقى توقفت');
            }
        }, 100);
    }

    setVolume(volume) {
        this.volume = volume;
        
        if (!this.isMuted && this.audioEnabled) {
            Object.values(this.sounds).forEach(sound => {
                if (sound.volume) sound.volume = volume;
            });
            
            if (this.music && window.birthdayExperience.isMusicPlaying) {
                this.music.volume = Math.min(0.4, volume);
            }
        }
        
        const slider = document.getElementById('volumeSlider');
        if (slider) slider.value = volume;
        
        console.log('🔊 مستوى الصوت:', volume);
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
        
        console.log('🔇 كتم كل الأصوات');
    }

    unmuteAll() {
        this.isMuted = false;
        
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
            if (sound.volume) sound.volume = this.volume;
        });
        
        if (this.music && window.birthdayExperience.isMusicPlaying && this.audioEnabled) {
            this.music.muted = false;
            this.music.volume = Math.min(0.4, this.volume);
            
            this.music.play().catch(e => {
                console.log('❌ فشل استئناف الموسيقى:', e);
            });
        }
        
        console.log('🔊 إلغاء كتم الأصوات');
    }

    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            window.birthdayExperience.isMusicPlaying = false;
        }
        
        console.log('⏹️ توقف كل الأصوات');
    }
}

// ============================================
// بدء التجربة
// ============================================
window.addEventListener('load', () => {
    console.log('🎉 بدء تحميل هدية عيد الميلاد...');
    console.log('✨ إعدادات الصوت:');
    console.log('- celebration.mp3: 5 ثواني فقط');
    console.log('- موسيقى تامر حسني: تبدأ في المشهد 4 وتستمر');
    console.log('- المشهد 5: موسيقى فقط (بدون celebration.mp3)');
    
    // فحص دعم الصوت
    if (!checkAudioSupport()) {
        const indicator = document.getElementById('audioIndicator');
        if (indicator) {
            indicator.innerHTML = '<span class="audio-status">⚠️ مشكلة في الصوت</span>';
            indicator.classList.add('show');
        }
    }
    
    window.birthdayExperience = new BirthdayExperience();
    
    // إضافة تفاعل لتفعيل الصوت
    document.body.addEventListener('click', function initAudio() {
        if (window.birthdayExperience && window.birthdayExperience.audioManager) {
            window.birthdayExperience.audioManager.activateAudio();
        }
        document.body.removeEventListener('click', initAudio);
    }, { once: true });
});