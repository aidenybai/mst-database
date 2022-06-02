import { compat } from 'million/react';
import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom';

function Project({ opts, key }) {
  const {
    year,
    title,
    authors,
    abstract,
    keywords,
    paper,
    poster,
    video,
    notes,
  } = opts;
  return (
    <details key={key} style={{ paddingBottom: '1rem' }}>
      <summary>
        <b>{title}</b>
      </summary>
      <p>
        <b>Year:</b> {year}
      </p>
      <p>
        <b>Authors:</b> {authors}
      </p>
      <p>
        <b>Keywords:</b> {keywords}
      </p>
      <p>
        <b>Links:</b>{' '}
        <a href={paper} target="_blank">
          Paper
        </a>{' '}
        |{' '}
        <a target="_blank" href={poster}>
          Poster
        </a>{' '}
        |{' '}
        <a href={video} target="_blank">
          Video
        </a>
      </p>
      <p>
        <b>Abstract:</b>
        <br />
        {abstract}
      </p>
      <p>
        <b>Author Notes:</b>
        <br />
        {notes || 'N/A'}
      </p>
    </details>
  );
}

function App() {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('https://literallyjustanabel.aidenbai.repl.co/mst')
      .then((res) => res.json())
      .then((json) => setCatalog(json));
  }, []);

  const catalogView = catalog
    .filter(
      ({ title, abstract, author, keywords }) =>
        query === '' ||
        (title + abstract + author + keywords).toLowerCase().includes(query)
    )
    .map(
      ({
        year,
        title,
        authors,
        abstract,
        keywords,
        paper,
        poster,
        video,
        notes,
        approved,
      }) => {
        return (
          approved && (
            <Project
              key={title}
              opts={{
                year,
                title,
                authors,
                abstract,
                keywords,
                paper,
                poster,
                video,
                notes,
              }}
            />
          )
        );
      }
    );

  return (
    <>
      <h2>MST Magnet Research Catalog</h2>
      <p>
        Listed below is a catalog of completed research projects by the students
        of MST Magnet in Camas High.
      </p>
      <div>
        <br />
        <div>
          <input
            style={{ width: '100%' }}
            placeholder="Enter search query..."
            type="text"
            onInput={(event) => {
              setQuery(event.target.value.toLowerCase());
            }}
          />
        </div>
        {catalog.length === 0 ? (
          <div>
            <br />
            Loading...
          </div>
        ) : (
          <>
            <br />
            <hr />
            <br />
            <div>{catalogView}</div>
          </>
        )}
      </div>
    </>
  );
}

const root = createRoot(document.querySelector('#app'));

compat(() => {
  root.render(<App />);
});
