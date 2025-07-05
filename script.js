// Sample beats data - you can replace this with your actual beats
const beatsData = [
    {
        id: 1,
        title: "Cruel Summer",
        genre: "dark",
        duration: "3:07",
        audioUrl: "Cruel summer.mp3",
        downloadUrl: "Cruel summer.mp3",
        licenseUrl: "https://gumroad.com/l/ashes-ivory",
        description: "Drak r&b with smooth textures"
    },
    {
        id: 2,
        title: "WE$TSIDE NIGGA",
        genre: "melodic",
        duration: "2:55",
        audioUrl: "beats/WE$TSIDE NIGGA.mp3",
        downloadUrl: "beats/WE$TSIDE NIGGA.mp3",
        licenseUrl: "https://gumroad.com/l/midnight-echo",
        description: "Melodic as fuck"
    },
    {
        id: 3,
        title: "till i find my way",
        genre: "melodic",
        duration: "3:28",
        audioUrl: "beats/till i find my way prod. me.mp3",
        downloadUrl: "beats/till i find my way prod. me.mp3",
        licenseUrl: "https://gumroad.com/l/golden-hour",
        description: "Warm melodic composition with soulful mixing"
    },
    {
        id: 4,
        title: "Neon Dreams",
        genre: "experimental",
        duration: "5:02",
        audioUrl: "beats/neon-dreams.mp3",
        downloadUrl: "beats/neon-dreams.mp3",
        licenseUrl: "https://gumroad.com/l/neon-dreams",
        description: "Experimental electronic fusion with unique sound design"
    },
    {
        id: 5,
        title: "Shadow Dance",
        genre: "dark",
        duration: "3:55",
        audioUrl: "beats/shadow-dance.mp3",
        downloadUrl: "beats/shadow-dance.mp3",
        licenseUrl: "https://gumroad.com/l/shadow-dance",
        description: "Mysterious dark trap with cinematic elements"
    },
    {
        id: 6,
        title: "Serenity",
        genre: "melodic",
        duration: "4:18",
        audioUrl: "beats/serenity.mp3",
        downloadUrl: "beats/serenity.mp3",
        licenseUrl: "https://gumroad.com/l/serenity",
        description: "Peaceful melodic beat with ambient textures"
    }
];

// DOM Elements
const beatsGrid = document.getElementById('beatsGrid');
const searchInput = document.getElementById('searchBeats');
const filterButtons = document.querySelectorAll('.filter-btn');
const audioModal = document.getElementById('audioModal');
const modalAudio = document.getElementById('modalAudio');
const modalBeatTitle = document.getElementById('modalBeatTitle');
const downloadBtn = document.getElementById('downloadBtn');
const licenseBtn = document.getElementById('licenseBtn');
const closeModal = document.querySelector('.close-modal');
const contactForm = document.getElementById('contactForm');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// State
let currentFilter = 'all';
let filteredBeats = [...beatsData];
let currentBeat = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    renderBeats();
    setupEventListeners();
    setupSmoothScrolling();
    setupNavbarScroll();
});

// Setup all event listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', handleSearch);
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilter);
    });
    
    // Modal functionality
    closeModal.addEventListener('click', closeAudioModal);
    audioModal.addEventListener('click', function(e) {
        if (e.target === audioModal) {
            closeAudioModal();
        }
    });
    
    // Download and license buttons
    downloadBtn.addEventListener('click', handleDownload);
    licenseBtn.addEventListener('click', handleLicense);
    
    // Contact form
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Mobile menu
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// Render beats in the grid
function renderBeats() {
    beatsGrid.innerHTML = '';
    
    filteredBeats.forEach(beat => {
        const beatCard = createBeatCard(beat);
        beatsGrid.appendChild(beatCard);
    });
    
    // Add animation to cards
    const cards = document.querySelectorAll('.beat-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
    });
}

// Create a beat card element
function createBeatCard(beat) {
    const card = document.createElement('div');
    card.className = 'beat-card';
    card.setAttribute('data-genre', beat.genre);
    
    card.innerHTML = `
        <h3>${beat.title}</h3>
        <div class="genre">${beat.genre}</div>
        <div class="duration">${beat.duration}</div>
        <button class="play-btn" data-beat-id="${beat.id}">
            <i class="fas fa-play"></i>
            Play Beat
        </button>
    `;
    
    // Add click event to play button
    const playBtn = card.querySelector('.play-btn');
    playBtn.addEventListener('click', () => openAudioModal(beat));
    
    return card;
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    
    filteredBeats = beatsData.filter(beat => {
        const matchesSearch = beat.title.toLowerCase().includes(searchTerm) ||
                            beat.description.toLowerCase().includes(searchTerm) ||
                            beat.genre.toLowerCase().includes(searchTerm);
        
        const matchesFilter = currentFilter === 'all' || beat.genre === currentFilter;
        
        return matchesSearch && matchesFilter;
    });
    
    renderBeats();
}

// Handle filter functionality
function handleFilter(e) {
    const filter = e.target.getAttribute('data-filter');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = filter;
    
    // Filter beats
    if (filter === 'all') {
        filteredBeats = beatsData.filter(beat => {
            const searchTerm = searchInput.value.toLowerCase();
            return beat.title.toLowerCase().includes(searchTerm) ||
                   beat.description.toLowerCase().includes(searchTerm) ||
                   beat.genre.toLowerCase().includes(searchTerm);
        });
    } else {
        filteredBeats = beatsData.filter(beat => {
            const matchesFilter = beat.genre === filter;
            const searchTerm = searchInput.value.toLowerCase();
            const matchesSearch = beat.title.toLowerCase().includes(searchTerm) ||
                                beat.description.toLowerCase().includes(searchTerm) ||
                                beat.genre.toLowerCase().includes(searchTerm);
            
            return matchesFilter && matchesSearch;
        });
    }
    
    renderBeats();
}

// Open audio modal
function openAudioModal(beat) {
    currentBeat = beat;
    modalBeatTitle.textContent = beat.title;
    modalAudio.src = beat.audioUrl;
    modalAudio.load();
    
    // Update download and license URLs
    downloadBtn.setAttribute('data-url', beat.downloadUrl);
    licenseBtn.setAttribute('data-url', beat.licenseUrl);
    
    audioModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        audioModal.querySelector('.modal-content').style.opacity = '1';
        audioModal.querySelector('.modal-content').style.transform = 'translateY(0)';
    }, 10);
}

// Close audio modal
function closeAudioModal() {
    modalAudio.pause();
    modalAudio.currentTime = 0;
    
    audioModal.querySelector('.modal-content').style.opacity = '0';
    audioModal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        audioModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Handle download
function handleDownload() {
    if (currentBeat) {
        const link = document.createElement('a');
        link.href = currentBeat.downloadUrl;
        link.download = `${currentBeat.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Track download (you can add analytics here)
        console.log(`Downloaded: ${currentBeat.title}`);
    }
}

// Handle license
function handleLicense() {
    if (currentBeat) {
        window.open(currentBeat.licenseUrl, '_blank');
    }
}

// Handle contact form submission
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    // Here you would typically send this data to your server
    // For now, we'll just show a success message
    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup navbar scroll effect
function setupNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Mobile menu functionality
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

function closeMobileMenu() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}

// Add CSS for mobile menu
const mobileMenuCSS = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 100%;
            left: 0;
            width: 100%;
            background: var(--bg-darker);
            flex-direction: column;
            padding: 2rem;
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            border-top: 1px solid var(--border-color);
        }
        
        .nav-menu.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add mobile menu styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = mobileMenuCSS;
document.head.appendChild(styleSheet);

// Add fade-in animation for beat cards
const fadeInCSS = `
    .beat-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s ease;
    }
    
    .beat-card.fade-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .modal-content {
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    }
`;

const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = fadeInCSS;
document.head.appendChild(fadeInStyle);

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape' && audioModal.style.display === 'block') {
        closeAudioModal();
    }
    
    // Space bar to play/pause audio when modal is open
    if (e.key === ' ' && audioModal.style.display === 'block') {
        e.preventDefault();
        if (modalAudio.paused) {
            modalAudio.play();
        } else {
            modalAudio.pause();
        }
    }
});

// Audio preloading for better performance
function preloadAudio() {
    beatsData.forEach(beat => {
        const audio = new Audio();
        audio.src = beat.audioUrl;
        audio.preload = 'metadata';
    });
}

// Initialize audio preloading
setTimeout(preloadAudio, 2000);

// Add loading state for better UX
function showLoading() {
    beatsGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--accent-gold);"></i>
            <p style="margin-top: 1rem; color: var(--bone-dark);">Loading beats...</p>
        </div>
    `;
}

// Error handling for audio loading
modalAudio.addEventListener('error', function() {
    showNotification('Error loading audio file. Please try again.', 'error');
});

// Add error notification style
const errorCSS = `
    .notification.error {
        background: #e74c3c !important;
    }
`;

const errorStyle = document.createElement('style');
errorStyle.textContent = errorCSS;
document.head.appendChild(errorStyle);

console.log('MODERN SAINT - Beats Website Loaded Successfully!'); 