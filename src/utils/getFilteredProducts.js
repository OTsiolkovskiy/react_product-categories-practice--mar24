export const getFilteredProducts = (
  products,
  selectedCategory,
  { query = '', selectedName = 'All', sortBy = '', sortingOrder = 'asc' },
) => {
  let filteredProducts = [...products];
  const normalizedQuery = query.toLocaleLowerCase().trim();

  if (normalizedQuery !== '') {
    filteredProducts = filteredProducts.filter(product => {
      const normalizedProductName = product.name.toLowerCase().trim();

      return normalizedProductName.includes(normalizedQuery);
    });
  }

  if (selectedName !== 'All') {
    filteredProducts = filteredProducts.filter(
      product => product.user.name === selectedName,
    );
  }

  if (sortBy !== '') {
    filteredProducts.sort((product1, product2) => {
      switch (sortBy) {
        case 'id':
          return product1 - product2;
        case 'product':
          return product1.name.localeCompare(product2.name);
        case 'category':
          return product1.category.title.localeCompare(product2.category.title);
        case 'user':
          return product1.user.name.localeCompare(product2.user.name);
        default:
          return 0;
      }
    });
  }

  if (sortingOrder !== 'asc') {
    filteredProducts.reverse();
  }

  if (selectedCategory !== '') {
    filteredProducts = filteredProducts.filter(product => {
      switch (selectedCategory) {
        case 'Grocery':
          return product.category.title === selectedCategory;
        case 'Drinks':
          return product.category.title === selectedCategory;
        case 'Fruits':
          return product.category.title === selectedCategory;
        case 'Electronics':
          return product.category.title === selectedCategory;
        case 'Clothes':
          return product.category.title === selectedCategory;
        default:
          return 0;
      }
    });
  }

  return filteredProducts;
};
