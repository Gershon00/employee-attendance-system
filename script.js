document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("attendance-form");
    const tableBody = document.querySelector("#attendance-table tbody");
    const searchBar = document.getElementById("search-bar");

    // Load records from local storage
    let attendanceRecords = JSON.parse(localStorage.getItem("attendanceRecords")) || [];
    renderTable();

    // Add attendance record
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("employee-name").value.trim();
        const id = document.getElementById("employee-id").value.trim();

        if (name && id) {
            const currentDate = new Date();
            const date = currentDate.toLocaleDateString();
            const time = currentDate.toLocaleTimeString();

            attendanceRecords.push({ name, id, date, time });
            localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));

            renderTable();
            form.reset();
        } else {
            alert("Please fill out all fields!");
        }
    });

    // Search/filter records
    searchBar.addEventListener("input", () => {
        renderTable(searchBar.value.trim().toLowerCase());
    });

    // Render the table
    function renderTable(filter = "") {
        tableBody.innerHTML = "";

        attendanceRecords
            .filter((record) =>
                record.name.toLowerCase().includes(filter) || record.id.toLowerCase().includes(filter)
            )
            .forEach((record, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${record.name}</td>
                    <td>${record.id}</td>
                    <td>${record.date}</td>
                    <td>${record.time}</td>
                    <td>
                        <button class="edit-btn" data-index="${index}">Edit</button>
                        <button class="delete-btn" data-index="${index}">Delete</button>
                    </td>
                `;

                tableBody.appendChild(row);
            });

        addActionListeners();
    }

    // Add event listeners to action buttons
    function addActionListeners() {
        document.querySelectorAll(".edit-btn").forEach((button) =>
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                editRecord(index);
            })
        );

        document.querySelectorAll(".delete-btn").forEach((button) =>
            button.addEventListener("click", (event) => {
                const index = event.target.getAttribute("data-index");
                deleteRecord(index);
            })
        );
    }

    // Edit a record
    function editRecord(index) {
        const record = attendanceRecords[index];
        document.getElementById("employee-name").value = record.name;
        document.getElementById("employee-id").value = record.id;

        // Remove the record temporarily to prevent duplicate entries
        attendanceRecords.splice(index, 1);
        localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));

        renderTable();
    }

    // Delete a record
    function deleteRecord(index) {
        if (confirm("Are you sure you want to delete this record?")) {
            attendanceRecords.splice(index, 1);
            localStorage.setItem("attendanceRecords", JSON.stringify(attendanceRecords));
            renderTable();
        }
    }
});
