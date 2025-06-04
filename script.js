async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const apiKey = '5552ff543cb1142bf239388247999839';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=zh_tw`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("找不到城市！");
    const data = await res.json();

    const temperature = data.main.temp;
    const suggestion =
      temperature > 30
        ? "🥤 建議增加冷飲進貨量"
        : temperature < 15
        ? "☕ 建議增加熱飲進貨量"
        : "📦 維持正常庫存量";

    const resultDiv = document.getElementById("weatherResult");
    resultDiv.innerHTML = `
      <p>🌍 城市：${data.name}</p>
      <p>🌡 溫度：${temperature}°C</p>
      <p>☁ 狀況：${data.weather[0].description}</p>
      <p class="text-green-600 font-semibold mt-2">${suggestion}</p>
    `;

    await fetch("/api/save-forecast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: name,
        customerPhone: phone,
        city: data.name,
        temperature,
        condition: data.weather[0].description,
        humidity: data.main.humidity,
        forecast: suggestion,
      }),
    });
  } catch (error) {
    document.getElementById("weatherResult").innerHTML =
      `<p class="text-red-500">${error.message}</p>`;
  }
}
