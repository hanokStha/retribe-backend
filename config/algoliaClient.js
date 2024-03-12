
// Initialize Algolia client with your application ID and API key


// Access the index you want to work with
const algoliaSearchClient = algoliaClient.initIndex("products"); // Replace 'products' with the name of your Algolia index

export default algoliaSearchClient;
