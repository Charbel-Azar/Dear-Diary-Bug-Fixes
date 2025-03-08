 // Sample story data with mixed media types
    const stories = [
        {
            id: 1,  // New first item
            username: 'Add Story\u00A0\u00A0\u00A0\u00A0\u00A0↑',
            mediaUrl: 'assests/images/logo/white_transparent_logo.png',
            profilePic: 'assests/images/logo/black_transparent_logo.png', // Replace with your profile pic
            type: 'add-story',  // Special type for add story
            duration: 0,
            viewed: false
        },
        {
            id: 2,
            username: 'Uniting',
            mediaUrl: 'assests/images/ourstory/story (2).mp4',
            profilePic: 'assests/images/ourstory/ourstory1.png',
            type: 'video',
            duration: 7000, // 36 seconds
            viewed: false
        },
        {
            id: 3,
            username: 'Beginning',
            mediaUrl: 'assests/images/ourstory/story (3).mp4',
            profilePic: 'assests/images/ourstory/ourstory2.png',
            type: 'video',
            duration: 7000, // 36 seconds
            viewed: false
        },
        {
            id: 4,
            username: 'Learning',
            mediaUrl: 'assests/images/ourstory/story (1).mp4',
            profilePic: 'assests/images/ourstory/ourstory3.png',
            type: 'video',
            duration: 7000, // 36 seconds
            viewed: false
        },
        {
            id: 5,
            username: 'Growing',
            mediaUrl: 'assests/images/ourstory/story (4).mp4',
            profilePic: 'assests/images/ourstory/ourstory4.png',
            type: 'video',
            duration: 7000, // 36 seconds
            viewed: false
        }
    ];

    let currentStoryIndex = 0;
    let progressInterval;
    let videoElement = null;

    function createStories() {
        const container = document.getElementById('storiesContainer');
        container.innerHTML = ''; // Clear container first
        
        stories.forEach((story, index) => {
            const storyElement = document.createElement('div');
            storyElement.className = `story ${story.viewed ? 'viewed' : ''}`;
            
            // Construct the rotating ring (30 spans)
            let ringSpans = '';
            for (let i = 1; i <= 30; i++) {
                ringSpans += `<span style="--i:${i}"></span>`;
            }
            
            let storyHTML = `
                <!-- RING CONTAINER -->
                <div class="ring-container">
                    ${ringSpans}
                </div>
    
                <div class="story-border ${story.type === 'add-story' ? 'add-story-border' : ''}">
                    <div class="story-img-container">
                        <img class="story-img" src="${story.profilePic}" alt="${story.username}'s story">
                        ${story.type === 'add-story' ? '<button class="add-story-plus"></button>' : ''}
                    </div>
                </div>
                <div class="username">${story.username}</div>
            `;
    
            storyElement.innerHTML = storyHTML;
    
            storyElement.addEventListener('click', () => {
                if (story.type === 'add-story') {
                    window.location.href = 'https://wa.me/96171293786?text=Hey%21';
                } else {
                    storyElement.classList.add('active');
                    const rect = storyElement.getBoundingClientRect();
                    const clickX = (rect.left + rect.right) / 2;
                    const clickY = (rect.top + rect.bottom) / 2;
                    openStory(index, clickX, clickY);
                }
            });
            
            container.appendChild(storyElement);
        });
    }

    function openStory(index, clickX, clickY, direction = "right") {
        currentStoryIndex = index;
        const modal = document.getElementById('storyModal');
        const mediaContainer = document.getElementById('mediaContainer');
        const story = stories[index];

        // Use default center coordinates if not provided
        if (clickX === undefined || clickY === undefined) {
            clickX = window.innerWidth / 2;
            clickY = window.innerHeight / 2;
        }
        
        // Set the animation origin point for the modal's pop-in
        modal.style.setProperty('--x', clickX + 'px');
        modal.style.setProperty('--y', clickY + 'px');

        // Open the modal if it isn't already open
        if (modal.dataset.open !== 'true') {
            modal.style.display = 'block';
            // Force reflow
            modal.offsetHeight;
            modal.classList.add('animate-in');
            modal.dataset.open = 'true';  // Mark modal as open
        }
        
        // Clear previous media content
        mediaContainer.innerHTML = '';
        
        // Create new media element (video or image)
        let mediaElement;
        if (story.type === 'video') {
            mediaElement = document.createElement('video');
            mediaElement.className = 'story-media';
            mediaElement.src = story.mediaUrl;
            mediaElement.controls = false;
            mediaElement.autoplay = true;
            mediaElement.loop = true; 
            mediaElement.muted = true; // Mute the video completely
            videoElement = mediaElement;
        } else {
            mediaElement = document.createElement('img');
            mediaElement.className = 'story-media';
            mediaElement.src = story.mediaUrl;
        }

        // Apply slide-in animation based on direction if modal is already open
        if (modal.dataset.open === 'true') {
            if (direction === 'left') {
                mediaElement.classList.add('slide-in-left');
                setTimeout(() => mediaElement.classList.remove('slide-in-left'), 400);
            } else {
                mediaElement.classList.add('slide-in');
                setTimeout(() => mediaElement.classList.remove('slide-in'), 400);
            }
        }

        // Append the new media element to the container
        mediaContainer.appendChild(mediaElement);

        // Handle video or image progress
        if (story.type === 'video') {
            mediaElement.addEventListener('loadedmetadata', function() {
                // Always use the story's specified duration if > 0;
                // otherwise, fallback to the video's natural duration
                const forcedDuration = story.duration > 0
                    ? story.duration
                    : mediaElement.duration * 1000;

                startProgress(forcedDuration);
            });
            // No 'ended' event calling nextStory(), because we want to loop
            mediaElement.addEventListener('error', () => startProgress(story.duration));
        } else {
            // For images, just use the story's duration
            startProgress(story.duration);
        }
        
        markAsViewed(index);
    }

    function closeModal() {
        const modal = document.getElementById('storyModal');
        modal.classList.remove('animate-in');
        modal.classList.add('animate-out');

        // Remove .active from whichever story was open
        const allStories = document.querySelectorAll('.story');
        if (allStories[currentStoryIndex]) {
            allStories[currentStoryIndex].classList.remove('active');
        }
        
        // Wait for the collapse animation to complete before hiding the modal
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('animate-out');
            modal.removeAttribute('data-open');  // Reset the modal open flag
            clearInterval(progressInterval);
            if (videoElement) {
                videoElement.pause();
                videoElement = null;
            }
        }, 300);
    }

    // Start progress bar animation
    function startProgress(duration) {
        const progress = document.getElementById('progress');
        clearInterval(progressInterval);
        
        progress.style.transition = 'none';
        progress.style.transform = 'scaleX(0)';
        
        // Force reflow
        progress.offsetHeight;
        
        progress.style.transition = `transform ${duration}ms linear`;
        progress.style.transform = 'scaleX(1)';

        // When the story's duration completes, move to the next
        progressInterval = setTimeout(() => {
            nextStory();
        }, duration);
    }

    function nextStory() {
        if (currentStoryIndex < stories.length - 1) {
            // Remove ring animation from current, add to next
            const storyElements = document.querySelectorAll('.story');
            storyElements[currentStoryIndex].classList.remove('active');

            const nextIndex = currentStoryIndex + 1;
            storyElements[nextIndex].classList.add('active');

            // Use the bounding rect of the next story for the origin
            const rect = storyElements[nextIndex].getBoundingClientRect();
            openStory(nextIndex, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2, 'right');
        } else {
            closeModal();
        }
    }

    // Mark story as viewed
    function markAsViewed(index) {
        stories[index].viewed = true;
        const storyElements = document.querySelectorAll('.story');
        storyElements[index].classList.add('viewed');
    }

    // Navigation
    document.querySelector('.prev-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentStoryIndex > 0) {
            const storyElements = document.querySelectorAll('.story');
            // remove ring from current, add to previous
            storyElements[currentStoryIndex].classList.remove('active');
            const prevIndex = currentStoryIndex - 1;
            storyElements[prevIndex].classList.add('active');

            const rect = storyElements[prevIndex].getBoundingClientRect();
            openStory(prevIndex, (rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2, 'left');
        }
    });
    
    document.querySelector('.next-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentStoryIndex < stories.length - 1) {
            nextStory();
        } else {
            closeModal();
        }
    });

    // Close modal when clicking close button
    document.querySelector('.close-btn').addEventListener('click', closeModal);

    // Initialize stories on page load
    window.addEventListener('DOMContentLoaded', createStories);