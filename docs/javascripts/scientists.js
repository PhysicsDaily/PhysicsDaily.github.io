// Scientists data - Add more scientists here!
const scientists = [
    {
        name: "Albert Einstein",
        image: "assets/images/einstein.png",
        quotes: [
            "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
            "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
            "Life is like riding a bicycle. To keep your balance, you must keep moving.",
            "The only source of knowledge is experience.",
            "Logic will get you from A to B. Imagination will take you everywhere.",
            "In the middle of difficulty lies opportunity.",
            "A person who never made a mistake never tried anything new."
        ]
    },
    {
        name: "Isaac Newton",
        image: "assets/images/newton.png",
        quotes: [
            "If I have seen further, it is by standing on the shoulders of giants.",
            "I can calculate the motion of heavenly bodies, but not the madness of people.",
            "What we know is a drop, what we don't know is an ocean.",
            "Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.",
            "Gravity explains the motions of the planets, but it cannot explain who sets the planets in motion.",
            "To every action there is always opposed an equal reaction.",
            "Nature is pleased with simplicity. And nature is no dummy."
        ]
    },
    {
        name: "Nikola Tesla",
        image: "assets/images/tesla.png",
        quotes: [
            "The present is theirs; the future, for which I really worked, is mine.",
            "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.",
            "I don't care that they stole my idea. I care that they don't have any of their own.",
            "The scientists of today think deeply instead of clearly. One must be sane to think clearly, but one can think deeply and be quite insane.",
            "Be alone, that is the secret of invention; be alone, that is when ideas are born.",
            "My brain is only a receiver. In the Universe there is a core from which we obtain knowledge, strength and inspiration.",
            "The day science begins to study non-physical phenomena, it will make more progress in one decade than in all the previous centuries of its existence."
        ]
    },
    {
        name: "Marie Curie",
        image: "assets/images/curie.png",
        quotes: [
            "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
            "Be less curious about people and more curious about ideas.",
            "I was taught that the way of progress was neither swift nor easy.",
            "One never notices what has been done; one can only see what remains to be done.",
            "Life is not easy for any of us. But what of that? We must have perseverance and above all confidence in ourselves.",
            "I am among those who think that science has great beauty.",
        ]
    },
    {
        name: "Srinivasa Ramanujan",
        image: "assets/images/ramanujan.png",
        quotes: [
            "An equation for me has no meaning unless it expresses a thought of God."
        ]
    }
];

// Function to display a random scientist with a random quote
function displayRandomScientist() {
    const imageEl = document.getElementById('scientist-image');
    const quoteEl = document.getElementById('scientist-quote');
    const nameEl = document.getElementById('scientist-name');

    // Check if we're on the homepage with the scientist elements
    if (!imageEl || !quoteEl || !nameEl) return;

    // Pick a random scientist
    const scientist = scientists[Math.floor(Math.random() * scientists.length)];

    // Pick a random quote from that scientist
    const quote = scientist.quotes[Math.floor(Math.random() * scientist.quotes.length)];

    // Update the DOM
    imageEl.src = scientist.image;
    imageEl.alt = scientist.name;
    quoteEl.textContent = `"${quote}"`;
    nameEl.textContent = `— ${scientist.name}`;

    // Add a fade-in effect
    imageEl.style.opacity = '0';
    quoteEl.style.opacity = '0';
    nameEl.style.opacity = '0';

    requestAnimationFrame(() => {
        imageEl.style.transition = 'opacity 0.5s ease';
        quoteEl.style.transition = 'opacity 0.5s ease 0.2s';
        nameEl.style.transition = 'opacity 0.5s ease 0.3s';
        imageEl.style.opacity = '1';
        quoteEl.style.opacity = '1';
        nameEl.style.opacity = '1';
    });
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayRandomScientist);
} else {
    displayRandomScientist();
}
