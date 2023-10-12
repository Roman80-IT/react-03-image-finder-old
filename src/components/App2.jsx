import React, { Component } from 'react';
import axios from 'axios';
import { ImageGallery } from './ImageGallery';
import { Searchbar } from './Searchbar';
import { Button } from './Button';
import { Modal } from './Modal';
import { Loader } from './Loader';
import { Message } from './Message';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38400655-50a1fa45dda9b327a83dd0d24';
const PER_PAGE = 12;

class App extends Component {
  state = {
    query: '',
    images: [],
    totalImages: 0,
    page: 1,
    selectedImageUrl: '',
    loading: false,
    error: false,
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.page !== prevState.page ||
      this.state.query !== prevState.query
    ) {
      this.fetchImages();
    }
  }

  fetchImages = async () => {
    const { query, page } = this.state;
    this.setState({ loading: true, error: false });

    try {
      const response = await axios.get(
        `${BASE_URL}?key=${API_KEY}&q=${query}&per_page=${PER_PAGE}&page=${page}`
      );

      this.setState(prevState => ({
        images: [...prevState.images, ...response.data.hits],
        totalImages: response.data.totalHits,
      }));
    } catch (error) {
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSearch = query => {
    this.setState({
      query,
      page: 1,
      images: [],
      totalImages: 0,
    });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({
      page: prevState.page + 1,
    }));
  };

  handleImageClick = url => {
    this.setState({ selectedImageUrl: url });
  };

  handleCloseModal = () => {
    this.setState({ selectedImageUrl: '' });
  };

  render() {
    const { images, loading, error, query, selectedImageUrl, totalImages } =
      this.state;

    return (
      <div className="App">
        <Searchbar onSubmit={this.handleSearch} />
        {images.length > 0 && (
          <ImageGallery images={images} onImageClick={this.handleImageClick} />
        )}
        {loading && <Loader />}
        {images.length > 0 && totalImages > PER_PAGE * this.state.page && (
          <Button onClick={this.handleLoadMore} />
        )}
        <Message
          error={error}
          empty={images.length === 0 && query !== '' && !loading}
        />
        <Modal
          url={selectedImageUrl}
          onModalClose={this.handleCloseModal}
          query={query}
        />
      </div>
    );
  }
}

export default App;
