# Laravel + React Starter Project

This project combines [Laravel](https://laravel.com/) as the backend API and [React](https://react.dev/) as the frontend. Follow these instructions to set up, configure, and run the application locally.

---

## Prerequisites

- **PHP** >= 8.x
- **Composer**
- **Node.js** & **npm**
- **MySQL** or your preferred database (optional, but recommended)

---

## 1. Clone the Repository

```bash
git clone https://github.com/The-Artificium/Template.git
cd Template
```

---

## 2. Configure Environment Variables

### Laravel Backend

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2. Open `.env` in a text editor and update the following as needed:

    ```env
    APP_NAME=Laravel
    APP_ENV=local
    APP_KEY=base64:YOUR_APP_KEY_HERE
    APP_DEBUG=true
    APP_URL=http://localhost

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=your_database
    DB_USERNAME=your_username
    DB_PASSWORD=your_password

    GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your-client-secret
    GOOGLE_REDIRECT_URL=http://localhost:8000/auth/google/callback

    ```

3. Generate the Laravel application key:

    ```bash
    php artisan key:generate
    ```



## 3. Install Dependencies

### Laravel

```bash
composer install
```

### React

```bash
npm install
```

---

## 4. Run Migrations (Laravel)

Make sure your database is configured correctly in `.env`, then run:

```bash
php artisan migrate
php artisan db:seed
```

---

## 5. Start the Application

### Laravel Backend

```bash
php artisan serve
```
By default, this runs at `http://localhost:8000`.

### React Frontend

Open a new terminal window, navigate to the React directory, and run:

```bash
npm start
```
By default, this runs at `http://localhost:3000`.

---

## 6. Access the App

- **Backend API:** [http://localhost:8000](http://localhost:8000)
- **Frontend React App:** [http://localhost:3000](http://localhost:3000)

---

## Troubleshooting

- Ensure all environment variables are set correctly.
- If you encounter permission errors, run `chmod -R 775 storage bootstrap/cache` in your Laravel directory.
- Make sure your database server is running.

---

## Customizing

- **API Endpoints:** Add or modify Laravel routes/controllers in `routes/api.php` and `app/Http/Controllers`.
- **React Components:** Edit or create components in `client/src/`.

---

## License

This project is open source and available under the [MIT license](LICENSE).
