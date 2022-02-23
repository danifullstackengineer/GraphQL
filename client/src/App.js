
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:5005/graphql",
  cache: new InMemoryCache(),
});

const getBooksQuery = gql`
  {
    books {
      name
      id
    }
  }
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Dani's reading list</h1>
        <BookList />
      </div>
    </ApolloProvider>
  );
}

function BookList() {

  const {loading, error, data} = useQuery(getBooksQuery)

  if(loading) return <p>Loading...</p>

  if(error) return <p>Error...</p>

  return <div>{data.books.map(book => (
    <ul key={book.name}>
      <li>Name: {book.name}, Genre: {book.genre}</li>
    </ul>
  ))}
  </div>
}

export default App;
