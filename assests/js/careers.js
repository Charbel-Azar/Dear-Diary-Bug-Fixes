const questions = [
    {
        question: "Which of these sounds like your dream task?",
        options: [
            {
                text: "Making designs that make people say, 'Wow, who made this?!'",
                background: "url('./assests/images/questions/graphic.jpg')",
                score: { graphic: 2 }
            },
            {
                text: "Taking raw footage and transforming it into pure storytelling magic.",
                background: "url('./assests/images/questions/videoediting.jpg')",
                score: { videoEditor: 2 }
            },
            {
                text: "Filming and editing videos that turn ordinary moments into cinematic masterpieces.",
                background: "url('./assests/images/questions/photographer.jpg')",
                score: { videographer: 2 }
            },
            {
                text: "Writing lines of code that give birth to crazy looking websites.",
                background: "url('./assests/images/questions/webdev.jpg')",
                score: { softwareDeveloper: 2 }
            },
            {
                text: "Creating viral content that makes people stop scrolling and go 'OMG, I NEED to share this!'",
                background: "url('./assests/images/questions/socialmedia.jpg')",
                score: { socialMedia: 2 }
            }
        ]
    },
    {
        question: "If you were stuck on a desert island, which software would you take with you?",
        options: [
            {
                text: "Adobe Illustrator, logos arent gonna make themselves",
                background: "url('./assests/images/questions/graphic1.jpg')",
                score: { graphic: 2 }
            },
            {
                text: "Adobe Premiere Pro - Because even my rescue story needs seamless transitions and killer effects.",
                background: "url('./assests/images/questions/videoediting2.jpg')",
                score: { videoEditor: 2 }
            },
            {
                text: "Final Cut Pro to document and edit my survival journey in 4K.",
                background: "url('./assests/images/questions/photographer2.jpg')",
                score: { videographer: 2 }
            },
            {
                text: "HTML and CSS, obviously id just change the background and ill be back home",
                background: "url('./assests/images/questions/webdev2.jpg')",
                score: { softwareDeveloper: 2 }
            },
            {
                text: "Instagram - Because if I don't post it, did I even survive?",
                background: "url('./assests/images/questions/socialmedia2.jpg')",
                score: { socialMedia: 2 }
            }
        ]
    },
    {
        question: "How do you know you've nailed your work?",
        options: [
            {
                text: "When my design looks so good, even Comic Sans is jealous.",
                background: "url('./assests/images/questions/graphic2.jpg')",
                score: { graphic: 2 }
            },
            {
                text: "When the cuts are so clean that even Scorsese would approve.",
                background: "url('./assests/images/questions/videoediting3.jpg')",
                score: { videoEditor: 2 }
            },
            {
                text: "When my video makes people cry happy tears and replay it five times.",
                background: "url('./assests/images/questions/photographer3.jpg')",
                score: { videographer: 2 }
            },
            {
                text: "When my code runs without errors, and I do a little victory dance.",
                background: "url('./assests/images/questions/webdev3.jpg')",
                score: { softwareDeveloper: 2 }
            },
            {
                text: "When my post gets 100+ shares and a flood of DMs asking for more.",
                background: "url('./assests/images/questions/socialmedia3.jpg')",
                score: { socialMedia: 2 }
            }
        ]
    },
    {
        question: "What's your creative spirit animal?",
        options: [
            {
                text: "A chameleon - always adapting colors and styles!",
                background: "url('./assests/images/questions/graphic3.jpg')",
                score: { graphic: 2 }
            },
            {
                text: "An eagle - capturing everything from the perfect angle.",
                background: "url('./assests/images/questions/videoediting4.jpg')",
                score: { videoEditor: 2 }
            },
            {
                text: "A hummingbird - fast, precise, and constantly making cuts.",
                background: "url('./assests/images/questions/photographer3.jpg')",
                score: { videographer: 2 }
            },
            {
                text: "An octopus - multi-tasking with a million open tabs.",
                background: "url('./assests/images/questions/webdev4.jpg')",
                score: { softwareDeveloper: 2 }
            },
            {
                text: "A parrot - talking, engaging, and keeping the buzz alive!",
                background: "url('./assests/images/questions/socialmedia4.jpg')",
                score: { socialMedia: 2 }
            }
        ]
    },
    {
        question: "What excites you most about joining Dear Diary Media?",
        options: [
            {
                text: "Making brands look so good that even Picasso would approve.",
                background: "url('./assests/images/questions/graphic4.jpg')",
                score: { graphic: 2 }
            },
            {
                text: "Editing footage so smoothly that people don't even notice the jump cuts.",
                background: "url('./assests/images/questions/videoediting5.jpg')",
                score: { videoEditor: 2 }
            },
            {
                text: "Creating videos so engaging that Netflix might steal our ideas.",
                background: "url('./assests/images/questions/photographer5.jpg')",
                score: { videographer: 2 }
            },
            {
                text: "Building digital magic that makes our marketing efforts smoother than a fresh cup of coffee.",
                background: "url('./assests/images/questions/webdev5.jpg')",
                score: { softwareDeveloper: 2 }
            },
            {
                text: "Growing online communities and making 'going viral' an everyday thing.",
                background: "url('./assests/images/questions/socialmedia5.jpg')",
                score: { socialMedia: 2 }
            }
        ]
    }
];

// Define career positions
const positions = {
    graphic: {
        title: "Graphic Designer",
        description: "Craft visually stunning designs that captivate and inspire audiences. Ideal for creative minds with an eye for detail.",
        background: "url('path/to/graphic-designer-position.jpg')"
    },
    videoEditor: {
        title: "Video Editor",
        description: "Transform raw footage into compelling narratives. Perfect for those who love precision, creativity, and storytelling.",
        background: "url('path/to/video-editor-position.jpg')"
    },
    videographer: {
        title: "Videographer",
        description: "Capture moments and turn them into cinematic stories. Great for individuals with a passion for filming and visual artistry.",
        background: "url('path/to/videographer-position.jpg')"
    },
    softwareDeveloper: {
        title: "Software Developer",
        description: "Develop and maintain cutting-edge digital solutions. Perfect for problem solvers who thrive in a dynamic tech environment.",
        background: "url('path/to/software-developer-position.jpg')"
    },
    socialMedia: {
        title: "Social Media Manager",
        description: "Engage online communities and drive brand conversations. Ideal for energetic individuals who excel in digital engagement.",
        background: "url('path/to/social-media-position.jpg')"
    }
};

// Initialize state
let currentQuestion = 0;
let userScores = {
    graphic: 0,
    videoEditor: 0,
    videographer: 0,
    softwareDeveloper: 0,
    socialMedia: 0
};

// Show question and handle background images
function showQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const question = questions[currentQuestion];
  
    const newContent = `
      <div class="question">${question.question}</div>
      <div class="options-container">
        ${question.options.map((option, index) => `
          <button 
            class="option-btn" 
            data-background="${option.background}"
            onmouseover="handleOptionHover(this, true)"
            onmouseout="handleOptionHover(this, false)"
            onclick="selectOption(${index})"
          >${option.text}</button>
        `).join('')}
      </div>
      <div class="skip-button-container">
        <button class="skip-btn" onclick="showAllPositions()">Too Lazy?</button>
      </div>
      <div class="option-background"></div>
    `;
  
    // For the very first question, simply set content and trigger fade-in.
    if (currentQuestion === 0) {
      questionContainer.innerHTML = newContent;
      questionContainer.classList.remove('fade-out');
      questionContainer.classList.add('fade-in');
      return;
    }
  
    // For subsequent questions, fade-out first.
    questionContainer.classList.remove('fade-in');
    questionContainer.classList.add('fade-out');
  
    // Wait for fade-out animation to finish before updating content.
    questionContainer.addEventListener('animationend', function handler() {
      // Remove this event listener so it doesn't trigger for other animations.
      questionContainer.removeEventListener('animationend', handler);
      // Update content and trigger fade-in.
      questionContainer.innerHTML = newContent;
      questionContainer.classList.remove('fade-out');
      questionContainer.classList.add('fade-in');
    });
  }
  

// Handle option hover effects
function handleOptionHover(button, isHovering) {
    const background = button.closest('.question-container')?.querySelector('.option-background');
    const backgroundImage = button.getAttribute('data-background');

    if (background) {
        if (isHovering) {
            background.style.backgroundImage = backgroundImage;
            background.style.opacity = '1';
            button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        } else {
            background.style.opacity = '0';
            button.style.backgroundColor = 'transparent';
        }
    }
}

// Handle option selection
function selectOption(optionIndex) {
    const question = questions[currentQuestion];
    const selectedOption = question.options[optionIndex];

    // Update scores
    Object.entries(selectedOption.score).forEach(([category, points]) => {
        userScores[category] += points;
    });

    // Visual feedback
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[optionIndex].classList.add('selected');

    // Transition effect
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            const questionContainer = document.getElementById('questionContainer');
            questionContainer.classList.add('fade-out');
            setTimeout(showResults, 500);
        }
    }, 800);
}

// Show results after quiz is complete, with a reset button
function showResults() {
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');

    questionContainer.style.display = 'none';

    // Get top 2 positions based on scores
    const topPositions = Object.entries(userScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([position]) => position);

    resultContainer.innerHTML = `
        <h2 class="results-title">Here are your perfect matches!</h2>
        ${topPositions.map(position => `
            <div class="position-card" 
                 onmouseover="handleCardHover(this, true)"
                 onmouseout="handleCardHover(this, false)"
                 data-background="${positions[position].background}">
                <div class="position-content">
                    <h3 class="position-title">${positions[position].title}</h3>
                    <p class="position-description">${positions[position].description}</p>
                    <button class="apply-btn" onclick="applyForPosition('${position}')">
                        Apply Now
                    </button>
                </div>
                <div class="card-background"></div>
            </div>
        `).join('')}
        <div class="reset-button-container">
            <button class="skip-btn" onclick="resetQuiz()">Reset Quiz</button>
        </div>
    `;

    resultContainer.style.display = 'block';
    setTimeout(() => resultContainer.classList.add('active'), 50);
}

// Handle "Too Lazy?" positions view (skip) with reset button at the bottom
function showAllPositions() {
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');

    questionContainer.classList.add('fade-out');
    setTimeout(() => {
        questionContainer.style.display = 'none';

        resultContainer.innerHTML = `
            <h2 class="results-title">All Available Positions</h2>
            ${Object.entries(positions).map(([key, position]) => `
                <div class="position-card" 
                     onmouseover="handleCardHover(this, true)"
                     onmouseout="handleCardHover(this, false)"
                     data-background="${position.background}">
                    <div class="position-content">
                        <h3 class="position-title">${position.title}</h3>
                        <p class="position-description">${position.description}</p>
                        <button class="apply-btn" onclick="applyForPosition('${key}')">
                            Apply Now
                        </button>
                    </div>
                    <div class="card-background"></div>
                </div>
            `).join('')}
            <div class="reset-button-container">
                <button class="skip-btn" onclick="resetQuiz()">Reset Quiz</button>
            </div>
        `;

        resultContainer.style.display = 'block';
        setTimeout(() => resultContainer.classList.add('active'), 50);
    }, 500);
}

// Handle result card hover effects
function handleCardHover(card, isHovering) {
    const background = card.querySelector('.card-background');
    const backgroundImage = card.getAttribute('data-background');

    if (isHovering) {
        background.style.backgroundImage = backgroundImage;
        background.style.opacity = '1';
    } else {
        background.style.opacity = '0';
    }
}

// Handle job application
function applyForPosition(position) {
    const roleTitle = positions[position].title;
    const subject = encodeURIComponent(`Application for ${roleTitle}`);
    const body = encodeURIComponent(
        `Dear Dear Diary Team,\n\n` +
        `I am excited to apply for the ${roleTitle} position.\n\n` +
        `Best regards,\n[Your Name]`
    );

    window.location.href = `mailto:careers@deardiary.com?subject=${subject}&body=${body}`;
    alert(`Thanks for your interest in the ${roleTitle} position! Our team will be in touch soon.`);
}

// Reset the quiz to the initial state
function resetQuiz() {
    currentQuestion = 0;
    userScores = {
        graphic: 0,
        videoEditor: 0,
        videographer: 0,
        softwareDeveloper: 0,
        socialMedia: 0
    };

    // Hide the result container and show the question container again
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.remove('active');
    setTimeout(() => {
        resultContainer.style.display = 'none';
        const questionContainer = document.getElementById('questionContainer');
        questionContainer.style.display = 'block';
        showQuestion();
    }, 500);
}

// Start the quiz on page load
document.addEventListener('DOMContentLoaded', showQuestion);
