import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { block } from 'million/react';

function Project({
  opts: { year, title, authors, abstract, keywords, paper, poster, notes },
  key,
}) {
  return (
    <details key={key} style={{ paddingBottom: '1rem' }}>
      <summary style={{ display: 'flex' }}>
        <b style={{ marginRight: 'auto' }}>{title}</b>{' '}
        {keywords && <a style={{ fontSize: '0.8rem' }}>{keywords}</a>}
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

const ProjectBlock = block(Project);

function App() {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('https://literallyjustanabel.aidenbai.repl.co/mst')
      .then((res) => res.json())
      .then((json) => setCatalog(json));
  }, []);

  const getYear = (timestamp) => {
    return timestamp.substring(5, 9);
  };

  const catalogView = catalog
    .filter(
      ({ title, abstract, author, keywords }) =>
        query === '' ||
        (title + abstract + author + keywords).toLowerCase().includes(query)
    )
    .sort((a, b) => {
      return (
        Number(b.year || getYear(b.timestamp)) -
        Number(a.year || getYear(a.timestamp))
      );
    })
    .map(
      ({
        timestamp,
        year,
        title,
        authors,
        abstract,
        keywords,
        paper,
        poster,
        notes,
        approved,
      }) => {
        return approved === 'yes' ? (
          <ProjectBlock
            key={title}
            opts={{
              year: year || timestamp.substring(5, 9),
              title,
              authors,
              abstract,
              keywords,
              paper,
              poster,
              notes,
            }}
          />
        ) : (
          ''
        );
      }
    );

  return (
    <>
      <main className="container">
        <header>
          <h2>MST Magnet Research Catalog</h2>
        </header>
        <p>
          Listed below is a catalog of completed research projects by the
          students of MST Magnet in Camas High.
        </p>
        <div>
          <br />
          {catalog.length === 0 ? (
            <div style={{ width: '100%' }}>
              <br />
              <p aria-busy="true">Loading...</p>
            </div>
          ) : (
            <div>
              <input
                style={{ width: '100%' }}
                placeholder="Enter search query..."
                type="text"
                onInput={(event) => {
                  setQuery(event.target.value.toLowerCase());
                }}
              />
              <div style={{ width: '100%' }}>
                <br />
                <hr />
                <br />
                <div>{catalogView}</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const root = createRoot(document.body);

root.render(<App />);
