// FORM SUBMISSION - Only run if form exists (on form page)
const applicationForm = document.getElementById('application-form');
// this if statment comes in when the user is on the internship-form.html page and after filling out the form, they click submit, then this part will handle the form submission by using fetch to send the data to the server
if (applicationForm) {
    applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form data, we are using this part to say, hey server, I am sending you company, role, date_applied, status, and notes values
        const formData = {
            company: document.getElementById('company').value,
            role: document.getElementById('role').value,
            date_applied: document.getElementById('date_applied').value,
            status: document.getElementById('status').value,
            notes: document.getElementById('notes').value
        };
        // now it's fetch time, we are using fetch to send the data to the server, them boooom, the data is sent to the server. 
        try {
            // Send data to server
            const response = await fetch('/api/applications', {
                method: 'POST', // Use POST method to create a new application or in a general sense, to SEND data to the server
                headers: { // we are saying, hey server, I am sending you JSON data, why? Because we are sending data in JSON format, why?? because the network only understands JSON format, so we are saying, hey server, I am sending you JSON data.
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData) // Convert form data to JSON string
            });
            
            if (response.ok) { // If the response is ok, meaning the server received the data successfully

                console.log('✅ Application submitted successfully:', formData);
                const result = await response.json(); // Parse the JSON response from the server, so what does this mean? It means that the server is sending back a response, and we are saying, hey server, I am ready to receive your response, so we are using await to wait for the response.
                // await? It means that we are waiting for the server to respond, so we are saying, hey server, I am ready to receive your response, so we are using await to wait for the response.
                // what is going to happen if we did not use await? If we did not use await, the code would continue to run without waiting for the server to respond, and we would not be able to get the response from the server.
                alert('Application submitted successfully!');
                
                // Clear the form
                applicationForm.reset();
            } else {
                const error = await response.json(); // what would be the reason that the data would not be sent to the server? If the server is down, or if there is a network issue, or if the server is not able to process the request, or if the server is not able to understand the request, or if the server is not able to send a response
                alert('Error: ' + error.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit application. Please try again.');
        }
    });
}







// APPLICATIONS TABLE - Only run if table exists (on applications page)
// we do not need to say Method: GET because fetch by default uses GET method, so we are saying, hey server, I am ready to receive your data, so we are using fetch to get the data from the server
const tableBody = document.getElementById('table-body');
if (tableBody) {
    console.log('Applications page detected, loading applications...');
    // Load applications when page loads
    loadApplications();
} else {
    console.log('Not on applications page');
}





// Function to load and display all applications
async function loadApplications() {
    console.log('🔄 Starting to load applications...');
    
    try {
        console.log('📡 Making fetch request to /api/applications');
        // Fetch applications from the server
        // we are using fetch to get the data from the server, so we are saying,
        // hey server, I am ready to receive your data, so we are using fetch to
        // we don't need to say Method: GET because fetch by default uses GET method`
        const response = await fetch('/api/applications');
        
        console.log('📥 Response received:', {
            status: response.status,
            ok: response.ok
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const applications = await response.json();
        console.log('✅ Applications data received:', applications);
        console.log('📊 Number of applications:', applications.length);
        
        const tableBody = document.getElementById('table-body');
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        if (applications.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No applications found. <a href="internship-form.html">Add your first application!</a></td></tr>';
            return;
        }
        
        // Add each application as a table row
        applications.forEach((app, index) => {
            console.log(`🔨 Creating row ${index + 1} for:`, app.company, app.role);
            
            const row = document.createElement('tr');
            
            // Format date to be more readable
            const formattedDate = new Date(app.date_applied).toLocaleDateString();
            
            row.innerHTML = `
                <td>${app.company}</td>
                <td>${app.role}</td>
                <td>${formattedDate}</td>
                <td><span class="status-${app.status.toLowerCase()}">${app.status}</span></td>
                <td>${app.notes || 'No notes'}</td>
                <td>
                <!-- Edit and Delete buttons and the styling classes are edit-btn and delete btn -->
                    <button onclick="editApplication('${app._id}')" class="edit-btn">Edit</button>
                    <button onclick="deleteApplication('${app._id}')" class="delete-btn">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        console.log('✅ All applications rendered successfully!');
        
    } catch (error) {
        console.error('❌ Error loading applications:', error);
        const tableBody = document.getElementById('table-body');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading applications.</td></tr>';
        }
    }
}





// Function to edit an application
async function editApplication(id) {
    try {
        // First, get the application data
        const response = await fetch('/api/applications');
        const applications = await response.json();
        const app = applications.find(a => a._id === id);
        
        if (!app) {
            alert('Application not found!');
            return;
        }
        
        // Fill the edit form
        document.getElementById('edit-id').value = app._id;
        document.getElementById('edit-company').value = app.company;
        document.getElementById('edit-role').value = app.role;
        document.getElementById('edit-date').value = app.date_applied.split('T')[0]; // Format date for input
        document.getElementById('edit-status').value = app.status;
        document.getElementById('edit-notes').value = app.notes || '';
        
        // Show the edit form
        document.getElementById('edit-form').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading application for edit:', error);
        alert('Failed to load application data for editing.');
    }
}






// Function to delete an application
async function deleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/applications/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Application deleted successfully!');
            loadApplications(); // Reload the table
        } else {
            const error = await response.json();
            alert('Error deleting application: ' + error.message);
        }
    } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
    }
}







// Handle edit form submission - Only add listener if form exists
const editForm = document.getElementById('edit-form');
if (editForm) {
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // why? Because we do not want the form to submit in the traditional way, we want to handle it with JavaScript, so we are saying, hey server, I am ready to handle the form submission with JavaScript, so we are using e.preventDefault() to prevent the default form submission
        
        const id = document.getElementById('edit-id').value;
        const formData = {
            company: document.getElementById('edit-company').value,
            role: document.getElementById('edit-role').value,
            date_applied: document.getElementById('edit-date').value,
            status: document.getElementById('edit-status').value,
            notes: document.getElementById('edit-notes').value
        };
        
        try {
            const response = await fetch(`/api/applications/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Application updated successfully!');
                editForm.style.display = 'none';
                loadApplications(); // Reload the table
            } else {
                const error = await response.json();
                alert('Error updating application: ' + error.message);
            }
        } catch (error) {
            console.error('Error updating application:', error);
            alert('Failed to update application. Please try again.');
        }
    });
}