function getChartConfig(label, data, color, yAxisLabel) {
    return {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: label,
                    data: data.coffee || data.productivity,
                    borderColor: color,
                    backgroundColor: color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: color,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 12
                        },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: yAxisLabel
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    },
                    ticks: {
                        font: {
                            size: 11
                        }
                    }
                }
            }
        }
    };
}

function renderCoffeeChart(data, canvas) {
    const config = getChartConfig('Coffee Price (USD)', data, '#8B4513', 'Price (USD)');
    config.data.datasets[0].data = data.coffee;
    new Chart(canvas, config);
}

function renderProductivityChart(data, canvas) {
    const config = getChartConfig('Developer Activity', data, '#2E86AB', 'Activity Count');
    config.data.datasets[0].data = data.productivity;
    new Chart(canvas, config);
}
