// ===== NAVIGATION TRACKING =====
let clickedButtons = {
    char1: false,
    char2: false,
    char3: false
};
let popupStage = 1;

// ===== CHERRY BLOSSOMS ANIMATION =====
function createCherryBlossoms() {
    const container = document.getElementById('cherryBlossoms');
    const numberOfBlossoms = 30;
    
    for (let i = 0; i < numberOfBlossoms; i++) {
        const blossom = document.createElement('div');
        blossom.className = 'cherry-blossom';
        
        const img = document.createElement('img');
        img.src = 'assets/cherry-blossom.gif';
        img.alt = '🌸';
        img.onerror = function() {
            // Fallback to text emoji if GIF not found
            this.style.display = 'none';
            blossom.textContent = '🌸';
            blossom.style.fontSize = '25px';
        };
        
        blossom.appendChild(img);
        
        // Random horizontal position
        blossom.style.left = Math.random() * 100 + '%';
        
        // Random animation delay
        blossom.style.animationDelay = Math.random() * 10 + 's';
        
        // Random animation duration (falling speed)
        const duration = 15 + Math.random() * 10; // 15-25 seconds
        blossom.style.animationDuration = duration + 's';
        
        // Random horizontal sway
        const sway = (Math.random() - 0.5) * 200; // -100px to 100px
        blossom.style.setProperty('--sway', sway + 'px');
        
        container.appendChild(blossom);
    }
}

// ===== SECTION NAVIGATION =====
function navigateTo(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    setTimeout(() => {
        document.getElementById(sectionId).classList.add('active');
        
        // Special handling for section 12 (petals)
        if (sectionId === 'section12') {
            createPetals();
        }
    }, 100);
}

// ===== CHARACTER BUTTON TRACKING =====
function clickCharacter(charNum, targetSection) {
    clickedButtons['char' + charNum] = true;
    const button = document.getElementById('btn-char' + charNum);
    button.style.opacity = '0.5';
    button.disabled = true;
    
    navigateTo(targetSection);
    
    // Check if all three buttons are clicked
    if (clickedButtons.char1 && clickedButtons.char2 && clickedButtons.char3) {
        // Delay popup to allow user to return to section 6
        setTimeout(() => {
            const activeSections = ['section6', 'section7', 'section8', 'section9'];
            const isInNotesSections = activeSections.some(id => 
                document.getElementById(id).classList.contains('active')
            );
            
            if (isInNotesSections) {
                showPopup();
            }
        }, 3000); // Changed from 500ms to 3000ms (3 seconds)
    }
}

// ===== POPUP CONTROLS =====
function showPopup() {
    document.getElementById('popup10').classList.add('active');
}

function popupNext() {
    const popupText = document.getElementById('popup-text');
    const popupBtn = document.getElementById('popup-btn');
    
    if (popupStage === 1) {
        popupText.textContent = 'hmm... I think a special surprise!';
        popupBtn.textContent = 'tell me more!';
        popupStage = 2;
    } else if (popupStage === 2) {
        popupText.textContent = 'You\'ve explored all my little notes... 💌';
        popupBtn.textContent = 'and?';
        popupStage = 3;
    } else if (popupStage === 3) {
        popupText.textContent = 'You\'ve seen the memories, heard the song...';
        popupBtn.textContent = 'yes...';
        popupStage = 4;
    } else if (popupStage === 4) {
        popupText.textContent = 'Now there\'s something really important I want to ask you...';
        popupBtn.textContent = 'what is it? 💕';
        popupStage = 5;
    } else if (popupStage === 5) {
        popupText.textContent = 'Are you ready? 🥺';
        popupBtn.textContent = 'yes, I\'m ready!';
        popupStage = 6;
    } else {
        document.getElementById('popup10').classList.remove('active');
        navigateTo('section11');
        popupStage = 1;
    }
}

// ===== AUDIO PLAYER CONTROLS =====
const audioPlayer = document.getElementById('audioPlayer');
const albumArtContainer = document.querySelector('.album-art-container');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const progressFill = document.getElementById('progressFill');
const currentTimeDisplay = document.getElementById('currentTime');
const totalTimeDisplay = document.getElementById('totalTime');

let isPlaying = false;

function togglePlay() {
    if (!audioPlayer) return;
    
    if (isPlaying) {
        audioPlayer.pause();
        if (playIcon) playIcon.textContent = '▶';
        if (albumArtContainer) albumArtContainer.classList.remove('spinning');
        isPlaying = false;
    } else {
        audioPlayer.play().then(() => {
            if (playIcon) playIcon.textContent = '⏸';
            if (albumArtContainer) albumArtContainer.classList.add('spinning');
            isPlaying = true;
        }).catch(err => {
            console.error('Audio playback failed:', err);
        });
    }
}

// Audio event listeners
if (audioPlayer) {
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = formatTime(audioPlayer.duration);
        }
    });

    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        if (playIcon) playIcon.textContent = '⏸';
        if (albumArtContainer) albumArtContainer.classList.add('spinning');
    });

    audioPlayer.addEventListener('pause', () => {
        isPlaying = false;
        if (playIcon) playIcon.textContent = '▶';
        if (albumArtContainer) albumArtContainer.classList.remove('spinning');
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (progressFill) {
            progressFill.style.width = progress + '%';
        }
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(audioPlayer.currentTime);
        }
        
        // Update lyrics based on current time
        updateLyrics(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('ended', () => {
        if (playIcon) playIcon.textContent = '▶';
        if (albumArtContainer) albumArtContainer.classList.remove('spinning');
        isPlaying = false;
        if (progressFill) progressFill.style.width = '0%';
    });

    // Click progress bar to seek
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percentage = clickX / rect.width;
            audioPlayer.currentTime = percentage * audioPlayer.duration;
        });
    }
}

// Format time helper
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== LYRICS DISPLAY WITH EXACT SONG LYRICS =====
// Complete lyrics for "The Way I Love You" by Michal Leah with accurate timestamps
const lyrics = [
    { time: 0, text: "Mmm, mmm" },
    { time: 6, text: "We've yelled words we shouldn't" },
    { time: 11, text: "We fought for the best" },
    { time: 15, text: "Those tears we were crying" },
    { time: 19, text: "Both happy and sad" },
    { time: 23, text: "Oh, time, it stops and people fade" },
    { time: 28, text: "when you step in a room" },
    { time: 32, text: "I don't love anyone the way I love you" },
    { time: 38, text: "We don't fear the silence" },
    { time: 42, text: "You read like a book" },
    { time: 46, text: "I last a decade" },
    { time: 49, text: "On one of those looks" },
    { time: 53, text: "I would give the ocean up" },
    { time: 56, text: "to swim in your blues" },
    { time: 60, text: "I don't love anyone the way I love you" },
    { time: 66, text: "The way I love you" },
    { time: 72, text: "The way I" },
    { time: 76, text: "If I know what love is" },
    { time: 79, text: "it's because of you" },
    { time: 83, text: "You light my fire" },
    { time: 86, text: "yeah, that's the whole truth" },
    { time: 90, text: "I know it's easy to get lost" },
    { time: 93, text: "in all of the issues" },
    { time: 97, text: "I'll tell the whole world" },
    { time: 101, text: "Top of my lungs" },
    { time: 104, text: "Past, present, future" },
    { time: 108, text: "They know you're the one" },
    { time: 112, text: "Doesn't take a diamond ring" },
    { time: 115, text: "to say that I do" },
    { time: 119, text: "I don't love anyone" },
    { time: 124, text: "No, I don't love anyone" },
    { time: 130, text: "I don't love anyone the way I love you, mm" },
    { time: 138, text: "Da, da da da, da da da" },
    { time: 144, text: "Mm, mm" },
    { time: 150, text: "♪ ♪ ♪" }
];

function updateLyrics(currentTime) {
    const lyricsContainer = document.getElementById('lyricsContainer');
    
    if (!lyricsContainer) return;
    
    // Clear existing items
    lyricsContainer.innerHTML = '';
    
    // Find current lyric line (the one currently playing)
    let currentIndex = -1;
    for (let i = lyrics.length - 1; i >= 0; i--) {
        if (currentTime >= lyrics[i].time) {
            currentIndex = i;
            break;
        }
    }
    
    // Show previous line, current line, and next 3-4 lines
    const startIndex = Math.max(0, currentIndex - 1);
    const endIndex = Math.min(lyrics.length, currentIndex + 5);
    
    // If at the beginning, show first few lines
    if (currentIndex < 0) {
        for (let i = 0; i < Math.min(6, lyrics.length); i++) {
            createLyricItem(i, false, lyricsContainer);
        }
        return;
    }
    
    // Display lyrics with current line highlighted
    for (let i = startIndex; i < endIndex; i++) {
        const isActive = (i === currentIndex);
        createLyricItem(i, isActive, lyricsContainer);
    }
    
    // If no lyrics, show placeholder
    if (lyricsContainer.children.length === 0) {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        
        const trackNumber = document.createElement('span');
        trackNumber.className = 'track-number';
        trackNumber.textContent = '♪';
        
        const trackName = document.createElement('span');
        trackName.className = 'track-name';
        trackName.textContent = 'Press play to see lyrics';
        
        const trackDuration = document.createElement('span');
        trackDuration.className = 'track-duration';
        trackDuration.textContent = '0:00';
        
        item.appendChild(trackNumber);
        item.appendChild(trackName);
        item.appendChild(trackDuration);
        
        lyricsContainer.appendChild(item);
    }
}

function createLyricItem(index, isActive, container) {
    const item = document.createElement('div');
    item.className = 'playlist-item';
    if (isActive) {
        item.classList.add('active');
    }
    
    const trackNumber = document.createElement('span');
    trackNumber.className = 'track-number';
    trackNumber.textContent = index + 1;
    
    const trackName = document.createElement('span');
    trackName.className = 'track-name';
    trackName.textContent = lyrics[index].text;
    
    const trackDuration = document.createElement('span');
    trackDuration.className = 'track-duration';
    trackDuration.textContent = formatTime(lyrics[index].time);
    
    item.appendChild(trackNumber);
    item.appendChild(trackName);
    item.appendChild(trackDuration);
    
    container.appendChild(item);
}

// ===== FALLING PETALS ANIMATION =====
function createPetals() {
    const petalsContainer = document.getElementById('petals');
    petalsContainer.innerHTML = '';
    
    // Create petal elements
    for (let i = 0; i < 20; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Create img element for GIF
        const petalImg = document.createElement('img');
        petalImg.src = 'assets/petal.gif';
        petalImg.alt = 'petal';
        petalImg.onerror = function() {
            // Fallback to text emoji
            this.style.display = 'none';
            petal.textContent = '🌸';
            petal.style.fontSize = '30px';
        };
        petal.appendChild(petalImg);
        
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDelay = Math.random() * 5 + 's';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        
        petalsContainer.appendChild(petal);
    }
}

// ===== RESET APPLICATION =====
function resetApp() {
    // Reset button tracking
    clickedButtons = {
        char1: false,
        char2: false,
        char3: false
    };
    popupStage = 1;
    
    // Reset button opacity and enable them
    ['btn-char1', 'btn-char2', 'btn-char3'].forEach(id => {
        const button = document.getElementById(id);
        if (button) {
            button.style.opacity = '1';
            button.disabled = false;
        }
    });
    
    // Stop media playback
    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        if (playIcon) playIcon.textContent = '▶';
        const albumArtContainer = document.querySelector('.album-art-container');
        if (albumArtContainer) albumArtContainer.classList.remove('spinning');
        isPlaying = false;
    }
    
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }
    
    // Clear petals
    const petalsContainer = document.getElementById('petals');
    if (petalsContainer) {
        petalsContainer.innerHTML = '';
    }
    
    // Reset lyrics
    updateLyrics(0);
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Space bar to play/pause music (when in music section)
    if (e.code === 'Space' && document.getElementById('section4').classList.contains('active')) {
        e.preventDefault();
        togglePlay();
    }
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Ensure section 1 is active on load
    navigateTo('section1');
    
    // Create cherry blossoms
    createCherryBlossoms();
    
    // Initialize lyrics display
    updateLyrics(0);
    
    // Preload background image
    const bgImage = new Image();
    bgImage.src = 'assets/background.gif';
    
    console.log('Valentine\'s Day App Loaded! 💖');
});