document.addEventListener('DOMContentLoaded', () => {
    const routes = {
        '/': 'index.html',
        '/registertourist': 'pages/registertourist.html',
        '/registerguide': 'pages/registerguide.html',
        '/login': 'pages/logintourist.html',
        '/dashboard': 'pages/dashboardtourist.html',
    };

    function navigateTo(path) {
        if (routes[path]) {
            fetch(routes[path])
                .then(response => response.text())
                .then(html => {
                    document.querySelector('main').innerHTML = html;
                    window.history.pushState({ path }, '', path);
                });
        }
    }

    // Event listener for browser navigation (back/forward buttons)
    window.addEventListener('popstate', (event) => {
        // Check if there is state information
        if (event.state) {
            // Navigate to the path stored in the state
            navigateTo(event.state.path);
        }
    });

    // Add click event listeners to all anchor tags
    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            // Prevent the default anchor behavior (page reload)
            event.preventDefault();
            // Navigate to the path of the clicked anchor
            navigateTo(new URL(event.target.href).pathname);
        });
    });

    // Initial navigation based on the current URL path
    navigateTo(window.location.pathname);
});
