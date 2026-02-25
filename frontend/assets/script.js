(function () {
  const form = document.getElementById("prediction-form");
  const predictBtn = document.getElementById("predict-btn");
  const clearBtn = document.getElementById("clear-btn");
  const resultsArea = document.getElementById("results-area");
  const loader = predictBtn.querySelector(".loader");
  const btnText = predictBtn.querySelector(".btn-text");

  function formatDateTime(value) {
    const parts = value.split("T");
    if (parts.length !== 2) return "";
    return parts[0] + " " + parts[1] + ":00";
  }

  function simulatePrediction(inputData) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve({
          prediction: 1,
          label: "Delayed",
          probability_delay: 0.53,
          probability_no_delay: 0.47,
          threshold_used: 0.5,
          departure_datetime: inputData.departure_datetime,
          top_factors: [
            { feature: "day_of_week", value: 5, impact: -0.8, direction: "decrease_delay" },
            { feature: "hour_delay_rate", value: 0.2, impact: 0.4, direction: "increase_delay" },
            { feature: "origin_volume", value: 200000, impact: 0.3, direction: "increase_delay" },
            { feature: "is_holiday", value: 0, impact: -0.2, direction: "decrease_delay" },
            { feature: "airline_GLO", value: "GLO", impact: 0.15, direction: "increase_delay" }
          ]
        });
      }, 1500);
    });
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

    simulatePrediction(inputData).then(function (data) {
      renderResults(data);
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