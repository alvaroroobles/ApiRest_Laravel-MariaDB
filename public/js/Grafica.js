export class Grafica {
    constructor(config) {
        const container = document.getElementById(config.idContainer);

        if (!container) {
            console.error(`Contenedor con id '${config.idContainer}' no encontrado`);
            return;
        }

        // Limpia el contenido anterior, si lo hay
        container.innerHTML = "";

        // Crea y añade el canvas al contenedor
        const canvas = document.createElement("canvas");
        container.appendChild(canvas);
        container.style.display = "block";

        // Crea la gráfica
        new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: config.labels,
                datasets: config.datasets.map(ds => ({
                    label: ds.label,
                    data: ds.data,
                    backgroundColor: ds.color,
                })),
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: "top" },
                    title: {
                        display: !!config.title,
                        text: config.title,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: !!config.yLabel,
                            text: config.yLabel,
                        },
                    },
                    x: {
                        title: {
                            display: !!config.xLabel,
                            text: config.xLabel,
                        },
                    },
                },
            },
        });
    }
}
