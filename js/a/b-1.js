document.addEventListener('DOMContentLoaded', function() {
            const leftEye = document.getElementById('left-eye');
            const rightEye = document.getElementById('right-eye');
            const leftIris = leftEye.querySelector('.iris');
            const rightIris = rightEye.querySelector('.iris');
            const leftPupil = leftEye.querySelector('.pupil');
            const rightPupil = rightEye.querySelector('.pupil');
            const avatar = document.getElementById('avatar');
            
            // 计算眼睛中心位置
            function getEyeCenter(eyeElement) {
                const rect = eyeElement.getBoundingClientRect();
                return {
                    x: rect.left + rect.width / 2,
                    y: rect.top + rect.height / 2
                };
            }
            
            // 移动虹膜和瞳孔
            function moveEye(eye, iris, pupil, mouseX, mouseY) {
                const eyeRect = eye.getBoundingClientRect();
                const eyeCenterX = eyeRect.left + eyeRect.width / 2;
                const eyeCenterY = eyeRect.top + eyeRect.height / 2;
                
                // 计算鼠标相对于眼睛中心的角度
                const deltaX = mouseX - eyeCenterX;
                const deltaY = mouseY - eyeCenterY;
                const angle = Math.atan2(deltaY, deltaX);
                
                // 计算移动的最大距离（眼球半径 - 虹膜半径）
                const maxMove = (eyeRect.width / 2) - (iris.offsetWidth / 2);
                
                // 计算移动距离（根据鼠标距离调整移动幅度）
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 200);
                const moveFactor = distance / 200;
                
                const moveX = Math.cos(angle) * maxMove * moveFactor;
                const moveY = Math.sin(angle) * maxMove * moveFactor;
                
                // 应用移动
                iris.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
                
                // 瞳孔的微动（比虹膜移动幅度小，增加真实感）
                const pupilMoveX = moveX * 0.3;
                const pupilMoveY = moveY * 0.3;
                pupil.style.transform = `translate(calc(-50% + ${pupilMoveX}px), calc(-50% + ${pupilMoveY}px))`;
            }
            
            // 监听鼠标移动
            document.addEventListener('mousemove', function(e) {
                moveEye(leftEye, leftIris, leftPupil, e.clientX, e.clientY);
                moveEye(rightEye, rightIris, rightPupil, e.clientX, e.clientY);
            });
            
            // 随机选择背景图片 (1~7.png)
            const bgImages = [
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/1.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/2.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/3.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/4.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/5.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/6.png',
                'https://cdn.jsdmirror.com/gh/annacom155/asset@main/png/a/7.png'
            ];
            
            // 随机选择一张图片
            const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];
            document.getElementById('random-bg').style.backgroundImage = `url('${randomBg}')`;
            
            // 添加点击复制Session ID的功能
            document.querySelector('.session-id').addEventListener('click', function() {
                const sessionId = this.textContent;
                navigator.clipboard.writeText(sessionId).then(() => {
                    const originalText = this.textContent;
                    this.textContent = '已复制到剪贴板！';
                    this.style.background = '#4CAF50';
                    this.style.color = 'white';
                    
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.background = '#f5f5f5';
                        this.style.color = '#333';
                    }, 1500);
                });
            });
            
            // 添加滚动视差效果
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const card = document.querySelector('.business-card');
                card.style.transform = `translateY(${scrolled * 0.05}px)`;
            });
            
            // 添加眨眼效果
            function blink() {
                const eyes = document.querySelectorAll('.eye');
                
                eyes.forEach(eye => {
                    eye.style.transition = 'height 0.2s ease';
                    eye.style.height = '5px';
                    
                    setTimeout(() => {
                        eye.style.height = '45px';
                    }, 200);
                });
                
                // 随机眨眼间隔（3-8秒）
                const nextBlink = 3000 + Math.random() * 5000;
                setTimeout(blink, nextBlink);
            }
            
            // 开始眨眼
            setTimeout(blink, 3000);
        });