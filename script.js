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

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        // Simple mock responses
        setTimeout(() => {
            if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost')) {
                addMessage("Our Academy courses start from £499. Would you like me to send the full brochure via WhatsApp?");
            } else if (text.toLowerCase().includes('date') || text.toLowerCase().includes('when')) {
                addMessage("Our next Nanoplastia Masterclass is on May 11th and 14th. You can book directly in the 'Secure Your Date' section!");
            } else if (text.toLowerCase().includes('kit')) {
                addMessage("Yes! A professional Floractive kit (worth £250) is included with every Academy course.");
            } else {
                addMessage("That's a great question. Let me connect you with a specialist, or you can book an intro call!");
            }
        }, 1000);
    }

    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
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
