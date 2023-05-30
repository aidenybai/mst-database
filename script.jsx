import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { block } from 'million/react';

function Project({
  opts: { year, title, authors, abstract, keywords, paper, poster },
  key,
}) {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <article style={{ padding: '2rem', marginBottom: '1rem' }}>
      <details key={key} onClick={handleClick}>
        <summary open={open}>
          <div style={{ display: 'flex' }}>
            <span style={{ marginRight: 'auto' }}>
              <b>{title}</b>
              <span style={{ opacity: 0.5 }}> · {year}</span>
            </span>{' '}
            <a style={{ fontSize: '0.8rem' }}>{keywords}</a>
          </div>
          <br />
          <div style={{ fontSize: '0.8rem', lineHeight: 1.5, opacity: 0.6 }}>
            {open ? abstract : `${abstract.substring(0, 200)}...`}
          </div>
        </summary>
        <p>{authors}</p>
        <p>
          <a
            style={{ padding: '0.25rem 1.5rem' }}
            role="button"
            href={paper}
            target="_blank"
          >
            Paper
          </a>{' '}
          <a
            style={{ padding: '0.25rem 1.5rem' }}
            role="button"
            target="_blank"
            href={poster}
            className="secondary"
          >
            Poster
          </a>
        </p>
      </details>
    </article>
  );
}

const ProjectBlock = Project;

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
