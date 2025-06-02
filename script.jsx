import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import FuzzySearch from 'fuzzy-search';

function Project({ opts }) {
  const { year, title, authors, abstract, keywords, paper, poster, video } =
    opts;
  const [open, setOpen] = useState(false);
  const handleClick = (event) => {
    event.preventDefault();
    setOpen(!open);
  };
  return (
    <div key={title}>
      <span className="sidenote" style={{ fontSize: '0.8rem' }}>
        Topics: <span style={{ fontStyle: 'italic' }}>{keywords}</span>
        <br />
        By: {authors}
      </span>
      <article
        style={{
          padding: '2rem',
          marginBottom: '1rem',
          border: '1px solid #767676',
          borderRadius: '0.15rem',
          background: '#f9fafb',
        }}
      >
        <details open={open}>
          <summary>
            <div style={{ display: 'flex' }}>
              <span style={{ marginRight: 'auto' }}>
                <b>{title}</b>
                <span style={{ opacity: 0.5 }}> · {year}</span>
              </span>{' '}
            </div>
            <p style={{ fontSize: '0.8rem', lineHeight: 1.5, opacity: 0.6 }}>
              {open ? (
                <span>
                  <span style={{ color: '#000' }}>{abstract}</span>
                  <p>{authors}</p>
                  <p>
                    <a role="button" href={paper} target="_blank">
                      Paper
                    </a>
                    {' ・ '}
                    <a role="button" target="_blank" href={poster}>
                      Poster
                    </a>
                    {video && (
                      <>
                        {' ・ '}
                        <a role="button" target="_blank" href={video}>
                          Video
                        </a>
                      </>
                    )}
                  </p>
                  <br />
                  <br />
                  <a role="button" onClick={handleClick}>
                    Show less...
                  </a>
                </span>
              ) : (
                <span>
                  {abstract.substring(0, 200)}...
                  <br />
                  <br />
                  <a role="button" onClick={handleClick}>
                    Show more...
                  </a>
                </span>
              )}
            </p>
          </summary>
        </details>
      </article>
    </div>
  );
}

const ProjectBlock = Project;

function App() {
  const [catalog, setCatalog] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('https://mst-database-server-production.up.railway.app/mst')
      .then((res) => res.json())
      .then((json) => setCatalog(json));
  }, []);

  const getYear = (timestamp) => {
    return timestamp.substring(5, 9);
  };

  const searcher = useMemo(
    () =>
      new FuzzySearch(catalog, ['authors', 'title', 'keywords'], {
        caseSensitive: false,
      }),
    [catalog]
  );

  const catalogView = searcher
    .search(query)
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
        video,
      }) => {
        return approved === 'yes' ? (
          <ProjectBlock
            opts={{
              year: year || timestamp.substring(5, 9),
              title,
              authors,
              abstract,
              keywords,
              paper,
              poster,
              notes,
              video,
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

const root = createRoot(document.getElementById('root'));

root.render(<App />);
