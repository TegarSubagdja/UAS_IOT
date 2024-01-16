// Mendapatkan konteks dari elemen canvas
var ctx2 = document.getElementById("chart-line").getContext("2d");

// Membuat gradient untuk warna
var gradientStroke1 = ctx2.createLinearGradient(0, 230, 0, 50);
gradientStroke1.addColorStop(1, 'rgba(203,12,159,0.2)');
gradientStroke1.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke1.addColorStop(0, 'rgba(203,12,159,0)'); //purple colors

var gradientStroke2 = ctx2.createLinearGradient(0, 230, 0, 50);
gradientStroke2.addColorStop(1, 'rgba(20,23,39,0.2)');
gradientStroke2.addColorStop(0.2, 'rgba(72,72,176,0.0)');
gradientStroke2.addColorStop(0, 'rgba(20,23,39,0)'); //purple colors

// Mengambil data dari server
fetch('https://roomradar.000webhostapp.com/api/average')
    .then(response => response.json())
    .then(data => {
        // Data yang diterima dalam format JSON
        var currentYearAverages = data.currentYearAverages;
        var lastYearAverages = data.lastYearAverages;

        // Mengambil rata-rata untuk setiap bulan pada tahun sekarang
        var peopleNowAverages = Array.from({ length: 12 }, (_, i) => {
            var monthData = currentYearAverages.find(entry => entry.month == i + 1);
            return monthData ? monthData.average : 0;
        });

        // Mengambil rata-rata untuk setiap bulan pada tahun sebelumnya
        var lastYearAveragesData = Array.from({ length: 12 }, (_, i) => {
            var monthData = lastYearAverages.find(entry => entry.month == i + 1);
            return monthData ? monthData.average : 0;
        });

        // Membuat Chart
        new Chart(ctx2, {
            type: "line",
            data: {
                labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                datasets: [{
                    label: "Tahun Ini",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#cb0c9f",
                    borderWidth: 3,
                    backgroundColor: gradientStroke1,
                    fill: true,
                    data: peopleNowAverages,
                    maxBarThickness: 6
                },
                {
                    label: "Tahun Lalu",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 0,
                    borderColor: "#3A416F",
                    borderWidth: 3,
                    backgroundColor: gradientStroke2,
                    fill: true,
                    data: lastYearAveragesData,
                    maxBarThickness: 6
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                scales: {
                    y: {
                        grid: {
                            drawBorder: false,
                            display: true,
                            drawOnChartArea: true,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            padding: 10,
                            color: '#b2b9bf',
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: false,
                            display: false,
                            drawOnChartArea: false,
                            drawTicks: false,
                            borderDash: [5, 5]
                        },
                        ticks: {
                            display: true,
                            color: '#b2b9bf',
                            padding: 20,
                            font: {
                                size: 11,
                                family: "Open Sans",
                                style: 'normal',
                                lineHeight: 2
                            },
                        }
                    },
                },
            },
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
