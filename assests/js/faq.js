class FAQs {
    constructor() {
      // Define categories with their Q&As.
      this.categories = [
        {
          title: "General Questions",
          questions: [
            {
              question: "What is the Social Media Bootcamp?",
              answer:
                "It’s a hands-on, fun course designed especially for influencers. You’ll pick up practical tips and insider tricks to help you shine online."
            },
            {
              question: "What is the Networking Community?",
              answer:
                "This is a lively group of entrepreneurs on WhatsApp who are all about supporting each other. Whether you’re after a business partner, investor, or a shortcut to success, you’re in good company."
            },
            {
              question: "What is \"Market & Competitor Insights\"?",
              answer:
                "We dive into the trends and see what your competitors are doing. This helps us figure out what your audience loves so we can craft stories that truly resonate. And yes, we cover all the market details—even the technical bits, if you’re curious!"
            },
            {
              question: "What are Tailored Scripts?",
              answer:
                "These are custom-made scripts written by our pro copywriters, created specifically to speak directly to your audience and make your message pop."
            },
            {
              question: "Do you do custom packages?",
              answer:
                "Absolutely! We can create a custom package that fits your unique needs."
            }
          ]
        },
        {
          title: "Influence",
          questions: [
            {
              question: "What are the Influence Packages?",
              answer:
                "They’re designed for service-based businesses ready to be the face of their own brand—helping you stand out as an influencer in your industry."
            },
            {
              question: "What are the Revisions?",
              answer:
                "We love your feedback! Our revisions let you tweak your scripts after they’re written, so your content perfectly reflects the image you want to share."
            },
            {
              question: "Why is Social Media Management Good with the Influence Packages?",
              answer:
                "Because smart management means better traction. With our insights and tools, we know what works and what doesn’t—helping your content connect with your audience effectively."
            },
            {
              question: "What is the Difference Between These Videography Sessions and Other Packages?",
              answer:
                "Our videography sessions are all about you. A professional videographer will coach you on how to speak, move, and act on camera to create authentic, engaging videos that tell your story."
            },
            {
              question: "What are the Feedback Reports?",
              answer:
                "These are detailed insights into how your page is performing. They show what’s working, what could use a tweak, and help track your growth over time."
            }
          ]
        },
        {
          title: "Product Ad Packages",
          questions: [
            {
              question: "Is the Product Package Good for Me?",
              answer:
                "If you run an e-commerce business or sell products, this package is designed to connect your product with the right audience."
            },
            {
              question: "What are Hooks & Concepts?",
              answer:
                "They’re the secret sauce behind a great video. We come up with multiple hooks around a strong concept to grab attention and ensure your ad truly stands out."
            },
            {
              question: "What Pairs Well with the Product Packages?",
              answer:
                "We recommend a professional videography session to capture your product’s story and emotion. Paired with smart targeting and tracking, it makes your ad campaign a total success."
            }
          ]
        },
        {
          title: "Product Feed Packages",
          questions: [
            {
              question: "What is the Main Purpose of These Packages?",
              answer:
                "They’re here to keep your brand’s page fresh and engaging. We fill it with professional photo sets and high-quality videos that showcase your products beautifully."
            }
          ]
        },
        {
          title: "One-Time Services",
          questions: [
            {
              question: "What is the Photography Service?",
              answer:
                "Perfect for any occasion where you need top-notch photos—be it events, business shoots, or anything else that calls for professional photography."
            },
            {
              question: "What Does Full Branding Include?",
              answer:
                "Our full branding service is a complete makeover for new or rebranding businesses. We turn your ideas into a vibrant brand, covering everything from logos and color palettes to market positioning and social media planning."
            },
            {
              question: "What Types of Websites Do You Do?",
              answer:
                "We build it all—from simple landing pages to full e-commerce sites and even complex web applications. Plus, we offer ongoing maintenance to keep everything running smoothly."
            },
            {
              question: "What are Deep Market Research Insights?",
              answer:
                "This service is for high-end brands looking to explore new markets. We provide detailed, strategic analysis to help you expand your reach."
            }
          ]
        }
      ];

          // We'll use all categories
          this.mainCategories = this.categories;
      
          // Get required elements.
          this.faQsContainer = document.querySelector('.faqs-container');
          this.mainView = document.getElementById('mainView');
          this.detailView = document.getElementById('detailView');
          this.questionsArea = document.getElementById('questionsArea');
          this.chatArea = document.getElementById('chatArea');
          this.backButton = document.getElementById('backButton');
      
          // Setup the profile section.
          this.setupProfile();
      
          // Use IntersectionObserver to add the "visible" class when in view.
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.faQsContainer.classList.add('visible');
                observer.disconnect();
              }
            });
          }, { threshold: 0.1 });
          observer.observe(this.faQsContainer);
      
          // Hide the main view and show the chat interface directly
          this.mainView.style.display = 'none';
          this.detailView.style.display = 'block';
          
          // Hide the back button since we'll handle navigation within the chat
          this.backButton.style.display = 'none';
          
          // Start the FAQ chat interface
          this.initializeChatInterface();
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
          // Insert the profile section before the detail view.
          this.faQsContainer.insertBefore(profileSection, this.detailView);
        }
      
        async initializeChatInterface() {
          // Display welcome message
          await this.displayWelcomeMessage();
          
          // Add category options
          this.displayCategoryOptions();
        }
      
        async displayWelcomeMessage() {
          // Add typing indicator
          const typingIndicator = this.createTypingIndicator();
          this.chatArea.appendChild(typingIndicator);
          
          // Wait a bit to simulate typing
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Remove typing indicator
          typingIndicator.remove();
          
          // Add welcome message
          await this.addMessage("Hello! I'm your FAQ Assistant. Please select a category to explore:", 'answer');
        }
      
        displayCategoryOptions() {
          // Clear previous questions
          this.questionsArea.innerHTML = '';
          
          // Add each category as a button
          this.mainCategories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = 'question-button';
            button.textContent = category.title;
            button.addEventListener('click', () => this.handleCategorySelection(index));
            this.questionsArea.appendChild(button);
          });
        }
      
        async handleCategorySelection(categoryIndex) {
          const category = this.mainCategories[categoryIndex];
          
          // Add the category selection as a user message
          await this.addMessage(category.title, 'questions');
          
          // Show typing indicator
          const typingIndicator = this.createTypingIndicator();
          this.chatArea.appendChild(typingIndicator);
          
          // Wait a bit to simulate typing
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Remove typing indicator
          typingIndicator.remove();
          
          // Show response about the category
          await this.addMessage(`Here are frequently asked questions about ${category.title}:`, 'answer');
          
          // Clear questions area
          this.questionsArea.innerHTML = '';
          
          // Add the questions for this category
          category.questions.forEach((qa, qIndex) => {
            const button = document.createElement('button');
            button.className = 'question-button';
            button.textContent = qa.question;
            button.addEventListener('click', () => this.handleQuestionSelection(categoryIndex, qIndex));
            this.questionsArea.appendChild(button);
          });
          
          // Add a "back to categories" button
          const backButton = document.createElement('button');
          backButton.className = 'question-button';
          backButton.textContent = 'Back to Categories';
          backButton.addEventListener('click', () => this.handleBackToCategories());
          this.questionsArea.appendChild(backButton);
        }
      
        async handleQuestionSelection(categoryIndex, questionIndex) {
          const category = this.mainCategories[categoryIndex];
          const qa = category.questions[questionIndex];
          
          // Disable all buttons temporarily
          const buttons = this.questionsArea.querySelectorAll('.question-button');
          buttons.forEach(button => button.disabled = true);
          
          // Add the question as a user message
          await this.addMessage(qa.question, 'questions');
          
          // Show typing indicator
          const typingIndicator = this.createTypingIndicator();
          this.chatArea.appendChild(typingIndicator);
          
          // Wait a bit to simulate typing
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Remove typing indicator
          typingIndicator.remove();
          
          // Show the answer
          await this.addMessage(qa.answer, 'answer');
          
          // Re-enable buttons
          buttons.forEach(button => button.disabled = false);
        }
      
        async handleBackToCategories() {
          // Add the "back" request as a user message
          await this.addMessage("Back to Categories", 'questions');
          
          // Show typing indicator
          const typingIndicator = this.createTypingIndicator();
          this.chatArea.appendChild(typingIndicator);
          
          // Wait a bit to simulate typing
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Remove typing indicator
          typingIndicator.remove();
          
          // Show response
          await this.addMessage("Here are all the FAQ categories:", 'answer');
          
          // Display category options again
          this.displayCategoryOptions();
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
              const type = () => {
                if (i < text.length) {
                  element.textContent += text.charAt(i);
                  i++;
                  // Update scroll position continuously
                  this.chatArea.scrollTop = this.chatArea.scrollHeight;
                  setTimeout(type, speed);
                } else {
                  resolve();
                }
              };
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
          
          // Ensure proper scrolling
          this.chatArea.scrollTop = this.chatArea.scrollHeight;
        }
      }
      
      document.addEventListener('DOMContentLoaded', () => {
        new FAQs();
      });