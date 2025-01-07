
const quizData = [
    {
        graphData: {
            labels: ['Gate Voltage (V)', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'],
            data: [
                {x: -4, y: 2.5},
                {x: -3, y: 2.4},
                {x: -2, y: 1.8},
                {x: -1, y: 1.2},
                {x: 0, y: 0.8},
                {x: 1, y: 0.6},
                {x: 2, y: 0.5},
                {x: 3, y: 0.5},
                {x: 4, y: 0.5}
            ]
        },
        question: "What operation region is shown in this C-V characteristic of MOS capacitor?",
        options: [
            "Accumulation",
            "Depletion",
            "Inversion",
            "Flat-band"
        ],
        correct: 0,
        explanation: "This is the Accumulation region. The high capacitance at negative gate voltage for a p-type substrate indicates accumulation of majority carriers (holes) at the semiconductor surface. The capacitance reaches its maximum value, equal to the oxide capacitance."
    },
    {
        graphData: {
            labels: ['Gate Voltage (V)', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'],
            data: [
                {x: -4, y: 2.5},
                {x: -3, y: 2.5},
                {x: -2, y: 2.4},
                {x: -1, y: 1.8},
                {x: 0, y: 1.2},
                {x: 1, y: 0.8},
                {x: 2, y: 0.6},
                {x: 3, y: 0.5},
                {x: 4, y: 0.5}
            ]
        },
        question: "Identify the operation region in this MOS capacitor C-V characteristic:",
        options: [
            "Accumulation",
            "Depletion",
            "Inversion",
            "Flat-band"
        ],
        correct: 1,
        explanation: "This is the Depletion region. As the gate voltage becomes less negative, the majority carriers (holes) are pushed away from the surface, creating a depletion region. This results in a decreasing capacitance as the depletion width increases."
    },
    {
        graphData: {
            labels: ['Gate Voltage (V)', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'],
            data: [
                {x: -4, y: 0.5},
                {x: -3, y: 0.5},
                {x: -2, y: 0.6},
                {x: -1, y: 1.2},
                {x: 0, y: 1.8},
                {x: 1, y: 2.2},
                {x: 2, y: 2.4},
                {x: 3, y: 2.5},
                {x: 4, y: 2.5}
            ]
        },
        question: "Which region of operation is represented by this C-V curve?",
        options: [
            "Depletion",
            "Inversion",
            "Accumulation",
            "Flat-band"
        ],
        correct: 1,
        explanation: "This is the Inversion region. At strong positive gate voltages, minority carriers (electrons) are attracted to the surface, forming an inversion layer. The capacitance increases and approaches the oxide capacitance as the inversion layer forms."
    },
    {
        graphData: {
            labels: ['Gate Voltage (V)', '-4', '-3', '-2', '-1', '0', '1', '2', '3', '4'],
            data: [
                {x: -4, y: 0.8},
                {x: -3, y: 1.0},
                {x: -2, y: 1.2},
                {x: -1, y: 1.5},
                {x: 0, y: 1.5},
                {x: 1, y: 1.5},
                {x: 2, y: 1.2},
                {x: 3, y: 1.0},
                {x: 4, y: 0.8}
            ]
        },
        question: "Which region is represented by this C-V characteristic where the bands are flat?",
        options: [
            "Accumulation",
            "Depletion",
            "Inversion",
            "Flat-band"
        ],
        correct: 3,
        explanation: "This is the Flat-band condition. At the flat-band voltage, there is no band bending and no charge in the semiconductor. The capacitance is at an intermediate value between the maximum and minimum capacitance."
    }
];

let currentQuestion = 0;
let selectedAnswer = null;
const ctx = document.getElementById('graph').getContext('2d');
let chart;

function updateProgress() {
    document.getElementById('progress').textContent = 
        `Question ${currentQuestion + 1} of ${quizData.length}`;
}

function drawGraph(graphData) {
    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'C-V Characteristic',
                data: graphData.data,
                borderColor: '#3498db',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Gate Voltage (V)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Capacitance (pF)'
                    }
                }
            }
        }
    });
}

function loadQuestion() {
    const question = quizData[currentQuestion];
    drawGraph(question.graphData);
    updateProgress();
    
    document.getElementById('options').innerHTML = question.options
        .map((option, index) => `
            <button class="option-btn" onclick="selectAnswer(${index})">
                ${option}
            </button>
        `).join('');
    
    document.getElementById('feedback').style.display = 'none';
    document.getElementById('explanation').style.display = 'none';
    document.getElementById('next-btn').disabled = true;
    selectedAnswer = null;
}

function selectAnswer(index) {
    selectedAnswer = index;
    const question = quizData[currentQuestion];
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    
    options.forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect');
    });

    if (index === question.correct) {
        options[index].classList.add('correct');
        feedback.innerHTML = "Correct! Well done!";
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
    } else {
        options[index].classList.add('incorrect');
        options[question.correct].classList.add('correct');
        feedback.innerHTML = `Incorrect. The correct answer is ${question.options[question.correct]}.`;
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
    }

    feedback.style.display = 'block';
    
    const explanation = document.getElementById('explanation');
    explanation.innerHTML = question.explanation;
    explanation.style.display = 'block';
    
    document.getElementById('next-btn').disabled = false;
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestion = (currentQuestion + 1) % quizData.length;
    loadQuestion();
});

// Initialize the first question
loadQuestion();
