document.addEventListener('DOMContentLoaded', () => {
    const resultsBody = document.getElementById('results-body');

    fetch('/api/scan')
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                resultsBody.innerHTML = `<tr><td colspan="5">Error: ${data.error}</td></tr>`;
                return;
            }

            data.forEach(row => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${row.ticker}</td>
                    <td>${row.name}</td>
                    <td>${row.close}</td>
                    <td>${row.volume}</td>
                    <td>${row.market_cap_basic}</td>
                `;
                resultsBody.appendChild(tr);
            });
        })
        .catch(error => {
            resultsBody.innerHTML = `<tr><td colspan="5">Error: ${error.message}</td></tr>`;
        });
});
