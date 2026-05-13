document.addEventListener('DOMContentLoaded', () => {
    // --- Navbar Scroll Effect ---
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.95)';
            nav.style.padding = '1rem 0';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
            nav.style.padding = '1.5rem 0';
        }
    });

    // --- Chatbot Toggle ---
    const chatTrigger = document.getElementById('chat-trigger');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('close-chat');

    chatTrigger.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'flex' ? 'none' : 'flex';
    });

    closeChat.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });

    // --- Simple Chatbot Logic ---
    const chatInput = document.getElementById('chat-input-field');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    function addMessage(text, isUser = false) {
        const msg = document.createElement('div');
        msg.className = `msg ${isUser ? 'msg-user' : 'msg-bot'}`;
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        // Add a "typing" indicator
        const typingMsg = document.createElement('div');
        typingMsg.className = 'msg msg-bot';
        typingMsg.textContent = '...';
        chatMessages.appendChild(typingMsg);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            console.log('Sending request to worker...');
            const response = await fetch('https://delicate-mode-60b7.cogniq-bharath.workers.dev', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({ message: text }),
            });

            if (!response.ok) {
                console.error('Worker responded with status:', response.status);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            chatMessages.removeChild(typingMsg);
            
            if (data.response) {
                addMessage(data.response);
            } else {
                addMessage("I'm sorry, I'm having a bit of trouble connecting. Could you try again?");
            }
        } catch (error) {
            chatMessages.removeChild(typingMsg);
            addMessage("Oops! Connection issue. Please check your internet or try again in a moment.");
            console.error('Chat error details:', error);
        }
    }

    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });

    // --- Clear Chat ---
    const clearChatBtn = document.getElementById('clear-chat');
    clearChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '<div class="msg msg-bot">Chat cleared. How else can I help you?</div>';
    });

    // --- Suggestion Chips ---
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chatInput.value = chip.textContent;
            handleChat();
        });
    });

    // --- Calendar Mockup Interaction ---
    const days = document.querySelectorAll('.day:not(.empty)');
    days.forEach(day => {
        day.addEventListener('click', () => {
            days.forEach(d => d.classList.remove('active'));
            day.classList.add('active');
            
            // Animation feedback
            day.style.transform = 'scale(1.1)';
            setTimeout(() => day.style.transform = 'scale(1)', 200);
        });
    });

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});
