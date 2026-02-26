(function () {
  const form = document.getElementById("prediction-form");
  const predictBtn = document.getElementById("predict-btn");
  const clearBtn = document.getElementById("clear-btn");
  const resultsArea = document.getElementById("results-area");
  const loader = predictBtn.querySelector(".loader");
  const btnText = predictBtn.querySelector(".btn-text");

  function formatDateTime(value) {
    return new Date(value).toISOString();
  }

  function buildWidthClass(percent) {
    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;
    return "w-" + percent;
  }

  function renderResults(data) {
    const percent = Math.round(data.probability_delay * 100);
    const widthClass = buildWidthClass(percent);

    const sortedFactors = data.top_factors
      .slice()
      .sort(function (a, b) {
        return Math.abs(b.impact) - Math.abs(a.impact);
      })
      .slice(0, 5);

    let factorsHtml = "";

    sortedFactors.forEach(function (f) {
      const icon = f.direction === "increase_delay" ? "↑" : "↓";
      const colorClass = f.direction === "increase_delay" ? "increase" : "decrease";

      factorsHtml +=
        '<div class="factor">' +
          '<span>' + f.feature.replace(/_/g, " ") + ' (' + f.value + ')</span>' +
          '<span class="' + colorClass + '">' +
            icon + " " + Number(f.impact).toFixed(3) +
          '</span>' +
        '</div>';
    });

    resultsArea.className = "";
    resultsArea.innerHTML =
      '<div class="card">' +
        '<span class="badge ' + (data.label === "Delayed" ? "badge-delayed" : "badge-ontime") + '">' + data.label + '</span>' +
        '<h2>' + percent + '%</h2>' +
        '<p>Threshold: ' + data.threshold_used + '</p>' +
        '<div class="progress-bar">' +
          '<div class="progress-fill ' + widthClass + '"></div>' +
        '</div>' +
      '</div>' +
      '<div class="card">' +
        '<h2>Fatores</h2>' +
        factorsHtml +
      '</div>' +
      '<div class="card">' +
        '<h2>Metadados</h2>' +
        '<p>' + data.departure_datetime + '</p>' +
      '</div>';
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const airline = document.getElementById("airline").value.trim().toUpperCase();
    const origin = document.getElementById("origin_airport").value.trim().toUpperCase();
    const destination = document.getElementById("destination_airport").value.trim().toUpperCase();
    const datetime = document.getElementById("departure_datetime").value;

    if (!airline || !origin || !destination || !datetime) return;

    const inputData = {
      airline: airline,
      origin_airport: origin,
      destination_airport: destination,
      departure_datetime: formatDateTime(datetime)
    };

    predictBtn.disabled = true;
    loader.classList.remove("hidden");
    btnText.textContent = "Prevendo...";

    fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro na requisição: " + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        renderResults(data);
      })
      .catch(function (error) {
        resultsArea.innerHTML =
          '<div class="card"><h2>Erro</h2><p>' +
          error.message +
          '</p></div>';
        console.error("Erro:", error);
      })
      .finally(function () {
        predictBtn.disabled = false;
        loader.classList.add("hidden");
        btnText.textContent = "Prever Atraso";
      });
  });

  clearBtn.addEventListener("click", function () {
    form.reset();
    resultsArea.className = "results-empty";
    resultsArea.textContent = "Faça uma previsão para visualizar os resultados.";
  });
})();