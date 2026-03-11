async function loadCSV() {
  const response = await fetch("enterprise_service_accounts.csv");
  if (!response.ok) {
    throw new Error("Could not load CSV file.");
  }

  const csvText = await response.text();
  return parseCSV(csvText);
}

function parseCSV(csvText) {
  const lines = csvText.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim());

  const data = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    return row;
  });

  return data;
}

function calculateHealthScore(company) {
  const sla = Number(company.SLA_Score);
  const incident = Number(company.Incident_Score);
  const csat = Number(company.CSAT_Score);
  const adoption = Number(company.Adoption_Score);
  const escalation = Number(company.Escalation_Score);

  const score =
    sla * 0.30 +
    incident * 0.25 +
    csat * 0.20 +
    adoption * 0.15 +
    escalation * 0.10;

  return score.toFixed(1);
}

function getHealthStatus(score) {
  const numericScore = Number(score);

  if (numericScore >= 90) return "Healthy";
  if (numericScore >= 75) return "Watch";
  return "At Risk";
}

function formatCurrency(value) {
  return Number(value).toLocaleString();
}

function showResult(company) {
  const healthScore = calculateHealthScore(company);
  const healthStatus = getHealthStatus(healthScore);

  document.getElementById("companyName").textContent = company.Company;
  document.getElementById("healthScore").textContent = healthScore;
  document.getElementById("healthStatus").textContent = healthStatus;
  document.getElementById("region").textContent = company.Region;
  document.getElementById("accountTier").textContent = company.Account_Tier;
  document.getElementById("contractValue").textContent = formatCurrency(company.Contract_Value_USD);
  document.getElementById("openIncidents").textContent = company.Open_Incidents;
  document.getElementById("lastServiceReview").textContent = company.Last_Service_Review;
  document.getElementById("renewalRisk").textContent = company.Renewal_Risk;

  document.getElementById("sla").textContent = company.SLA_Score;
  document.getElementById("incident").textContent = company.Incident_Score;
  document.getElementById("csat").textContent = company.CSAT_Score;
  document.getElementById("adoption").textContent = company.Adoption_Score;
  document.getElementById("escalation").textContent = company.Escalation_Score;

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

  if (!input) {
    showError("Please enter a company name.");
    return;
  }

  try {
    const companies = await loadCSV();

    const company = companies.find(c =>
      c.Company.toLowerCase().includes(input)
    );

    if (!company) {
      showError("Company not found. Try Pure Storage, NetApp, or Dell Technologies.");
      return;
    }

    showResult(company);
  } catch (error) {
    showError(error.message);
  }
});
