console.log('content_script.js has been loaded');
const blockedCompaniesKey = 'blockedCompanies';

function blockCompanies(companies) {
  const jobCards = document.querySelectorAll('.jobs-search-results__list-item, .job-card-container');

  jobCards.forEach((jobCard) => {
    const companyNameElement = jobCard.querySelector('.job-card-company, .job-card-container__company-name');
    if (companyNameElement) {
      const companyName = companyNameElement.textContent.trim();
      if (companies.includes(companyName)) {
        jobCard.style.display = 'none';
        console.log('found company to block');
      } else {
        jobCard.style.display = '';
      }
    }
  });
}

function applyBlockedCompanies() {
  chrome.storage.local.get(blockedCompaniesKey, (result) => {
    const blockedCompanies = result[blockedCompaniesKey] || [];
    blockCompanies(blockedCompanies);
  });
}

// Apply the list of blocked companies when the page is loaded
applyBlockedCompanies();

// Monitor the page for changes and reapply the list of blocked companies when needed
const observer = new MutationObserver((mutations) => {
  let shouldReapply = false;

  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      shouldReapply = true;
    }
  });

  if (shouldReapply) {
    applyBlockedCompanies();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
