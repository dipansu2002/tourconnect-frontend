document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    // comment
    try {
        // send request
        const response = await fetch('http://localhost:5555/auth/logintourist', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // response
        const result = await response.json();
        if (response.ok) {
            // Store the token and userId in localStorage
            localStorage.setItem('x-auth-token', result.token);
            localStorage.setItem('userId', result.userId);
            localStorage.setItem('userType', 'tourist');
            
            alert('Login successful!');
            // Redirect to dashboard
            window.location.href = 'dashboardtourist.html'; // Ensure the path is correct
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
