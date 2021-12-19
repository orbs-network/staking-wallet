const removeQueryParam = (name: string, history: any, search: any) => {
  const queryParams = new URLSearchParams(search);
  if (queryParams.has(name)) {
    queryParams.delete(name);
    history.replace({
      search: queryParams.toString(),
    });
  }
};

export { removeQueryParam };
