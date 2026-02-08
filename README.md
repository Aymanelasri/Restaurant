# Système de Gestion de Restaurant

Un système complet de gestion de restaurant reliant un backend Laravel et un frontend React Dashboard.

## Composants

### 1. Backend Laravel (gustobackend)
- **Chemin**: `gustobackend/`
- **Technologies**: Laravel 10, MySQL, Laravel Sanctum
- **Fonctionnalités**: API REST, Authentification, Gestion de base de données

### 2. Dashboard React (Dashboard)
- **Chemin**: `Dashboard/`
- **Technologies**: React, Bootstrap, Recharts
- **Fonctionnalités**: Tableau de bord administrateur, Visualisation de données, Opérations CRUD

### 3. Frontend React (gusto)
- **Chemin**: `gusto/`
- **Technologies**: React, React Router
- **Fonctionnalités**: Interface client, Menu, Réservations

## Installation et Démarrage

### Backend Laravel
```bash
cd gustobackend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

### Dashboard React
```bash
cd Dashboard
npm install
npm start
```

### Frontend React
```bash
cd gusto
npm install
npm start
```

## Points de terminaison API

### Authentification
- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `POST /api/logout` - Déconnexion

### Gestion des utilisateurs
- `GET /api/users` - Récupérer tous les utilisateurs
- `PUT /api/users/{id}` - Mettre à jour un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

### Gestion des commandes
- `GET /api/orders` - Récupérer toutes les commandes
- `POST /api/orders` - Créer une nouvelle commande
- `PUT /api/orders/{id}` - Mettre à jour le statut de la commande

### Gestion des réservations
- `GET /api/reservations` - Récupérer toutes les réservations
- `POST /api/reservations` - Créer une nouvelle réservation
- `PUT /api/reservations/{id}` - Mettre à jour le statut de la réservation

### Analytiques
- `GET /api/analytics` - Récupérer les statistiques du tableau de bord

## Fonctionnalités

### Fonctionnalités du Dashboard
- ✅ Statistiques complètes (utilisateurs, commandes, revenus)
- ✅ Gestion des utilisateurs (affichage, modification, suppression)
- ✅ Gestion des commandes (suivi du statut, mise à jour)
- ✅ Gestion des réservations (confirmation, annulation)
- ✅ Graphiques et analyses
- ✅ Interface responsive
- ✅ Système de connexion

### Fonctionnalités de l'API
- ✅ Authentification Laravel Sanctum
- ✅ Support CORS
- ✅ Conception API RESTful
- ✅ Validation des données
- ✅ Gestion des erreurs

## Base de données

### Tables principales
- `users` - Utilisateurs
- `orders` - Commandes
- `reservations` - Réservations
- `reviews` - Avis
- `tables` - Tables
- `products` - Produits
- `chefs` - Chefs

## Configuration

### Environnement Laravel
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=
```

### Environnement React
```env
REACT_APP_API_URL=http://localhost:8000/api
```

## Utilisation

1. Démarrer le backend Laravel sur `http://localhost:8000`
2. Démarrer le Dashboard React sur `http://localhost:3000`
3. Se connecter avec les identifiants admin
4. Gérer les données via le Dashboard

## Technologies utilisées

- **Backend**: PHP, Laravel 10, MySQL, Sanctum
- **Frontend**: React, JavaScript, Bootstrap, Recharts
- **Intégration API**: Fetch API, Axios

## Support

Pour toute aide ou question, veuillez consulter le code ou créer une nouvelle issue.
