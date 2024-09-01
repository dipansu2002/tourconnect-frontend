document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // comment two
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('http://localhost:5555/auth/registertourist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = 'login.html'; // Redirect to login page after successful registration
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
