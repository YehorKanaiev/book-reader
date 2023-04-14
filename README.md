# BookReader

The application was created to open electronic books.
For now, it allows opening ePub books. It has an abstraction (abstract class Book) in order to add other book formats. Classes for other formats should extend the Book class.
The application uses NgRx to manage the application state.
The application allows to open users' books, but it also provides some samples to check out the app.
You can set dark mode if it is night outside.
## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Development

Run `husky-prepare` to install husky and pre-commit hooks. It will prevent creating commits with a bad code.
