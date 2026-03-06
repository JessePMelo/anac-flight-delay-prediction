(function () {

  const form = document.getElementById("prediction-form")
  const predictBtn = document.getElementById("predict-btn")
  const clearBtn = document.getElementById("clear-btn")
  const resultsArea = document.getElementById("results-area")

  const loader = predictBtn.querySelector(".loader")
  const btnText = predictBtn.querySelector(".btn-text")

  const airlineInput = document.getElementById("airline")
  const originInput = document.getElementById("origin_airport")
  const destinationInput = document.getElementById("destination_airport")
  const datetimeInput = document.getElementById("departure_datetime")


  /* -------------------------
  UTILIDADES
  --------------------------*/

  function formatDateTime(value) {

    const date = new Date(value)

    if (isNaN(date)) {
      throw new Error("Data inválida")
    }

    return date.toISOString()

  }


  function setFieldValid(input) {

    input.style.borderColor = "#16a34a"
    input.style.background = "#f0fdf4"

  }


  function setFieldInvalid(input) {

    input.style.borderColor = "#dc2626"
    input.style.background = "#fef2f2"

  }


  function resetField(input) {

    input.style.borderColor = ""
    input.style.background = ""

  }


  /* -------------------------
  NORMALIZAÇÃO
  --------------------------*/

  function normalizeAirport(value) {

    const key = value.trim().toUpperCase()

    if (!key) return null

    if (typeof airportLookup !== "undefined" && airportLookup[key]) {
      return airportLookup[key]
    }

    return null

  }


  function normalizeAirline(value) {

    const key = value.trim().toUpperCase()

    if (!key) return null

    if (airlineLookup && airlineLookup[key]) {
      return airlineLookup[key]
    }

    return null

  }


  /* -------------------------
  AUTOCORREÇÃO INPUT
  --------------------------*/

  function validateAirportInput(input) {

    const normalized = normalizeAirport(input.value)

    if (normalized) {

      input.value = normalized
      setFieldValid(input)

    } else {

      setFieldInvalid(input)

    }

  }


  function validateAirlineInput(input) {

    const normalized = normalizeAirline(input.value)

    if (normalized) {

      input.value = normalized
      setFieldValid(input)

    } else {

      setFieldInvalid(input)

    }

  }


  airlineInput.addEventListener("blur", () => validateAirlineInput(airlineInput))
  originInput.addEventListener("blur", () => validateAirportInput(originInput))
  destinationInput.addEventListener("blur", () => validateAirportInput(destinationInput))


  /* -------------------------
  TRADUÇÃO FEATURES
  --------------------------*/

  function translateFeature(feature) {

    if (feature.startsWith("airline_")) {
      return "Companhia Aérea (" + feature.replace("airline_", "") + ")"
    }

    if (feature.startsWith("origin_airport_")) {
      return "Aeroporto de Origem (" + feature.replace("origin_airport_", "") + ")"
    }

    if (feature.startsWith("destination_airport_")) {
      return "Aeroporto de Destino (" + feature.replace("destination_airport_", "") + ")"
    }

    const dictionary = {
      day_of_week: "Dia da Semana",
      hour_delay_rate: "Taxa de Atraso por Hora",
      origin_volume: "Volume de Voos na Origem",
      is_holiday: "É Feriado"
    }

    return dictionary[feature] || feature.replace(/_/g, " ")

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
      ]

      return days[value] || value

    }

    if (feature.startsWith("is_")) {
      return value === 1 ? "Sim" : "Não"
    }

    if (typeof value === "number" && value > 0 && value < 1) {
      return (value * 100).toFixed(0) + "%"
    }

    if (typeof value === "number" && value >= 1000) {
      return value.toLocaleString("pt-BR")
    }

    return value

  }


  function buildWidthClass(percent) {

    if (percent < 0) percent = 0
    if (percent > 100) percent = 100

    return "w-" + percent

  }


  /* -------------------------
  RENDER RESULTADOS
  --------------------------*/

  function renderResults(data) {

    const percent = Math.round(data.probability_delay * 100)
    const widthClass = buildWidthClass(percent)

    const sortedFactors = data.top_factors
      .slice()
      .sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact))
      .slice(0, 5)

    let factorsHtml = ""

    sortedFactors.forEach(function (f) {

      const isIncrease = f.direction === "increase_delay"
      const icon = isIncrease ? "↑" : "↓"
      const colorClass = isIncrease ? "increase" : "decrease"

      const featureName = translateFeature(f.feature)
      const formattedValue = formatFeatureValue(f.feature, f.value)

      const impactValue =
        (isIncrease ? "+" : "") + Number(f.impact).toFixed(3)

      factorsHtml +=
        '<div class="factor">' +
        '<span>' + featureName + ": " + formattedValue + '</span>' +
        '<span class="' + colorClass + '">' +
        icon + " " + impactValue +
        '</span>' +
        '</div>'

    })


    const translatedLabel =
      data.label === "Delayed" ? "Atrasado" : "No Horário"

    const badgeClass =
      data.label === "Delayed" ? "badge-delayed" : "badge-ontime"


    resultsArea.className = ""

    resultsArea.innerHTML =

      '<div class="card">' +
      '<span class="badge ' + badgeClass + '">' + translatedLabel + '</span>' +
      '<h2>' + percent + '%</h2>' +
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
      '</div>'

  }


  /* -------------------------
  SUBMIT
  --------------------------*/

  form.addEventListener("submit", function (e) {

    e.preventDefault()

    const airline = normalizeAirline(airlineInput.value)
    const origin = normalizeAirport(originInput.value)
    const destination = normalizeAirport(destinationInput.value)
    const datetime = datetimeInput.value

    if (!airline || !origin || !destination || !datetime) {

      alert("Preencha corretamente os campos.")

      return

    }


    const inputData = {
      airline,
      origin_airport: origin,
      destination_airport: destination,
      departure_datetime: formatDateTime(datetime)
    }


    predictBtn.disabled = true
    loader.classList.remove("hidden")
    btnText.textContent = "Prevendo..."


    fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(inputData)
    })

      .then(response => {

        if (!response.ok) {
          throw new Error("Erro na API: " + response.status)
        }

        return response.json()

      })

      .then(data => renderResults(data))

      .catch(error => {

        resultsArea.innerHTML =
          '<div class="card">' +
          '<h2>Erro</h2>' +
          '<p>' + error.message + '</p>' +
          '</div>'

        console.error(error)

      })

      .finally(() => {

        predictBtn.disabled = false
        loader.classList.add("hidden")
        btnText.textContent = "Prever Atraso"

      })

  })


  /* -------------------------
  LIMPAR
  --------------------------*/

  clearBtn.addEventListener("click", function () {

    form.reset()

    resetField(airlineInput)
    resetField(originInput)
    resetField(destinationInput)

    resultsArea.className = "results-empty"

    resultsArea.textContent =
      "Faça uma previsão para visualizar os resultados."

  })

})()