document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('x-auth-token');
    const userId = localStorage.getItem('userId');
    const userType = localStorage.getItem('userType');

    if (!token || !userId || !userType) {
        document.body.innerHTML = '<h1>User is not logged in. Please <a href="../index.html">login</a> to continue.</h1>';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const listId = urlParams.get('id');

    if (!listId) {
        alert('No list ID provided.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5555/list/listdiplaytouristdetail/${listId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const list = data.list;

            document.querySelector('.list-detail').innerHTML = `
                <h2>${list.listTitle}</h2>
                <p><strong>Description:</strong> ${list.listDescription}</p>
                <p><strong>Location:</strong> ${list.location}</p>
                <p><strong>Status:</strong> ${list.liststatus ? 'Active' : 'Closed'}</p>
                <p><strong>Tourists Registered:</strong> ${list.touristsRegistered}</p>
                <h3>Guide Information</h3>
                <p><strong>Name:</strong> ${list.guideData.guideFirstName} ${list.guideData.guideLastName}</p>
                <p><strong>Email:</strong> ${list.guideData.guideEmailId}</p>
                <p><strong>Phone:</strong> ${list.guideData.guidePhoneNo}</p>
                <p><strong>Experience:</strong> ${list.guideData.guideExperience}</p>
            `;

            // Check if the tourist is registered for this list
            const touristStatusResponse = await fetch(`http://localhost:5555/list/lististouristregistered/${listId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            });

            console.log(touristStatusResponse);

            if (touristStatusResponse.ok) {
                const statusData = await touristStatusResponse.json();

                if (touristStatusResponse.status === 200) {
                    // Tourist is registered, show the "Exit List" button
                    document.querySelector('.list-detail').innerHTML += `
                        <button class="exit-button" id="exit-list-btn">Exit List</button>
                    `;

                    // Handle exit button click
                    document.getElementById('exit-list-btn').addEventListener('click', async () => {
                        try {
                            const exitResponse = await fetch(`http://localhost:5555/list/listremove/${listId}`, {
                                method: 'POST',
                                headers: {
                                    'x-auth-token': token,
                                },
                            });

                            if (exitResponse.ok) {
                                const exitData = await exitResponse.json();
                                alert(exitData.message);
                                window.location.reload(); // Reload to update UI
                            } else {
                                const exitErrorData = await exitResponse.json();
                                alert(exitErrorData.message);
                            }
                        } catch (error) {
                            console.error('Error exiting the list:', error);
                            alert('An error occurred while exiting the list. Please try again.');
                        }
                    });
                } else if (touristStatusResponse.status === 203) {
                    // Tourist is not registered, show the "Register Now" button
                    document.querySelector('.list-detail').innerHTML += `
                        <button class="register-button" id="register-btn">Register Now</button>
                    `;

                    // Add event listener to the Register Now button
                    document.querySelector('.register-button').addEventListener('click', () => {
                        window.location.href = `listregister.html?id=${listId}`;
                    });
                }
            }
        } else {
            const errorData = await response.json();
            alert(errorData.message);
        }
    } catch (error) {
        console.error('Error fetching the list details:', error);
        alert('An error occurred. Please try again later.');
    }
});
