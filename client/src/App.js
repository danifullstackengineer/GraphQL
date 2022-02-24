import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
  useQuery,
  useMutation,
} from "@apollo/client";

import { useState } from "react";

const client = new ApolloClient({
  uri: "http://localhost:5005/graphql",
  cache: new InMemoryCache(),
});

const getBooksQuery = gql`
  {
    books {
      name
      genre
      id
    }
  }
`;

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;

const addBookMutation = gql`
  mutation ($name: String!, $genre: String!, $authorId: ID!) {
    addBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`;

const getBookQuery = gql`
  query ($id: ID!) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

function App() {
  return (
    <ApolloProvider client={client}>
      <div id="main">
        <h1>Dani's reading list</h1>
        <BookList />
        <AddBook />
      </div>
    </ApolloProvider>
  );
}

function BookList() {
  const { loading, error, data } = useQuery(getBooksQuery);
  const [selected, setSelected] = useState();

  if (loading) return <p>Loading...</p>;

  if (error) return <p>Error...</p>;

  return (
    <div>
      {data.books.map((book) => (
        <ul key={book.name}>
          <li
            onClick={() => {
              setSelected(book.id);
            }}
          >
            Name: {book.name}, Genre: {book.genre}
          </li>
        </ul>
      ))}
      <BookDetails bookId={selected} />
    </div>
  );
}

//6217c14ab30aa5e874e591ce

function BookDetails(props) {

  const {bookId} = props;

  const { loading, error, data } = useQuery(getBookQuery, {
    variables: {
      id: bookId
    }
  });

  console.log(data)

  if (loading) return null;
  if (error) return `Error! ${error}`

  return (
    <div id="book-details">
      <p>Details for the book:</p>
    </div>
  );
}

function AddBook() {
  const [input, setInput] = useState({
    name: "",
    genre: "",
    authorId: "",
  });

  const { loading, error, data } = useQuery(getAuthorsQuery);
  const [addBook] = useMutation(addBookMutation);

  if (loading) return <option disabled>Loading Authors</option>;

  if (error) return <p>Error...</p>;

  const handleChange = (e) => {
    if (e.target.name === "book-name") {
      setInput({
        ...input,
        name: e.target.value,
      });
    } else if (e.target.name === "genre-name") {
      setInput({
        ...input,
        genre: e.target.value,
      });
    } else if (e.target.name === "author-name") {
      setInput({
        ...input,
        authorId: e.target.value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBook({
      variables: {
        name: input.name,
        genre: input.genre,
        authorId: input.authorId,
      },
      refetchQueries: [
        {
          query: getBooksQuery,
        },
      ],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>Book name</label>
        <input
          onChange={handleChange}
          type="text"
          name="book-name"
          value={input.name}
        />
      </div>
      <div className="field">
        <label>Genre</label>
        <input
          onChange={handleChange}
          type="text"
          name="genre-name"
          value={input.genre}
        />
      </div>
      <div className="field">
        <label>Author</label>
        <select name="author-name" onChange={handleChange}>
          <option>Select author</option>
          {data.authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
      </div>
      <button>+</button>
    </form>
  );
}

export default App;
