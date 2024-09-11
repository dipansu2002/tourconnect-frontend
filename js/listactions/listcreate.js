document.addEventListener('DOMContentLoaded', () => {

    // Check for localStorage items
    const token = localStorage.getItem('x-auth-token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId || !userType) {
        // Show a message if user is not logged in
        document.body.innerHTML = '<h1>User is not logged in. Please <a href="../index.html">login</a> to continue.</h1>';
        return;
    }
    
    const specialityInput = document.getElementById('newSpeciality');
    const specialitiesList = document.getElementById('specialitiesList');
    const addSpecialityButton = document.querySelector('.add-speciality');

    // Array to store specialities
    let specialitiesArray = [];

    // Handle adding speciality
    addSpecialityButton.addEventListener('click', () => {
        const speciality = specialityInput.value.trim();
        if (speciality !== "" && !specialitiesArray.includes(speciality)) {
            // Add speciality to the array
            specialitiesArray.push(speciality);

            // Create an option element and add it to the dropdown
            const option = document.createElement('option');
            option.value = speciality;
            option.textContent = speciality;
            specialitiesList.appendChild(option);

            // Clear the input field
            specialityInput.value = "";

            // Log the added speciality and current array
            console.log(`Added speciality: ${speciality}`);
            console.log(`Current specialities array: ${specialitiesArray}`);
        } else {
            alert("Speciality is either empty or already added.");
        }
    });

    // Handle form submission
    document.getElementById('listCreateForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        // Include the specialities array in the data
        data.specialities = specialitiesArray;

        // Retrieve the token from localStorage
        const token = localStorage.getItem('x-auth-token');
        console.log(`x-auth-token: ${token}`); // Log the token

        try {
            const response = await fetch('http://localhost:5555/list/listcreate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token // Include the token in the request header
                },
                body: JSON.stringify(data)
            });

            // Log the request details
            console.log(`Request URL: http://localhost:5555/list/listcreate`);
            console.log(`Request Method: POST`);
            console.log(`Request Headers:`, {
                'Content-Type': 'application/json',
                'x-auth-token': token
            });
            console.log(`Request Body: ${JSON.stringify(data)}`);

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = 'dashboardguide.html'; // Redirect to dashboard page after successful list creation
            } else {
                alert(`Error: ${result.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
