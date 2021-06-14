export const getJobsCountfromLinks = links => {
  const linkObj = links.filter(link => {
    return link.rel === 'last';
  });
  const queryString = linkObj[0].href;
  const urlParams = new URLSearchParams(queryString);
  const offset = urlParams.get('/jobs?offset');
  const limit = urlParams.get('limit');
  return +offset + +limit;
};
