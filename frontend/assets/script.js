(function () {

  const form = document.getElementById("prediction-form");
  const predictBtn = document.getElementById("predict-btn");
  const clearBtn = document.getElementById("clear-btn");
  const resultsArea = document.getElementById("results-area");

  const loader = predictBtn.querySelector(".loader");
  const btnText = predictBtn.querySelector(".btn-text");

  const airlineInput = document.getElementById("airline");
  const originInput = document.getElementById("origin_airport");
  const destinationInput = document.getElementById("destination_airport");
  const datetimeInput = document.getElementById("departure_datetime");


  /* -------------------------
  UTILIDADES
  --------------------------*/

  function formatDateTime(value) {

    if (!value) {
      throw new Error("Data inválida");
    }

    return value;

  }


  /* NOVO: formatação profissional da data */
  function formatDisplayDate(isoString) {

    const date = new Date(isoString);

    if (isNaN(date)) {
      return isoString;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const days = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ];

    const dayName = days[date.getDay()];
    return `${dayName} • ${day}/${month}/${year} • ${hours}:${minutes}`;
  }


  function setFieldValid(input) {

    input.style.borderColor = "#16a34a";
    input.style.background = "#f0fdf4";

  }


  function setFieldInvalid(input) {

    input.style.borderColor = "#dc2626";
    input.style.background = "#fef2f2";

  }


  function resetField(input) {

    input.style.borderColor = "";
    input.style.background = "";

  }


  /* -------------------------
  NORMALIZAÇÃO
  --------------------------*/

  function normalizeAirport(value) {

    const key = value.trim().toUpperCase();

    if (!key) return null;

    if (typeof airportLookup !== "undefined" && airportLookup[key]) {
      return airportLookup[key];
    }

    return null;

  }


  function normalizeAirline(value) {

    const key = value.trim().toUpperCase();

    if (!key) return null;

    if (typeof airlineLookup !== "undefined" && airlineLookup[key]) {
      return airlineLookup[key];
    }

    return null;

  }


  /* -------------------------
  AUTOCORREÇÃO INPUT
  --------------------------*/

  function validateAirportInput(input) {

    const normalized = normalizeAirport(input.value);

    if (normalized) {

      input.value = normalized;
      setFieldValid(input);

    } else {

      setFieldInvalid(input);

    }

  }


  function validateAirlineInput(input) {

    const normalized = normalizeAirline(input.value);

    if (normalized) {

      input.value = normalized;
      setFieldValid(input);

    } else {

      setFieldInvalid(input);

    }

  }


  airlineInput.addEventListener("blur", () => validateAirlineInput(airlineInput));
  originInput.addEventListener("blur", () => validateAirportInput(originInput));
  destinationInput.addEventListener("blur", () => validateAirportInput(destinationInput));


  /* -------------------------
  TRADUÇÃO FEATURES
  --------------------------*/

  function translateFeature(feature) {

    if (feature.startsWith("airline_")) {
      return "Companhia Aérea (" + feature.replace("airline_", "") + ")";
    }

    if (feature.startsWith("origin_airport_")) {
      return "Aeroporto de Origem (" + feature.replace("origin_airport_", "") + ")";
    }

    if (feature.startsWith("destination_airport_")) {
      return "Aeroporto de Destino (" + feature.replace("destination_airport_", "") + ")";
    }

    const dictionary = {
      day_of_week: "Dia da Semana",
      hour_delay_rate: "Taxa de Atraso por Hora",
      origin_volume: "Volume de Voos na Origem",
      destination_volume: "Volume de Voos no Destino",
      airline_delay_rate: "Histórico de Atrasos da Companhia",
      is_holiday: "É Feriado",
      is_weekend: "É Final de Semana",
      is_first_wave: "Primeira Onda de Voos (manhã cedo)",
      is_last_wave: "Última Onda de Voos (noite)",
      is_pre_holiday: "Véspera de Feriado",
      is_post_holiday: "Pós-feriado"
    };

    return dictionary[feature] || feature.replace(/_/g, " ");

  }


  function formatFeatureValue(feature, value) {

    if (feature === "day_of_week") {

      const days = [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado"
      ];

      return days[value] || value;

    }

    if (feature.startsWith("is_")) {
      return value === 1 ? "Sim" : "Não";
    }

    if (typeof value === "number" && value > 0 && value < 1) {
      return (value * 100).toFixed(0) + "%";
    }

    if (typeof value === "number" && value >= 1000) {
      return value.toLocaleString("pt-BR");
    }

    return value;

  }


  function buildWidthClass(percent) {

    if (percent < 0) percent = 0;
    if (percent > 100) percent = 100;

    return "w-" + percent;

  }


  /* -------------------------
  RENDER RESULTADOS
  --------------------------*/

  function renderResults(data) {

    let percent;

    if (data.label === "Delayed") {
      percent = Math.round(data.probability_delay * 100);
    } else {
      percent = Math.round(data.probability_no_delay * 100);
    }

    const delayPercent = Math.round(data.probability_delay * 100);
    const ontimePercent = Math.round(data.probability_no_delay * 100);

    const widthClass = buildWidthClass(percent);

    const sortedFactors = data.top_factors
      .slice()
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
      .slice(0, 5);

    let factorsHtml = "";

    const confidence =
      data.label === "Delayed" ? delayPercent : ontimePercent;

    const translatedLabel =
      data.label === "Delayed" ? "Atrasado" : "No Horário";

    sortedFactors.forEach(function (f) {

      const isIncrease = f.direction === "increase_delay";
      const icon = isIncrease ? "↑" : "↓";
      const colorClass = isIncrease ? "increase" : "decrease";

      const featureName = translateFeature(f.feature);
      const formattedValue = formatFeatureValue(f.feature, f.value);

      const impactValue =
        (isIncrease ? "+" : "") + Number(f.impact).toFixed(3);

      let displayName = featureName;

      if (f.feature === "is_holiday" || f.feature === "day_of_week") {
        displayName = featureName + ": " + formatFeatureValue(f.feature, f.value);
      }

      factorsHtml +=
        '<div class="factor">' +
        '<span>' + displayName + '</span>' +
        '<span class="' + colorClass + '">' +
        icon + " " + impactValue +
        '</span>' +
        '</div>';

    });

    const badgeClass =
      data.label === "Delayed" ? "badge-delayed" : "badge-ontime";

    resultsArea.className = "";

    resultsArea.innerHTML =

      '<div class="card">' +
        '<span class="badge ' + badgeClass + '">' + translatedLabel + '</span>' +
        '<p class="model-confidence">' +
        'Confiança: ' + confidence + '%' +
        '</p>' +
        '<p class="probability-sub">' +
          delayPercent + '% de atraso provável' +
        '</p>' +

        '<div class="progress-bar">' +
          '<div class="progress-fill ' + widthClass + '"></div>' +
        '</div>' +
      '</div>' +

      '<div class="card">' +
        '<h2>Fatores</h2>' +
        '<p class="factors-subtitle">' +
          'Principais variáveis que influenciaram esta previsão. ' +
          'Os valores representam o impacto relativo no modelo (log-odds), não probabilidades diretas. ' +
          '↑ aumenta chance de atraso • ↓ reduz chance de atraso. ' +
        '</p>' +
        factorsHtml +
      '</div>' +

      '<div class="card">' +
        '<h2>Metadados</h2>' +
        '<p>Companhia: ' + airlineInput.value + '</p>' +
        '<p>Origem: ' + originInput.value + '</p>' +
        '<p>Destino: ' + destinationInput.value + '</p>' +
        '<p>Data e Hora: ' + formatDisplayDate(datetimeInput.value) + '</p>' +
      '</div>';

  }


  /* -------------------------
  SUBMIT
  --------------------------*/

  form.addEventListener("submit", function (e) {

    e.preventDefault();

    const airline = normalizeAirline(airlineInput.value);
    const origin = normalizeAirport(originInput.value);
    const destination = normalizeAirport(destinationInput.value);
    const datetime = datetimeInput.value;

    if (!airline || !origin || !destination || !datetime) {

      alert("Preencha corretamente os campos.");
      return;

    }

    const inputData = {
      airline,
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
          throw new Error("Erro na API: " + response.status);
        }

        return response.json();

      })

      .then(data => renderResults(data))

      .catch(error => {

        resultsArea.innerHTML =
          '<div class="card">' +
          '<h2>Erro</h2>' +
          '<p>' + error.message + '</p>' +
          '</div>';

        console.error(error);

      })

      .finally(() => {

        predictBtn.disabled = false;
        loader.classList.add("hidden");
        btnText.textContent = "Prever Atraso";

      });

  });


  /* -------------------------
  LIMPAR
  --------------------------*/

  clearBtn.addEventListener("click", function () {

    form.reset();

    resetField(airlineInput);
    resetField(originInput);
    resetField(destinationInput);

    resultsArea.className = "results-empty";

    resultsArea.textContent =
      "Faça uma previsão para visualizar os resultados.";

  });

})();