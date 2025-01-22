const questions = [
  {
    id: 1,
    type: 'Standard-CV',
    title: 'Label the regions of this C-V characteristic curve',
    curve: 'M50,100 H200 C230,100 250,100 270,150 S290,250 310,300 S330,350 550,350',
    threshold: { x: 400, y: 50 },
    showThreshold: true,
    regions: ['accumulation', 'depletion', 'inversion'],
    dropZonePositions: [
      { top: '20%', left: '20%' },
      { top: '40%', left: '45%' },
      { top: '80%', left: '70%' },
    ],
  },
  {
    id: 2,
    type: 'PMOS',
    title: 'Label the regions of this PMOS C-V curve',
    curve: 'M50,350 Q150,350 200,280 T300,200 T400,100 T500,100',
    regions: ['inversion', 'depletion', 'accumulation'],
    dropZonePositions: [
      { top: '80%', left: '20%' },
      { top: '50%', left: '45%' },
      { top: '20%', left: '70%' },
    ],
  },
  {
    id: 3,
    type: 'NMOS-HF',
    title: 'Label the regions of this High-Frequency NMOS C-V curve',
    curve: 'M50,100 Q150,100 200,150 T300,250 T400,350 T500,350',
    regions: ['accumulation', 'depletion', 'inversion'],
    dropZonePositions: [
      { top: '20%', left: '20%' },
      { top: '50%', left: '45%' },
      { top: '80%', left: '70%' },
    ],
  },
];

const incorrectOptions = ['breakdown', 'conduction', 'saturation', 'flatband', 'oxidation'];

let currentQuestionIndex = 0;
let draggedElement = null;

function setupQuestion(questionIndex) {
  const question = questions[questionIndex];

  // Update progress bar
  const progress = ((questionIndex + 1) / questions.length) * 100;
  document.querySelector('.progress-fill').style.width = `${progress}%`;

  // Update question header
  document.querySelector('.question-header').textContent = question.title;

  // Update CV curve
  document.querySelector('.curve-path').setAttribute('d', question.curve);

  // Handle threshold line
  const thresholdLine = document.querySelector('.threshold-line');
  const vthLabel = document.querySelector('.vth-label');

  if (question.showThreshold) {
    const x = question.threshold.x;
    thresholdLine.setAttribute('x1', x);
    thresholdLine.setAttribute('x2', x);
    thresholdLine.setAttribute('y1', 50);
    thresholdLine.setAttribute('y2', 350);
    thresholdLine.style.display = 'block';

    vthLabel.setAttribute('x', x - 10);
    vthLabel.setAttribute('y', 380);
    vthLabel.textContent = 'VTH';
    vthLabel.style.display = 'block';
  } else {
    thresholdLine.style.display = 'none';
    vthLabel.style.display = 'none';
  }

  // Clear and setup drop zones
  const dropZonesContainer = document.querySelector('.drop-zones');
  dropZonesContainer.innerHTML = '';

  question.regions.forEach((region, index) => {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone';
    dropZone.dataset.region = region;
    
    // Apply percentage-based positioning
    dropZone.style.top = question.dropZonePositions[index].top;
    dropZone.style.left = question.dropZonePositions[index].left;
    
    dropZonesContainer.appendChild(dropZone);
  });

  // Clear and setup labels
  const labelsContainer = document.querySelector('.labels-container');
  labelsContainer.innerHTML = '';

  const allOptions = [...question.regions, ...incorrectOptions];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

  shuffledOptions.forEach((region) => {
    const label = document.createElement('div');
    label.className = 'draggable';
    label.draggable = true;
    label.dataset.name = region;
    label.textContent = region.charAt(0).toUpperCase() + region.slice(1);
    labelsContainer.appendChild(label);
  });

  document.querySelector('.feedback').className = 'feedback';
  document.querySelector('.feedback').textContent = '';
  document.querySelector('.next-button').style.display = 'none';

  setupDragAndDrop();
}

function setupDragAndDrop() {
  const draggables = document.querySelectorAll('.draggable');
  const dropZones = document.querySelectorAll('.drop-zone');

  draggables.forEach((draggable) => {
    // Desktop drag events
    draggable.addEventListener('dragstart', (e) => {
      draggedElement = draggable;
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });

    // Mobile touch events
    draggable.addEventListener('touchstart', (e) => {
      draggedElement = draggable;
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      draggable.style.position = 'absolute';
      draggable.style.left = `${touch.clientX - draggable.offsetWidth / 2}px`;
      draggable.style.top = `${touch.clientY - draggable.offsetHeight / 2}px`;
    });

    draggable.addEventListener('touchend', (e) => {
      draggable.classList.remove('dragging');
      draggable.style.position = '';

      const touch = e.changedTouches[0];
      const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

      if (dropZone && dropZone.classList.contains('drop-zone')) {
        if (dropZone.children.length > 0) {
          const existingLabel = dropZone.children[0];
          document.querySelector('.labels-container').appendChild(existingLabel);
        }
        dropZone.appendChild(draggedElement);
      } else {
        document.querySelector('.labels-container').appendChild(draggedElement);
      }
    });
  });

  dropZones.forEach((dropZone) => {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedElement) {
        if (dropZone.children.length > 0) {
          const existingLabel = dropZone.children[0];
          document.querySelector('.labels-container').appendChild(existingLabel);
        }
        dropZone.appendChild(draggedElement);
      }
    });
  });
}

document.querySelector('.check-button').addEventListener('click', () => {
  const dropZones = document.querySelectorAll('.drop-zone');
  let allCorrect = true;
  let incorrectRegions = [];

  dropZones.forEach((dropZone) => {
    const expectedRegion = dropZone.dataset.region;
    const placedLabel = dropZone.children[0];

    if (!placedLabel || placedLabel.dataset.name !== expectedRegion) {
      allCorrect = false;
      if (placedLabel) {
        incorrectRegions.push(placedLabel.dataset.name);
      }
    }
  });

  const feedback = document.querySelector('.feedback');
  feedback.className = 'feedback';

  if (allCorrect) {
    feedback.textContent = 'Correct! You can now proceed to the next question.';
    feedback.classList.add('correct');
    if (currentQuestionIndex < questions.length - 1) {
      document.querySelector('.next-button').style.display = 'block';
    } else {
      feedback.textContent = 'Congratulations! You have completed all questions!';
    }
  } else {
    feedback.textContent = `Some regions are incorrect. Check: ${incorrectRegions.join(', ')}`;
    feedback.classList.add('incorrect');
  }
});

document.querySelector('.next-button').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    setupQuestion(currentQuestionIndex);
  }
});

document.querySelector('.labels-container').addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.querySelector('.labels-container').addEventListener('drop', (e) => {
  e.preventDefault();
  if (draggedElement) {
    document.querySelector('.labels-container').appendChild(draggedElement);
  }
});

// Initialize first question
setupQuestion(0);
