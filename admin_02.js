  const createModal = document.getElementById('create-booking-modal');
  const openCreateBtn = document.getElementById('open-create-modal');
  const closeCreateBtn = document.getElementById('close-create-modal');

  openCreateBtn.addEventListener('click', () => {
    createModal.style.display = 'block';
  });

  closeCreateBtn.addEventListener('click', () => {
    createModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === createModal) {
      createModal.style.display = 'none';
    }
  });
