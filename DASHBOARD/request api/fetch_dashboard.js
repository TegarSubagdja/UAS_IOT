// Menggunakan Fetch API untuk mengambil data dari API
fetch('https://roomradar.000webhostapp.com/api/get_sensor')
    .then(response => response.json())
    .then(data => {
        // Data yang diterima dalam format JSON
        var sensorData = JSON.parse(data.sensorData);

        // Mendapatkan tabel HTML
        var table = document.getElementById('tabel_sensor'); // Ganti 'your-table-id' dengan ID tabel Anda

        // Iterasi melalui data sensor dan memasukkan data ke dalam baris HTML
        sensorData.forEach(sensor => {
            // Membuat elemen <tr>
            var row = table.insertRow();

            // Kolom 1: DHT 11
            var cell1 = row.insertCell(0);
            var div1 = document.createElement('div');
            div1.className = 'd-flex px-2 py-1';
            div1.innerHTML = '<div class="d-flex justify-content-center align-items-center p-3">' +
                '<i class="fas fa-temperature-high fa-lg"></i></div>' +
                '<div class="d-flex flex-column justify-content-center">' +
                '<h6 class="mb-0 text-sm">DHT 11</h6>' +
                '<p class="text-xs text-secondary mb-0">Data suhu dan kelembaban</p></div>';
            cell1.appendChild(div1);

            // Kolom 2: Suhu
            var cell2 = row.insertCell(1);
            cell2.className = 'align-middle text-center text-sm';
            var badgeSuhu = document.createElement('span');
            badgeSuhu.className = 'badge badge-sm bg-gradient-danger';
            badgeSuhu.textContent = sensor.temperature; // Menyesuaikan dengan nama kolom pada objek sensor
            cell2.appendChild(badgeSuhu);

            // Kolom 3: Kelembaban
            var cell3 = row.insertCell(2);
            cell3.className = 'align-middle text-center text-sm';
            var badgeHumid = document.createElement('span');
            badgeHumid.className = 'badge badge-sm bg-gradient-info';
            badgeHumid.textContent = sensor.humidity; // Menyesuaikan dengan nama kolom pada objek sensor
            cell3.appendChild(badgeHumid);

            // Kolom 4: Jumlah Orang
            var cell4 = row.insertCell(3);
            cell4.className = 'align-middle text-center text-sm';
            var sum = document.createElement('span');
            sum.className = 'badge badge-sm bg-gradient-warning';
            sum.textContent = sensor.sum; // Menyesuaikan dengan nama kolom pada objek sensor
            cell4.appendChild(sum);

            // Kolom 5: Tanggal
            var cell5 = row.insertCell(4);
            cell5.className = 'align-middle text-center';
            var spanDate = document.createElement('span');
            spanDate.className = 'text-secondary text-xs font-weight-bold';
            var createdDate = new Date(sensor.created_at); // Menyesuaikan dengan nama kolom pada objek sensor
            spanDate.textContent = createdDate.toLocaleDateString(); // Menampilkan tanggal dengan format lokal
            cell5.appendChild(spanDate);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
