// Menggunakan Fetch API untuk mengambil data dari API
fetch('https://roomradar.000webhostapp.com/api/img')
    .then(response => response.json())
    .then(data => {
        // Data yang diterima dalam format JSON
        var sensorData = JSON.parse(data.listFoto);

        // Mendapatkan tabel HTML
        var table = document.getElementById('tabel_photos'); // Ganti 'your-table-id' dengan ID tabel Anda

        // Iterasi melalui data sensor dan memasukkan data ke dalam baris HTML
        sensorData.forEach(sensor => {
            // Membuat elemen <tr>
            var row = table.insertRow();

            // Kolom 1: Nama File
            var cell1 = row.insertCell(0);
            var div1 = document.createElement('div');
            div1.className = 'd-flex px-2 py-1';
            div1.innerHTML = `<div class="d-flex justify-content-center align-items-center" style="width: 50px; height: 50px;">` + // Atur lebar dan tinggi sesuai kebutuhan Anda
                `<img src="http://localhost:8000/api/img/${sensor.name}" class="avatar avatar-sm me-3" alt="user1" style="object-fit: contain;"></div>` +
                `<div class="d-flex flex-column justify-content-center"><h6 class="mb-0 text-sm">${sensor.name}</h6>` +
                `<p class="text-xs text-secondary mb-0">Captured ESP32-Cam</p></div>`;
            cell1.appendChild(div1);



            // Kolom 2: Tanggal
            var cell2 = row.insertCell(1);
            cell2.className = 'align-middle text-center';
            var dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
            var formattedDate = new Date(sensor.created_at).toLocaleDateString('en-US', dateOptions);
            cell2.textContent = formattedDate;
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
