document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        // Send POST request to the register guide endpoint
        const response = await fetch('http://localhost:5555/auth/registerguide', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Parse the JSON response
        const result = await response.json();

        // Check if registration was successful
        if (response.ok) {
            alert(result.message);  // Success message
            window.location.href = 'loginguide.html'; // Redirect to login page for guides
        } else {
            alert(`Error: ${result.message}`);  // Error message
        }
    } catch (error) {
        console.error('Error:', error);  // Handle any errors
    }
});
