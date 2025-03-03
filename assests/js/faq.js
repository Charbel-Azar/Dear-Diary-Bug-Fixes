class FAQs {
    constructor() {
        this.questions = [
            {
                question: "What services do you offer?",
                answer: "We offer comprehensive digital marketing solutions including SEO, social media management, content marketing, PPC advertising, and email marketing campaigns."
            },
            {
                question: "How long until I see results?",
                answer: "While initial improvements can be seen within 1-2 months, significant results typically become visible within 3-6 months of consistent digital marketing efforts."
            },
            {
                question: "Do you offer custom packages?",
                answer: "Yes! We create tailored marketing strategies based on your business goals, target audience, and budget. Each package is customized to meet your specific needs."
            },
            {
                question: "How do you measure success?",
                answer: "We track various KPIs including website traffic, conversion rates, engagement metrics, ROI, and provide detailed monthly reports with actionable insights."
            },
            {
                question: "What makes you different?",
                answer: "We combine data-driven strategies with creative excellence, offering personalized attention and transparent communication throughout our partnership."
            }
        ];

        this.chatArea = document.getElementById('chatArea');
        this.questionsArea = document.getElementById('questionsArea');
        this.initialized = false;
        
        this.setupProfile();
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.initialized) {
                    this.initialize();
                    this.initialized = true;
                    observer.disconnect();
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(document.querySelector('.faqs-container'));
    }

    setupProfile() {
        const profileSection = document.createElement('div');
        profileSection.className = 'profile-section';
        
        profileSection.innerHTML = `
            <div class="profile-image">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
            </div>
            <div class="profile-info">
                <div class="profile-name">FAQ Assistant</div>
                <div class="profile-status">AI Assistant</div>
            </div>
        `;
        
        document.querySelector('.faqs-container').insertBefore(profileSection, this.chatArea);
    }

    async initialize() {
        document.querySelector('.faqs-container').classList.add('visible');
        
        await this.addMessage("Hello! I'm your FAQ assistant. How can I help you today?", 'answer');
        
        this.questions.forEach((qa, index) => {
            const button = document.createElement('button');
            button.className = 'question-button';
            button.textContent = qa.question;
            button.addEventListener('click', () => this.handleQuestion(index));
            this.questionsArea.appendChild(button);
        });
    }

    createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        return typingDiv;
    }

    async typeWriter(element, text, speed = 15) {
        let i = 0;
        element.textContent = '';
        
        return new Promise(resolve => {
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }
            type();
        });
    }

    async addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        this.chatArea.appendChild(messageDiv);
        
        if (type === 'answer') {
            await this.typeWriter(messageDiv, text);
        } else {
            messageDiv.textContent = text;
        }
        
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }

    async handleQuestion(index) {
        const qa = this.questions[index];
        
        const buttons = this.questionsArea.querySelectorAll('.question-button');
        buttons.forEach(button => button.disabled = true);
        
        await this.addMessage(qa.question, 'questions');
        
        const typingIndicator = this.createTypingIndicator();
        this.chatArea.appendChild(typingIndicator);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        await new Promise(resolve => setTimeout(resolve, 800));
        
        typingIndicator.remove();
        await this.addMessage(qa.answer, 'answer');

        buttons.forEach(button => button.disabled = false);
    }
}

// Initialize the FAQ chat
document.addEventListener('DOMContentLoaded', () => {
    new FAQs();
});