/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { getFilteredProducts } from './utils/getFilteredProducts';

function getCategory(id) {
  return categoriesFromServer.find(category => category.id === id) || null;
}

function getUser(ownerId) {
  return usersFromServer.find(user => user.id === ownerId) || null;
}

const products = productsFromServer.map(product => {
  const { categoryId } = product;
  const currentCategory = getCategory(categoryId);

  return {
    ...product,
    category: currentCategory,
    user: getUser(currentCategory.ownerId),
  };
});

const uniqueCategory = categoriesFromServer.reduce((acc, product) => {
  const currentCategory = product.title;

  if (!acc.includes(currentCategory)) {
    acc.push(currentCategory);
  }

  return acc;
}, []);

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState('All');
  const [sortBy, setsortBy] = useState('');
  const [sortingOrder, setsortingOrder] = useState('asc');
  const [selectedCategory, setselectedCategory] = useState('');

  const filteredProducts = getFilteredProducts(products, selectedCategory, {
    query,
    selectedName,
    sortBy,
    sortingOrder,
  });

  const handleResetAll = () => {
    setQuery('');
    setSelectedName('All');
    setsortBy('');
    setsortingOrder('asc');
    setselectedCategory('');
  };

  const handleSort = newValue => {
    if (sortBy !== newValue) {
      setsortBy(newValue);
      setsortingOrder('asc');

      return;
    }

    if (sortBy === newValue && sortingOrder === 'asc') {
      setsortingOrder('desc');

      return;
    }

    setsortBy('');
    setsortingOrder('asc');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedName('All')}
                className={selectedName === 'All' ? 'is-active' : ''}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedName(user.name)}
                  className={selectedName === user.name ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setselectedCategory('')}
              >
                All
              </a>
              {uniqueCategory.map(product => (
                <a
                  key={product}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  onClick={() => setselectedCategory(product)}
                >
                  {product}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => handleResetAll()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('product')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('category')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th onClick={() => handleSort('user')}>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 && 'No results'}
              {filteredProducts.map(product => (
                <tr data-cy="Product" key={product}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {product.category.icon} - {product.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={
                      product.user.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {product.user.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
