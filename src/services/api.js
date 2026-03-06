// Services map nicely to the "Model" or Data layer in MVC.
// You can build reusable API functions to fetch data from the backend here.

export const portfolioService = {
    fetchProjects() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { id: 101, title: 'Remote Project', description: 'Loaded from fake API' }
                ])
            }, 500)
        })
    }
}
