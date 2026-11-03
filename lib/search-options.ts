export const SEARCH_OPTIONS = {
  fields: ["title", "headings", "description", "body"],
  storeFields: ["path", "title", "section", "description"],
  searchOptions: {
    prefix: true,
    fuzzy: 0.2,
    boost: { title: 4, headings: 2, description: 1.5 },
  },
};

