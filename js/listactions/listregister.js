document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the form from submitting the traditional way

        const datefrom = document.getElementById('datefrom').value;
        const dateto = document.getElementById('dateto').value;

        if (!datefrom || !dateto) {
            alert('Please provide both date fields.');
            return;
        }

        // Extract the list ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const listId = urlParams.get('id');
        
        if (!listId) {
            alert('No list ID provided.');
            return;
        }

        try {
            // Fetch the token from localStorage
            const token = localStorage.getItem('x-auth-token');

            // Make the API request
            const response = await fetch(`http://localhost:5555/list/listregister/${listId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
                body: JSON.stringify({ datefrom, dateto }),
            });

            if (response.ok) {
                const data = await response.json();

                // Show success message
                alert('Registration successful!');

                // Go back to the previous page
                window.history.back();
            } else {
                const errorData = await response.json();
                console.error('Error status:', response.status);
                console.error('Error message:', errorData.message);

                // Show appropriate error message based on response status
                if (response.status === 401) {
                    alert(errorData.message);
                    window.location.href = 'logintourist.html';
                } else if (response.status === 404) {
                    alert(errorData.message);
                } else if (response.status === 500) {
                    alert('An error occurred on the server. Please try again later.');
                } else {
                    alert('An unexpected error occurred.');
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
