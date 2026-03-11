async function loadCompanies() {
  const response = await fetch("companies.json");
  if (!response.ok) {
    throw new Error("Could not load company data.");
  }
  return await response.json();
}

function calculateHealthScore(company) {
  return (
    company.sla * 0.30 +
    company.incident * 0.25 +
    company.csat * 0.20 +
    company.adoption * 0.15 +
    company.escalation * 0.10
  ).toFixed(1);
}

function showResult(company) {
  document.getElementById("companyName").textContent = company.company;
  document.getElementById("sla").textContent = company.sla;
  document.getElementById("incident").textContent = company.incident;
  document.getElementById("csat").textContent = company.csat;
  document.getElementById("adoption").textContent = company.adoption;
  document.getElementById("escalation").textContent = company.escalation;
  document.getElementById("healthScore").textContent = calculateHealthScore(company);

  document.getElementById("result").classList.remove("hidden");
  document.getElementById("error").classList.add("hidden");
}

function showError(message) {
  const error = document.getElementById("error");
  error.textContent = message;
  error.classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
}

document.getElementById("searchBtn").addEventListener("click", async () => {
  const input = document.getElementById("companyInput").value.trim().toLowerCase();

  try {
    const companies = await loadCompanies();
    const company = companies.find(c => c.company.toLowerCase() === input);

    if (!company) {
      showError("Company not found. Try Pure Storage, NetApp, or Dell Technologies.");
      return;
    }

    showResult(company);
  } catch (err) {
    showError(err.message);
  }
});
