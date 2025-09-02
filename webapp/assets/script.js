
let rooms = [];
let drivers = []; // ✅ ADD THIS
let employees = []; // ✅ ADD THIS  
let customers = []; // ✅ ADD THIS if missing

    // --- fetchRoomsFromServer: loads /api/rooms and maps to UI-friendly objects
    function fetchRoomsFromServer() {
    return fetch("http://localhost:5000/api/rooms")
        .then(res => {
        if (!res.ok) throw new Error("Failed to fetch rooms");
        return res.json();
        })
        .then(data => {
        // map DB rows (snake_case) -> UI-friendly camelCase used elsewhere
        rooms = data.map(r => ({
            roomId: r.room_id,
            roomNumber: r.room_number,
            roomType: r.room_type,
            floorNumber: r.floor_number,
            bedType: r.bed_type,
            maxOccupancy: r.max_occupancy,
            basePrice: Number(r.base_price),
            extraBedCharges: Number(r.extra_bed_charges || 0),
            amenities: r.amenities ? r.amenities.split(",").map(a => a.trim()).filter(Boolean) : [],
            currentStatus: r.current_status,
            housekeepingStatus: r.housekeeping_status,
            maintenanceNotes: r.maintenance_notes
        }));

        loadRoomsTable();
        updateDashboardStats(); // refresh counts after fetching
        })
        .catch(err => {
        console.error("Error fetching rooms:", err);
        });
    }


    // Initialize the application
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
    Promise.all([
        fetchRoomsFromServer(),
        fetchDriversFromServer(),
        fetchCustomersFromServer() // Add this
    ]).then(() => {
        updateDashboardStats();
        loadAvailableRooms();
        loadOccupiedRooms();
        loadAllRoomsForUpdate();
        loadTablesData();
    });
    
    setCurrentDateTime();
}


    // Enhanced UI Functions
    function initializeEnhancements() {
        addAnimationClasses();
        initializeTooltips();
        addProgressBars();
        enhanceFormInteractions();
    }

    // Add animation classes to elements
    function addAnimationClasses() {
        const cards = document.querySelectorAll('.stat-card, .admin-form, .table-container');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }

    // Enhanced form interactions
    function enhanceFormInteractions() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }

    // Add progress bars for forms
    function addProgressBars() {
        const forms = document.querySelectorAll('.admin-form');
        forms.forEach(form => {
            const progressBar = document.createElement('div');
            progressBar.className = 'form-progress';
            progressBar.innerHTML = '<div class="progress-bar"></div>';
            form.insertBefore(progressBar, form.firstChild);

            updateFormProgress(form);

            form.addEventListener('input', () => updateFormProgress(form));
        });
    }

    function updateFormProgress(form) {
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        const filled = Array.from(inputs).filter(input => input.value.trim() !== '').length;
        const percentage = (filled / inputs.length) * 100;

        const progressBar = form.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.style.background = `linear-gradient(90deg, #27ae60 0%, #2ecc71 ${percentage}%)`;
        }
    }

    // Enhanced message display
    function showEnhancedMessage(message, type, duration = 4000) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-icon">${getMessageIcon(type)}</span>
                <span class="message-text">${message}</span>
            </div>
            <button class="message-close" onclick="this.parentElement.remove()">×</button>
        `;

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);

            setTimeout(() => {
                messageDiv.style.animation = 'fadeOut 0.4s ease-out';
                setTimeout(() => messageDiv.remove(), 400);
            }, duration);
        }
    }

    function getMessageIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || 'ℹ';
    }

    // Mobile menu toggle
    function initializeMobileMenu() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'mobile-menu-toggle';
        toggleButton.innerHTML = '☰';
        toggleButton.onclick = toggleMobileMenu;
        document.body.appendChild(toggleButton);
    }

    function toggleMobileMenu() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('active');
    }

    // Initialize enhancements when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeEnhancements();
        initializeMobileMenu();
    });

    // Add loading states to buttons
    function addLoadingState(button, text = 'Loading...') {
        const originalText = button.textContent;
        button.disabled = true;
        button.innerHTML = `<span class="loading"></span> ${text}`;

        return function removeLoading() {
            button.disabled = false;
            button.textContent = originalText;
        };
    }

    // Enhanced form submission with loading states
    function enhanceFormSubmissions() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    const removeLoading = addLoadingState(submitButton, 'Processing...');

                    setTimeout(() => {
                        removeLoading();
                    }, 2000);
                }
            });
        });
    }

    // Call this function after DOM is loaded
    document.addEventListener('DOMContentLoaded', enhanceFormSubmissions);


    // Navigation functions
    function showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => section.classList.remove('active'));

        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Update navigationR
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));

        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Load specific data for certain sections
        if (sectionId === 'rooms-details' || sectionId === 'search-room') {
            loadRoomsTable();
        } else if (sectionId === 'employee-details') {
            loadEmployeesTable();
        } else if (sectionId === 'customer-details') {
            loadCustomersTable();
        } else if (sectionId === 'driver-allocation') {
            loadDriversTable();
        }
    }

    // Login handling
    document.addEventListener('DOMContentLoaded', function() {
        const adminLoginForm = document.getElementById('adminLoginForm');
        const receptionistLoginForm = document.getElementById('receptionistLoginForm');

        async function handleLogin(e, role) {
        e.preventDefault();

        let username, password;

        if (role === "receptionist") {
            username = document.getElementById("receptionistUsername").value; // phone number
            const dob = document.getElementById("receptionistDOB").value; // Add DOB field
            if (!dob) return alert("Please enter date of birth.");
            const yearOfBirth = new Date(dob).getFullYear();
            password = `rec@${yearOfBirth}`;
        } else {
            username = document.getElementById(`${role}Username`).value;
            password = document.getElementById(`${role}Password`).value;
        }

        try {
            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                if (data.role === "ADMIN") window.location.href = "admin-dashboard.html";
                else if (data.role === "RECEPTIONIST") window.location.href = "receptionist-dashboard.html";
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Server error. Try again later.");
        }
    }


        if (adminLoginForm) adminLoginForm.addEventListener("submit", (e) => handleLogin(e, "admin"));
        if (receptionistLoginForm) receptionistLoginForm.addEventListener("submit", (e) => handleLogin(e, "receptionist"));
    });





    // Form handling functions
document.addEventListener('DOMContentLoaded', function() {

    // Handle employee form submit
    const empForm = document.getElementById("employeeForm");
if (empForm) {
  empForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(empForm));

    const payload = {
      full_name: formData.fullName,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      phone_number: formData.phoneNumber,
      email: formData.email,
      permanent_address: formData.permanentAddress,
      current_address: formData.currentAddress,
      job_title: formData.jobTitle,
      department: formData.department,
      joining_date: formData.joiningDate,
      employee_type: formData.employeeType,
      salary: formData.salary,
      bank_name: formData.bankName,
      account_number: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      pan_number: formData.panNumber,
      govt_id_number: formData.govtIdNumber,
    };

    try {
      const res = await fetch("http://localhost:5000/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.status === "success") {
        showMessage(result.message, "success");
        empForm.reset();

        // ✅ Show credentials if receptionist
        if (result.receptionistCredentials) {
          const creds = result.receptionistCredentials;
          alert(`Receptionist created!\nUsername: ${creds.username}\nPassword: ${creds.password}`);
        }

        loadEmployeesTable();
        updateDashboardStats();
      } else {
        showMessage(result.message || "Failed to add employee", "error");
      }

    } catch (err) {
      console.error(err);
      showMessage("Server error while adding employee", "error");
    }
  });
}

        // Room form
        const roomForm = document.getElementById('roomForm');
        if (roomForm) {
            roomForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addRoom();
            });
        }


    // DRIVER FORM 
    const driverForm = document.getElementById('driverForm');
    if (driverForm) {
        driverForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDriver();
        });
    }   

        // Customer form
        const customerForm = document.getElementById('customerForm');
        if (customerForm) {
            customerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                addCustomer();
            });
        }

        // Update room form
        const updateRoomForm = document.getElementById('updateRoomForm');
        if (updateRoomForm) {
            updateRoomForm.addEventListener('submit', function(e) {
                e.preventDefault();
                updateRoomStatus();
            });
        }
    });



    // Room management
    async function addRoom() {
    const form = document.getElementById('roomForm');
    if (!form) return;

    const formData = new FormData(form);

    // Amenities can be multiple checkboxes => FormData.getAll
    const amenitiesArr = formData.getAll('amenities') || [];

    const payload = {
        room_number: formData.get('roomNumber'),
        room_type: formData.get('roomType'),
        floor_number: parseInt(formData.get('floorNumber') || 0, 10),
        bed_type: formData.get('bedType'),
        max_occupancy: parseInt(formData.get('maxOccupancy') || 0, 10),
        base_price: parseFloat(formData.get('basePrice') || 0),
        extra_bed_charges: parseFloat(formData.get('extraBedCharges') || 0),
        amenities: amenitiesArr.join(','),
        current_status: formData.get('currentStatus') || formData.get('roomStatus') || 'available',
        housekeeping_status: formData.get('housekeepingStatus'),
        maintenance_notes: formData.get('maintenanceNotes') || ''
    };

    try {
        const res = await fetch("http://localhost:5000/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (!res.ok) {
        showMessage(result.error || "Failed to add room", "error");
        return;
        }

        showMessage("Room added successfully!", "success");
        form.reset();

        // refresh local data + dashboard
        await fetchRoomsFromServer();
        updateDashboardStats();

    } catch (err) {
        console.error("Error adding room:", err);
        showMessage("Server error while adding room", "error");
    }
    }


    // Driver management - FIXED VERSION
async function addDriver() {
    const form = document.getElementById("driverForm");
    if (!form) return;

    const formData = new FormData(form);
    
    // Debug: Log what we're getting from the form
    console.log("Form data received:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    const payload = {
        name: formData.get("name"),
        licenseType: formData.get("licenseType"), // ✅ This matches your controller
        dlNumber: formData.get("dlNumber"),
        issueDate: formData.get("issueDate"),
        expiryDate: formData.get("expiryDate"),
        issuingAuthority: formData.get("issuingAuthority"),
        dateOfBirth: formData.get("dateOfBirth"),
        gender: formData.get("gender"),
        phoneNumber: formData.get("phoneNumber"),
        email: formData.get("email"),
        permanentAddress: formData.get("permanentAddress"),
        vehicleNumber: formData.get("vehicleNumber")
    };

    // Debug: Log the payload being sent
    console.log("Payload being sent:", payload);

    try {
        const res = await fetch("http://localhost:5000/api/drivers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (!res.ok) {
            showMessage(result.error || "Failed to add driver", "error");
            return;
        }

        showMessage("Driver added successfully!", "success");
        form.reset();

        await fetchDriversFromServer();
        updateDashboardStats();
    } catch (err) {
        console.error("Error adding driver:", err);
        showMessage("Server error while adding driver", "error");
    }
}

    // Customer management
  async function addCustomer() {
    const form = document.getElementById('customerForm');
    if (!form) return;

    const formData = new FormData(form);
    
    const payload = {
        full_name: formData.get('fullName'),
        phone_number: formData.get('phoneNumber'),
        email: formData.get('email'),
        address: formData.get('address'),
        id_proof_type: formData.get('idProofType'),
        id_proof_number: formData.get('idProofNumber'),
        room_number: formData.get('roomNumber'),
        check_in_date: formData.get('checkInDate'),
        check_out_date: formData.get('checkOutDate'),
        number_of_guests: parseInt(formData.get('numberOfGuests')),
        advance_amount: parseFloat(formData.get('advanceAmount') || 0)
    };

    try {
        const res = await fetch("http://localhost:5000/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (!res.ok) {
            showMessage(result.error || "Failed to register customer", "error");
            return;
        }

        showMessage("Customer registered successfully!", "success");
        form.reset();
        
        await fetchCustomersFromServer(); // You'll need to implement this
        updateDashboardStats();
        loadAvailableRooms(); // Refresh available rooms

    } catch (err) {
        console.error("Error adding customer:", err);
        showMessage("Server error while registering customer", "error");
    }
}

function fetchCustomersFromServer() {
    return fetch("http://localhost:5000/api/customers")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch customers");
            return res.json();
        })
        .then(data => {
            customers = data.map(c => ({
                id: c.customer_id,
                fullName: c.full_name,
                phoneNumber: c.phone_number,
                email: c.email,
                address: c.address,
                idProofType: c.id_proof_type,
                idProofNumber: c.id_proof_number,
                roomNumber: c.room_number,
                checkInDate: c.check_in_date,
                checkOutDate: c.check_out_date,
                numberOfGuests: c.number_of_guests,
                advancePaid: parseFloat(c.advance_amount || 0),
                status: c.status || 'checked-in',
                createdAt: c.created_at
            }));

            loadCustomersTable();
            loadOccupiedRooms();
            updateDashboardStats();
        })
        .catch(err => {
            console.error("Error fetching customers:", err);
        });
}

// Fix checkout functionality
async function processCheckout() {
    const customerId = document.getElementById('checkoutRoom').value;
    if (!customerId) {
        showMessage("Please select a customer to checkout.", "warning");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/customers/${customerId}/checkout`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });

        const result = await res.json();

        if (!res.ok) {
            showMessage(result.error || "Failed to checkout customer", "error");
            return;
        }

        showMessage("Customer checked out successfully!", "success");
        
        // Refresh data
        await fetchCustomersFromServer();
        await fetchRoomsFromServer(); // Room status should change to available
        updateDashboardStats();
        
        // Reset checkout form
        document.getElementById('customerDetailsDisplay').style.display = 'none';
        document.getElementById('checkoutRoom').value = '';

    } catch (err) {
        console.error("Error during checkout:", err);
        showMessage("Server error during checkout", "error");
    }
}


    // Dashboard stats update
    function updateDashboardStats() {
        fetch("http://localhost:5000/api/dashboard/stats")
            .then(res => res.json())
            .then(stats => {
                document.getElementById("totalEmployees").textContent = stats.employees;
                document.getElementById("totalRooms").textContent = stats.rooms;
                document.getElementById("totalDrivers").textContent = stats.drivers;
                document.getElementById("availableRooms").textContent = stats.availableRooms;
            })
            .catch(err => console.error("Error loading dashboard stats:", err));
    }




    function fetchDriversFromServer() {
    return fetch("http://localhost:5000/api/drivers")
        .then(res => res.json())
        .then(data => {
        drivers = data.map(d => ({
            driverId: d.driver_id,
            name: d.name,
            licenseType: d.license_type,
            dlNumber: d.dl_number,
            issueDate: d.issue_date,
            expiryDate: d.expiry_date,
            issuingAuthority: d.issuing_authority,
            dateOfBirth: d.date_of_birth,
            gender: d.gender,
            phone: d.phone_number,
            email: d.email,
            address: d.permanent_address,
            vehicleNumber: d.vehicle_number,
            status: d.status
        }));

        loadDriversTable();
        updateDashboardStats();
        })
        .catch(err => console.error("Error fetching drivers:", err));
    }



    // Load available rooms for customer registration
    function loadAvailableRooms() {
        const roomSelect = document.getElementById('custRoomNumber');
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Select Available Room</option>';

            const availableRooms = rooms.filter(room => room.currentStatus === 'available');
            availableRooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.roomNumber;
                option.textContent = `${room.roomNumber} - ${room.roomType} (₹${room.basePrice}/night)`;
                roomSelect.appendChild(option);
            });
        }
    }

    // Load occupied rooms for checkout
    function loadOccupiedRooms() {
        const checkoutSelect = document.getElementById('checkoutRoom');
        if (checkoutSelect) {
            checkoutSelect.innerHTML = '<option value="">Select Room/Customer</option>';
            const checkedInCustomers = customers.filter(customer => customer.status === 'checked-in');
            checkedInCustomers.forEach(customer => {
                const option = document.createElement('option');
                option.value = customer.id;
                option.textContent = `${customer.roomNumber} - ${customer.fullName}`;
                checkoutSelect.appendChild(option);
            });
        }
    }

    // Load all rooms for update
    function loadAllRoomsForUpdate() {
        const roomSelect = document.getElementById('selectRoomUpdate');
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Select Room</option>';
            rooms.forEach(room => {
                const option = document.createElement('option');
                option.value = room.roomNumber;
                option.textContent = `${room.roomNumber} - ${room.roomType}`;
                roomSelect.appendChild(option);
            });
        }
    }

    // Load customer details for checkout
    function loadCustomerDetails() {
        const customerId = document.getElementById('checkoutRoom').value;
        const detailsDiv = document.getElementById('customerDetailsDisplay');
        const infoDiv = document.getElementById('customerInfo');

        if (customerId) {
            const customer = customers.find(c => c.id == customerId);
            const room = rooms.find(r => r.roomNumber === customer.roomNumber);

            if (customer) {

                const checkInDate = new Date(customer.checkInDate);
                const checkOutDate = new Date(customer.checkOutDate);
                const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                const totalBill = nights * (room ? room.basePrice : 0);
                const pendingAmount = totalBill - customer.advancePaid;

                infoDiv.innerHTML = `
                    <div class="customer-info-grid">
                        <div><strong>Name:</strong> ${customer.fullName}</div>
                        <div><strong>Room:</strong> ${customer.roomNumber}</div>
                        <div><strong>Phone:</strong> ${customer.phoneNumber}</div>
                        <div><strong>Check-in:</strong> ${new Date(customer.checkInDate).toLocaleString()}</div>
                        <div><strong>Check-out:</strong> ${new Date(customer.checkOutDate).toLocaleString()}</div>
                        <div><strong>Nights:</strong> ${nights}</div>
                        <div><strong>Room Rate:</strong> ₹${room ? room.basePrice : 0}/night</div>
                        <div><strong>Total Bill:</strong> ₹${totalBill}</div>
                        <div><strong>Advance Paid:</strong> ₹${customer.advancePaid}</div>
                        <div><strong>Pending Amount:</strong> ₹${pendingAmount}</div>
                    </div>
                `;
                detailsDiv.style.display = 'block';
            }
        } else {
            detailsDiv.style.display = 'none';
        }
    }

    // Process checkout
    function processCheckout() {
        const customerId = document.getElementById('checkoutRoom').value;
        if (!customerId) {
            showMessage("Please select a customer to checkout.", "warning");
            return;
        }

        const formData = new FormData();
        formData.append("customerId", customerId);

        fetch('checkoutCustomer', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === "success") {
                    showMessage("Customer checked out successfully!", "success");
                    loadOccupiedRooms(); // refresh dropdown
                    document.getElementById('customerDetailsDisplay').style.display = 'none';
                } else {
                    showMessage("Error during checkout!", "error");
                }
            })
            .catch(err => {
                console.error(err);
                showMessage("Server error!", "error");
            });
    }



    // Load room details for update
    function loadRoomDetails() {
        const roomNumber = document.getElementById('selectRoomUpdate').value;
        const detailsDiv = document.getElementById('roomUpdateDetails');

        if (roomNumber) {
            const room = rooms.find(r => r.roomNumber === roomNumber);
            if (room) {
                document.getElementById('updateRoomStatus').value = room.currentStatus;
                document.getElementById('updateHousekeeping').value = room.housekeepingStatus;
                document.getElementById('updateMaintenanceNotes').value = room.maintenanceNotes || '';
                detailsDiv.style.display = 'block';
            }
        } else {
            detailsDiv.style.display = 'none';
        }
    }

    // Room Status Update
async function updateRoomStatus() {
    const roomNumber = document.getElementById('selectRoomUpdate').value;
    const status = document.getElementById('updateRoomStatus').value;
    const housekeeping = document.getElementById('updateHousekeeping').value;
    const notes = document.getElementById('updateMaintenanceNotes').value;

    if (!roomNumber) {
        showMessage("Please select a room first", "warning");
        return;
    }

    const room = rooms.find(r => r.roomNumber === roomNumber);
    if (!room) {
        showMessage("Room not found", "error");
        return;
    }

    const payload = {
        current_status: status,
        housekeeping_status: housekeeping,
        maintenance_notes: notes
    };

    try {
        const res = await fetch(`http://localhost:5000/api/rooms/${room.roomId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await res.json();

        if (!res.ok) {
            showMessage(result.error || "Failed to update room status", "error");
            return;
        }

        showMessage("Room status updated successfully!", "success");
        
        // Refresh data
        await fetchRoomsFromServer();
        updateDashboardStats();
        
        // Reset form
        document.getElementById('roomUpdateDetails').style.display = 'none';
        document.getElementById('selectRoomUpdate').value = '';

    } catch (err) {
        console.error("Error updating room:", err);
        showMessage("Server error while updating room", "error");
    }
}


    // Table loading functions
    function loadTablesData() {
        loadRoomsTable();
        loadEmployeesTable();
        loadCustomersTable();
        loadDriversTable();
    }

    // --- loadRoomsTable: renders the `rooms` array into the rooms table(s)
    function loadRoomsTable() {
    const tableBody = document.querySelector('#roomsTable tbody');
    const searchTableBody = document.querySelector('#searchRoomsTable tbody');

    if (tableBody || searchTableBody) {
        const roomRows = rooms.map(room => `
        <tr>
            <td>${room.roomNumber}</td>
            <td>${room.roomType}</td>
            <td>${room.floorNumber}</td>
            <td>${room.bedType}</td>
            <td>${room.maxOccupancy}</td>
            <td>₹${room.basePrice}</td>
            <td><span class="status-${room.currentStatus}">${room.currentStatus}</span></td>
            <td><span class="status-${room.housekeepingStatus}">${room.housekeepingStatus}</span></td>
            <td>${(room.amenities || []).join(', ')}</td>
        </tr>
        `).join('');

        if (tableBody) tableBody.innerHTML = roomRows;
        if (searchTableBody) searchTableBody.innerHTML = roomRows;
    }
    }

    function loadEmployeesTable() {
    const tableBody = document.querySelector('#employeesTable tbody');
    if (!tableBody) return;

    fetch("http://localhost:5000/api/employees")
        .then(res => res.json())
        .then(response => {
            // Handle the nested response structure
            if (response.status === "success") {
                employees = response.data; // Extract the employees array from response.data
                const employeeRows = employees.map(emp => `
                    <tr>
                        <td>${emp.full_name}</td>
                        <td>${emp.job_title}</td>
                        <td>${emp.department}</td>
                        <td>${emp.phone_number}</td>
                        <td>${emp.email}</td>
                        <td>${emp.employee_type}</td>
                        <td>${new Date(emp.joining_date).toLocaleDateString()}</td>
                    </tr>
                `).join('');
                tableBody.innerHTML = employeeRows;
            } else {
                console.error("API returned error status:", response.message);
                tableBody.innerHTML = '<tr><td colspan="7">Error loading employee data</td></tr>';
            }
        })
        .catch(err => {
            console.error("Error loading employees:", err);
            tableBody.innerHTML = '<tr><td colspan="7">Failed to load employee data</td></tr>';
        });
}


function loadCustomersTable() {
    const tableBody = document.querySelector('#customersTable tbody');
    if (!tableBody) return;

    console.log("Loading customers table..."); // Debug log

    fetch("http://localhost:5000/api/customers")
        .then(res => {
            console.log("Response status:", res.status); // Debug log
            return res.json();
        })
        .then(response => {
            console.log("Response data:", response); // Debug log
            
            if (response.status === "success") {
                const customers = response.data;
                
                if (customers.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="8">No customer data found</td></tr>';
                    return;
                }
                
                const customerRows = customers.map(customer => `
                    <tr>
                        <td>${customer.full_name}</td>
                        <td>${customer.room_number || 'N/A'}</td>
                        <td>${customer.phone_number}</td>
                        <td>${customer.check_in ? new Date(customer.check_in).toLocaleString() : 'N/A'}</td>
                        <td>${customer.check_out ? new Date(customer.check_out).toLocaleString() : 'N/A'}</td>
                        <td>${customer.number_of_guests || 'N/A'}</td>
                        <td>${customer.total_bill ? '₹' + customer.total_bill : 'N/A'}</td>
                        <td><span class="status-${(customer.status || 'unknown').toLowerCase().replace('_', '-')}">${customer.status || 'Unknown'}</span></td>
                    </tr>
                `).join('');
                
                tableBody.innerHTML = customerRows;
            } else {
                console.error("API returned error status:", response.message, response.error);
                tableBody.innerHTML = '<tr><td colspan="8">Error loading customer data</td></tr>';
            }
        })
        .catch(err => {
            console.error("Error loading customers:", err);
            tableBody.innerHTML = '<tr><td colspan="8">Failed to load customer data</td></tr>';
        });
}


    function loadDriversTable() {
    const tableBody = document.querySelector("#driversTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = drivers.map(d => `
        <tr>
        <td>${d.name}</td>
        <td>${d.licenseType}</td>
        <td>${d.dlNumber}</td>
        <td>${d.phone}</td>
        <td>${d.vehicleNumber}</td>
        <td><span class="status-${d.status}">${d.status}</span></td>
        <td>
            <button class="btn btn-sm" onclick="allocateDriver(${d.driverId})">
            ${d.status === "available" ? "Assign" : "Release"}
            </button>
        </td>
        </tr>
    `).join("");
    }

    // Driver allocation
    function allocateDriver(driverId) {
    fetch(`http://localhost:5000/api/drivers/${driverId}/toggle`, {
        method: "PUT"
    })
        .then(res => res.json())
        .then(result => {
        showMessage(result.message, "success");
        fetchDriversFromServer(); // refresh table
        updateDashboardStats();
        })
        .catch(err => {
        console.error("Error toggling driver:", err);
        showMessage("Failed to toggle driver status", "error");
        });
    }


    // Room filtering
    function filterRooms() {
        const roomType = document.getElementById('filterRoomType').value;
        const floor = document.getElementById('filterFloor').value;
        const bedType = document.getElementById('filterBedType').value;
        const status = document.getElementById('filterStatus').value;

        let filteredRooms = rooms;

        if (roomType) {
            filteredRooms = filteredRooms.filter(room => room.roomType === roomType);
        }
        if (floor) {
            filteredRooms = filteredRooms.filter(room => room.floorNumber == floor);
        }
        if (bedType) {
            filteredRooms = filteredRooms.filter(room => room.bedType === bedType);
        }
        if (status) {
            filteredRooms = filteredRooms.filter(room => room.currentStatus === status);
        }

        const tableBody = document.querySelector('#searchRoomsTable tbody');
        if (tableBody) {
            const roomRows = filteredRooms.map(room => `
                <tr>
                    <td>${room.roomNumber}</td>
                    <td>${room.roomType}</td>
                    <td>${room.floorNumber}</td>
                    <td>${room.bedType}</td>
                    <td>${room.maxOccupancy}</td>
                    <td>₹${room.basePrice}</td>
                    <td><span class="status-${room.currentStatus}">${room.currentStatus}</span></td>
                    <td>${room.amenities.join(', ')}</td>
                </tr>
            `).join('');

            tableBody.innerHTML = roomRows;
        }
    }

    function resetFilters() {
        document.getElementById('filterRoomType').value = '';
        document.getElementById('filterFloor').value = '';
        document.getElementById('filterBedType').value = '';
        document.getElementById('filterStatus').value = '';
        loadRoomsTable();
    }

    // Utility functions
    function showMessage(message, type) {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        // Insert at the top of main content
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(messageDiv, mainContent.firstChild);

            // Remove message after 3 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        } else {
            alert(message);
        }
    }

    function setCurrentDateTime() {
        const checkInInput = document.getElementById('checkInDate');
        if (checkInInput) {
            const now = new Date();
            const dateTimeLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
            checkInInput.value = dateTimeLocal;
        }
    }

    function printBill() {
        const customerId = document.getElementById('checkoutRoom').value;
        if (customerId) {
            const customer = customers.find(c => c.id == customerId);
            if (customer) {
                const room = rooms.find(r => r.roomNumber === customer.roomNumber);
                const checkInDate = new Date(customer.checkInDate);
                const checkOutDate = new Date(customer.checkOutDate);
                const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
                const totalBill = nights * (room ? room.basePrice : 0);

                const billContent = `
                    HOTEL BILL
                    ==========================================
                    Customer: ${customer.fullName}
                    Room: ${customer.roomNumber} (${room ? room.roomType : 'N/A'})
                    Check-in: ${checkInDate.toLocaleString()}
                    Check-out: ${checkOutDate.toLocaleString()}
                    Nights: ${nights}
                    Rate: ₹${room ? room.basePrice : 0}/night
                    ==========================================
                    Total Amount: ₹${totalBill}
                    Advance Paid: ₹${customer.advancePaid}
                    Balance Due: ₹${totalBill - customer.advancePaid}
                    ==========================================
                    Thank you for staying with us!
                `;

                const printWindow = window.open('', '_blank');
                printWindow.document.write(`<pre>${billContent}</pre>`);
                printWindow.document.close();
                printWindow.print();
            }
        }
    }

