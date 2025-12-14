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

export function getComparisonChartConfig(data) {
    return {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Coffee Price (USD)',
                    data: data.coffee,
                    borderColor: '#8B4513',
                    backgroundColor: '#8B451320',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3,
                    yAxisID: 'y'
                },
                {
                    label: 'Developer Activity',
                    data: data.productivity,
                    borderColor: '#2E86AB',
                    backgroundColor: '#2E86AB20',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 3,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Coffee Price (USD)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Activity Count'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    };
}

export function getNormalizedChartConfig(data) {
    return {
        type: 'line',
        data: {
            labels: data.dates,
            datasets: [
                {
                    label: 'Coffee Price (Normalized)',
                    data: data.coffee,
                    borderColor: '#8B4513',
                    backgroundColor: '#8B451320',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                },
                {
                    label: 'Developer Activity (Normalized)',
                    data: data.productivity,
                    borderColor: '#2E86AB',
                    backgroundColor: '#2E86AB20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Normalized Value (0-100)'
                    }
                }
            }
        }
    };
}

export function renderCoffeeChart(data, canvas) {
    if (!canvas) {
        console.error('Canvas element not found for coffee chart');
        return;
    }

    const config = getChartConfig('Coffee Price (USD)', data, '#8B4513', 'Price (USD)');
    config.data.datasets[0].data = data.coffee;
    
    try {
        new Chart(canvas, config);
    } catch (error) {
        console.error('Error rendering coffee chart:', error);
    }
}

export function renderProductivityChart(data, canvas) {
    if (!canvas) {
        console.error('Canvas element not found for productivity chart');
        return;
    }

    const config = getChartConfig('Developer Activity', data, '#2E86AB', 'Activity Count');
    config.data.datasets[0].data = data.productivity;
    
    try {
        new Chart(canvas, config);
    } catch (error) {
        console.error('Error rendering productivity chart:', error);
    }
}

export function renderComparisonChart(data, canvas) {
    if (!canvas) {
        console.error('Canvas element not found for comparison chart');
        return;
    }

    const config = getComparisonChartConfig(data);
    
    try {
        new Chart(canvas, config);
    } catch (error) {
        console.error('Error rendering comparison chart:', error);
    }
}

export function renderNormalizedChart(data, canvas) {
    if (!canvas) {
        console.error('Canvas element not found for normalized chart');
        return;
    }

    const config = getNormalizedChartConfig(data);
    
    try {
        new Chart(canvas, config);
    } catch (error) {
        console.error('Error rendering normalized chart:', error);
    }
}
