const quizData = [
    {
        "question": "An object moves from x = -10 m to x = +10 m in 5 seconds. What is its average velocity?",
        "options": [
            "0 m/s",
            "2 m/s",
            "4 m/s",
            "-4 m/s"
        ],
        "answer": "4 m/s",
        "solution": "Average velocity is displacement divided by time. The displacement is Δx = (final position) - (initial position) = (+10 m) - (-10 m) = 20 m. The time interval is Δt = 5 s. So, average velocity = 20 m / 5 s = 4 m/s."
    },
    {
        "question": "A car accelerates uniformly from rest to a speed of 20 m/s in 10 seconds. What is its acceleration?",
        "options": [
            "1 m/s²",
            "2 m/s²",
            "10 m/s²",
            "20 m/s²"
        ],
        "answer": "2 m/s²",
        "solution": "Acceleration is the change in velocity divided by time. a = (v_f - v_i) / t. Here, v_i = 0, v_f = 20 m/s, and t = 10 s. So, a = (20 - 0) / 10 = 2 m/s²."
    },
    {
        "question": "An object is thrown vertically upwards. At its highest point, which of the following is true?",
        "options": [
            "Its velocity is zero and its acceleration is zero.",
            "Its velocity is non-zero and its acceleration is zero.",
            "Its velocity is zero and its acceleration is non-zero.",
            "Its velocity is non-zero and its acceleration is non-zero."
        ],
        "answer": "Its velocity is zero and its acceleration is non-zero.",
        "solution": "At the peak of its trajectory, the object momentarily stops moving upwards before it starts falling down, so its instantaneous velocity is zero. However, the acceleration due to gravity (g ≈ 9.8 m/s²) is constantly acting on it throughout its flight."
    },
    {
        "question": "A ball is dropped from a height of 19.6 m. How long does it take to hit the ground? (Use g = 9.8 m/s²)",
        "options": [
            "1.0 s",
            "1.4 s",
            "2.0 s",
            "4.0 s"
        ],
        "answer": "2.0 s",
        "solution": "We use the kinematic equation: d = v₀t + ½at². Since the ball is dropped, initial velocity v₀ = 0. So, d = ½gt². Rearranging for t gives t = sqrt(2d/g). t = sqrt(2 * 19.6 / 9.8) = sqrt(39.2 / 9.8) = sqrt(4) = 2.0 s."
    },
    {
        "question": "The area under a velocity-time graph represents:",
        "options": [
            "Acceleration",
            "Displacement",
            "Jerk",
            "Speed"
        ],
        "answer": "Displacement",
        "solution": "The area under a velocity-time graph represents the displacement of the object. The slope of the velocity-time graph represents acceleration."
    }
];
