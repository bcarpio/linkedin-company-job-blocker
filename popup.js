const blockedCompaniesKey = "blockedCompanies";
const addButton = document.getElementById("addButton");
const companyInput = document.getElementById("companyInput");
const companyList = document.getElementById("companyList");

function saveBlockedCompanies(companies) {
  chrome.storage.local.set({ [blockedCompaniesKey]: companies });
}

function addCompanyToList(companyName) {
  const listItem = document.createElement("li");
  listItem.textContent = companyName;

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    listItem.remove();
    const blockedCompanies = JSON.parse(localStorage.getItem(blockedCompaniesKey));
    const index = blockedCompanies.indexOf(companyName);
    blockedCompanies.splice(index, 1);
    saveBlockedCompanies(blockedCompanies);
  });

  listItem.appendChild(removeButton);
  companyList.appendChild(listItem);
}

addButton.addEventListener("click", () => {
  const companyName = companyInput.value.trim();
  if (companyName) {
    chrome.storage.local.get(blockedCompaniesKey, (result) => {
      const blockedCompanies = result[blockedCompaniesKey] || [];
      if (!blockedCompanies.includes(companyName)) {
        blockedCompanies.push(companyName);
        saveBlockedCompanies(blockedCompanies);
        addCompanyToList(companyName);
        companyInput.value = "";
      }
    });
  }
});

function init() {
  chrome.storage.local.get(blockedCompaniesKey, (result) => {
    const blockedCompanies = result[blockedCompaniesKey] || [];
    blockedCompanies.forEach((companyName) => {
      addCompanyToList(companyName);
    });
  });
}

document.addEventListener("DOMContentLoaded", init);
