		//Move Thumbs Gallery			
        if( $('.move-thumbs-wrapper').length > 0 ){
				
            if (!isMobile()) {
            
                function animateElements(moveThumbs, overlappingThumbs, moveThumbsParent) {
                    
                    moveThumbs.forEach((moveThumb, index) => {
                        const state = Flip.getState(moveThumb);
                        overlappingThumbs[index].appendChild(moveThumb);
                        
                        const moveAnimation = Flip.from(state, {
                            duration: 1,
                            ease: 'power4.inOut',
                        });
                        
                        const startOffset = moveThumbsParent[index].dataset.start;
                        const endOffset = moveThumbsParent[index].dataset.stop;
                        
                        ScrollTrigger.create({
                            trigger: moveThumbsParent[index], // Folosim fiecare element parent în parte
                            start: startOffset,
                            end: endOffset,
                            scrub: true,
                            animation: moveAnimation,
                        });
                    
                    });
            
                    gsap.to(startThumbsCaption, {				  
                        scrollTrigger: {
                            trigger: startThumbsCaption,
                            start: function() {
                                const startPin = (window.innerHeight - startThumbsCaption.offsetHeight) / 2;
                                return "top +=" + startPin;
                            },
                            end: function() {
                                const durationHeight = window.innerHeight;
                                return "+=" + durationHeight;
                            },
                            pin: true,
                            pinSpacing: false,
                            scrub: true,
                        },
                        opacity:0,	
                        ease: "power1.inOut",
                    });
              
                }
        
            
                const moveThumbsWrapper = document.querySelector('.move-thumbs-wrapper');
                const startThumbsCaption = document.querySelector('.start-thumbs-caption');
                const moveThumbsParent = document.querySelectorAll('.start-thumbs-wrapper .start-move-thumb');
                const moveThumbs = document.querySelectorAll('.start-thumbs-wrapper .move-thumb-inner');
                const endThumbsWrapper = document.querySelector('.end-thumbs-wrapper');		
                const overlappingThumbs = document.querySelectorAll('.end-thumbs-wrapper .end-move-thumb');
                
                animateElements(Array.from(moveThumbs), Array.from(overlappingThumbs), Array.from(moveThumbsParent));
            
            }
                      
        }	
        