       // 滚动动画
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.about, .projects, .contact');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            sections.forEach(section => {
                observer.observe(section);
            });

            // 模态框功能
            const modal = document.getElementById('video-modal');
            const openModalBtn = document.getElementById('open-modal');
            const closeModalBtn = document.getElementById('close-modal');

            // 点击第三个项目图片打开模态框
            openModalBtn.addEventListener('click', function() {
                modal.style.display = 'block';
                // 使用requestAnimationFrame确保显示后再添加active类
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // 防止背景滚动
                });
            });

            // 点击关闭按钮关闭模态框
            closeModalBtn.addEventListener('click', function() {
                modal.classList.remove('active');
                // 等待过渡动画完成后再隐藏模态框
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 500);
            });

            // 点击模态框外部关闭
            modal.addEventListener('click', function(e) {
                if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
                    modal.classList.remove('active');
                    // 等待过渡动画完成后再隐藏模态框
                    setTimeout(() => {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 500);
                }
            });

            // 暂停所有视频当模态框关闭
            modal.addEventListener('transitionend', function(e) {
                if (e.propertyName === 'opacity' && !modal.classList.contains('active')) {
                    const videos = modal.querySelectorAll('video');
                    videos.forEach(video => {
                        video.pause();
                    });
                }
            });

            // ESC键关闭模态框
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }, 500);
                }
            });
        });