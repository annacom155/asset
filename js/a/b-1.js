    // 随机选择背景图片 (1~7.png)
        const bgImages = [
          '/a/1.png',
            '/a/2.png',
            '/a/3.png',
            '/a/4.png',
            '/a/5.png',
            '/a/6.png',
            '/a/7.png'
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