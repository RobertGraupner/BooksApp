const templates = {
  bookTemplate: Handlebars.compile(document.querySelector('#template-book').innerHTML),
};

class Bookslist {
  constructor() {
    const thisBook = this;
    thisBook.initData();
    thisBook.getElements();
    thisBook.render();
    thisBook.initActions();
  }

  initData() {
    this.data = dataSource.books;  
  }

  getElements() {
    const thisBook = this;

    thisBook.bookList = document.querySelector('.books-list');
    thisBook.form = document.querySelector('.filters');
    thisBook.favoriteBooks = [];
    thisBook.filters = [];
  }

  render() {
    const thisBook = this;
    for (let book of this.data) {
      const ratingWidth = book.rating * 10;
      const ratingBgc = thisBook.determineRatingBgc(book.rating);

      let dataBook = {
        id: book.id,
        name: book.name,
        price: book.price,
        image: book.image,
        rating: book.rating,
        ratingWidth: ratingWidth,
        ratingBgc: ratingBgc,
      };
      /* generate HTML based on template */
      const generatedHTML = templates.bookTemplate(dataBook);
      /* zamiana html na element DOM */
      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      /* add element to DOM */
      const listClass = document.querySelector('.books-list');
      listClass.appendChild(generatedDOM);
    }
  }

  initActions() {
    const thisBook = this;

    thisBook.bookList.addEventListener('dblclick', function (event) {
      event.preventDefault();
      const image = event.target.offsetParent;
      let bookId;

      if (!image.classList.contains('favorite')) {
        image.classList.add('favorite');
        bookId = image.getAttribute('data-id');
        thisBook.favoriteBooks.push(bookId);
      } else {
        image.classList.remove('favorite');
        thisBook.favoriteBooks.splice(thisBook.favoriteBooks.indexOf(bookId));
      }
      //console.log(thisBook.favoriteBooks);
    });


    thisBook.form.addEventListener('change', function (event) {
      event.preventDefault();
      if (
        event.target.tagName === 'INPUT' &&
				event.target.type === 'checkbox' &&
				event.target.name === 'filter'
      ) {
        if (event.target.checked) {
          thisBook.filters.push(event.target.value);
        } else {
          thisBook.filters.splice(thisBook.filters.indexOf(event.target.value));
        }
        //console.log(thisBook.filters);
      }
      thisBook.filterBooks();
    });
  }

  filterBooks() {
    const thisBook = this;
    for (let book of dataSource.books) {
      let shouldBeHidden = false;
      for (let filter of thisBook.filters) {
        if (!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      if (shouldBeHidden) {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.add('hidden');
      } else {
        document.querySelector('.book__image[data-id="' + book.id + '"]').classList.remove('hidden');
      }
    }
  }

  determineRatingBgc(rating){
    let background;
    if(rating < 6){
      background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
    } else if(rating > 6 && rating <= 8){
      background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
    } else if (rating > 8 && rating <= 9){
      background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
    }
    else if (rating > 9){
      background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
    }
    return background;
  }
}

const app = new Bookslist();
app; // da sie to obejsc zeby npm run watch puszczal bez pisania tego?:)
