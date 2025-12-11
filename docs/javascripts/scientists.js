// Verified Scientists Data
const scientists = [
    {
        name: "Albert Einstein",
        image: "assets/images/einstein.png",
        quotes: [
            "The important thing is not to stop questioning. Curiosity has its own reason for existing.",
            "Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world.",
            "Life is like riding a bicycle. To keep your balance you must keep moving.",
            "The only source of knowledge is experience.",
            "Try not to become a man of success, but rather try to become a man of value."
        ]
    },
    {
        name: "Isaac Newton",
        image: "assets/images/newton.png",
        quotes: [
            "If I have seen further it is by standing on the shoulders of giants.",
            "Truth is ever to be found in simplicity, and not in the multiplicity and confusion of things.",
            "Nature is pleased with simplicity.",
            "To every action there is always opposed an equal reaction.",
            "Gravity explains the motions of the planets, but it cannot explain who sets the planets in motion."
        ]
    },
    {
        name: "Nikola Tesla",
        image: "assets/images/tesla.png",
        quotes: [
            "The present is theirs; the future, for which I really worked, is mine.",
            "Be alone, that is the secret of invention; be alone, that is when ideas are born.",
            "The scientists of today think deeply instead of clearly. One must be sane to think clearly, but one can think deeply and be quite insane."
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
            "I am among those who think that science has great beauty."
        ]
    },
    {
        name: "Srinivasa Ramanujan",
        image: "assets/images/ramanujan.png",
        quotes: [
            "An equation means nothing to me unless it expresses a thought of God."
        ]
    }
];

// Function to display a random scientist with a random quote
function displayRandomScientist() {
    const imageEl = document.getElementById('scientist-image');
    const quoteEl = document.getElementById('scientist-quote');
    const nameEl = document.getElementById('scientist-name');

    // Safety check
    if (!imageEl || !quoteEl || !nameEl) return;

    // 1. Start Fade Out
    imageEl.style.opacity = '0';
    quoteEl.style.opacity = '0';
    nameEl.style.opacity = '0';

    // 2. Wait for fade out to finish (500ms), then swap data
    setTimeout(() => {
        const scientist = scientists[Math.floor(Math.random() * scientists.length)];
        const quote = scientist.quotes[Math.floor(Math.random() * scientist.quotes.length)];

        // Update Content
        imageEl.src = scientist.image;
        imageEl.alt = scientist.name;

        // Note: Using backticks ` ` for template literals
        quoteEl.textContent = `"${quote}"`;
        nameEl.textContent = `— ${scientist.name}`;

        // 3. Start Fade In
        imageEl.style.opacity = '1';
        quoteEl.style.opacity = '1';
        nameEl.style.opacity = '1';
    }, 500);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', displayRandomScientist);
} else {
    displayRandomScientist();
}