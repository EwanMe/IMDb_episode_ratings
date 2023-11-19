import { useEffect, useState } from 'react';
import c3 from 'c3';
import 'c3/c3.css';

const Chart = ({
  allEpisodes,
  data,
  isLoaded,
  selection,
  isDynamic,
  error,
}) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    // TODO: Load new data in first time, and hide them after, not unload.
    if (chart) {
      const loaded = chart.data();

      loaded.forEach((item) => {
        if (selection.includes(item.id)) {
          chart.show(item.id);
        } else {
          chart.hide(item.id);
        }
      });
    }
  }, [selection, chart]);

  useEffect(() => {
    if (chart) {
      if (isDynamic) {
        chart.axis.max(undefined);
        chart.axis.min(undefined);
      } else {
        chart.axis.range({ max: { y: 10 }, min: { y: 1 } });
      }
    }
  }, [isDynamic, chart]);

  const createDataPlot = (data) => {
    const ratings = data.map((ep) =>
      ep.averageRating ? ep.averageRating : null
    );
    ratings.unshift('Season ' + data[0]?.seasonNumber); // Data array starts with label name
    return ratings;
  };

  useEffect(() => {
    if (isLoaded) {
      const plots = data.map((item) => createDataPlot(item));
      setChart(
        c3.generate({
          bindto: '#chart',
          unload: true,
          data: {
            type: 'line',
            columns: plots,
            hide: true, // Avoids showing all lines on load.
            onclick: (d) => {
              const imdbID =
                data[d.id.split(' ').slice(-1) - 1][d.index].tconst;
              window.open(`https://www.imdb.com/title/${imdbID}`);
            },
          },
          axis: {
            y: {
              label: {
                text: 'Rating',
                position: 'outer-middle',
              },
              max: isDynamic ? undefined : 10,
              min: isDynamic ? undefined : 1,
            },
            x: {
              label: {
                text: 'Episode',
                position: 'inner-center',
              },
              tick: {
                format: (x) => x + 1, // x-axis starts on episode 1
              },
            },
          },
          color: {
            pattern: [
              '#478EFF',
              '#FF5353',
              '#4B9C3B',
              '#CF8D3C',
              '#7157FF',
              '#FAE739',
              '#3AD3E0',
              '#FF68FF',
            ]
              .map((value) => ({ value, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ value }) => value),
          },
          tooltip: {
            order: (t1, t2) => t1.id > t2.id,
            contents: (currentData, _, __, color) =>
              `<table class="c3-tooltip">
              <tr>
              ${
                currentData.length === 1
                  ? `<th colspan='2'>Season ${
                      data[currentData[0].id.split(' ').slice(-1) - 1][
                        currentData[0].index
                      ].seasonNumber
                    }</th>`
                  : `<th colspan="2">Seasons: ${currentData
                      .map((item) => {
                        return item.id.split(' ').at(-1);
                      })
                      .join(', ')}</th>`
              }
              </tr>
              ${currentData
                .map((item) => {
                  const episode =
                    data[item.id.split(' ').slice(-1) - 1][item.index];
                  return `
                  <tr class="c3-tooltip-name--${item.id.replace(' ', '-')}">
                    <td class="name">
                      <span style="background-color:${color(item.id)}"></span>
                      Episode ${episode.episodeNumber}: ${episode.primaryTitle}
                    </td>
                    <td class="value">
                      ${episode.averageRating}
                    </td>
                  </tr>`;
                })
                .join('')}
              </table>`,
          },
          legend: {
            item: {
              onmouseover: () => null,
              onmouseout: () => null,
              onclick: () => null,
            },
            hide: allEpisodes ? true : false,
          },
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, data]);

  if (error) {
    return <p>Error: {error.message}</p>;
  } else if (!isLoaded || !data) {
    return <p>Loading...</p>;
  } else {
    return (
      <div className="chart-wrapper">{isLoaded && <div id="chart"></div>}</div>
    );
  }
};

export default Chart;
