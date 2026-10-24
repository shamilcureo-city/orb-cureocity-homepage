/* Native details retain keyboard and no-JavaScript behaviour. */
(() => {
  const group = document.querySelector('[data-offer-faq]');
  if (!group) return;
  const questions = [...group.querySelectorAll('details')];
  questions.forEach(question => {
    question.addEventListener('toggle', () => {
      if (!question.open) return;
      questions.forEach(other => {
        if (other !== question) other.open = false;
      });
    });
  });
})();
