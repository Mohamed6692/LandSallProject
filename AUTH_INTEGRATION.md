# Intégration Frontend-Backend - Authentification

## Vue d'ensemble

Cette intégration permet de connecter le frontend Angular avec le backend Spring Boot pour la gestion de l'authentification des utilisateurs.

## Structure créée

### 1. Modèles TypeScript (`src/app/shared/models/user.model.ts`)
- `User`: Interface correspondant au modèle User du backend
- `UserDTO`: Interface pour les données de création d'utilisateur
- `AuthRequest`: Interface pour les requêtes de connexion
- `AuthResponse`: Interface pour les réponses d'authentification
- `UserProfile`: Interface pour les informations utilisateur simplifiées
- `Role`: Enumération des rôles utilisateur

### 2. Configuration d'environnement
- `src/environments/environment.ts` - Configuration de développement
- `src/environments/environment.prod.ts` - Configuration de production
- `env.example` - Exemple de variables d'environnement

### 3. Services de configuration
- `ConfigService` (`src/app/core/services/config.service.ts`) - Service centralisé pour les paramètres
- `ApiService` (`src/app/core/services/api.service.ts`) - Service utilitaire pour les URLs d'API

### 4. Service d'authentification (`src/app/core/services/auth.service.ts`)
- Gestion de la connexion (`login()`)
- Gestion de l'inscription (`register()`)
- Récupération des informations utilisateur (`getCurrentUser()`)
- Gestion de la déconnexion (`logout()`)
- Vérification de l'authentification (`isAuthenticated()`)
- Gestion du token JWT

### 5. Intercepteur HTTP (`src/app/core/interceptors/auth.interceptor.ts`)
- Ajout automatique du token JWT aux requêtes HTTP
- Gestion de l'autorisation Bearer

### 6. Guard d'authentification (`src/app/core/guards/auth.guard.ts`)
- Protection des routes nécessitant une authentification
- Redirection vers la page de connexion si non authentifié

### 7. Composants
- **LoginComponent**: Formulaire de connexion/inscription
- **NavbarComponent**: Barre de navigation avec gestion de l'état d'authentification
- **DashboardComponent**: Page protégée pour tester l'authentification

## Configuration

### 1. Configuration HTTP (`src/app/app.config.ts`)
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

### 2. Configuration des environnements

#### Développement (`src/environments/environment.ts`)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

#### Production (`src/environments/environment.prod.ts`)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

### 3. Routes (`src/app/app.routes.ts`)
```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard]
}
```

## Fonctionnalités

### Connexion
- Formulaire avec validation des champs
- Gestion des erreurs de connexion
- Stockage du token JWT dans localStorage
- Redirection vers le dashboard après connexion

### Inscription
- Formulaire complet avec tous les champs requis
- Validation des mots de passe
- Gestion des erreurs d'inscription
- Basculement automatique vers le mode connexion après inscription

### Protection des routes
- Routes protégées par le guard d'authentification
- Redirection automatique vers la page de connexion
- Vérification du token JWT

### Gestion de l'état utilisateur
- Observable pour suivre l'état de l'utilisateur connecté
- Persistance des données dans localStorage
- Mise à jour automatique de l'interface

## Utilisation

### 1. Démarrer le backend Spring Boot
```bash
# Dans le dossier du backend
./mvnw spring-boot:run
```

### 2. Démarrer le frontend Angular
```bash
# Développement
npm start

# Production
npm run build
```

### 3. Tester l'authentification
1. Accéder à `http://localhost:4200`
2. Cliquer sur "Connexion" dans la navbar
3. Créer un compte ou se connecter
4. Vérifier la redirection vers le dashboard
5. Tester la déconnexion

## Points d'API utilisés

### Backend Spring Boot
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Informations utilisateur connecté

### Frontend Angular
- Service `AuthService` pour toutes les communications HTTP
- Service `ApiService` pour la gestion des URLs
- Service `ConfigService` pour la configuration
- Intercepteur pour ajouter automatiquement le token JWT
- Guard pour protéger les routes

## Configuration des environnements

### Variables d'environnement
Le projet utilise les fichiers d'environnement Angular standard :
- `environment.ts` pour le développement
- `environment.prod.ts` pour la production

### Personnalisation de l'URL de l'API
Pour modifier l'URL de l'API, éditez le fichier d'environnement approprié :

```typescript
// src/environments/environment.ts (développement)
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // Modifier cette URL
};

// src/environments/environment.prod.ts (production)
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api' // Modifier cette URL
};
```

### Services de configuration
- `ConfigService` : Accès centralisé aux paramètres d'environnement
- `ApiService` : Gestion centralisée des URLs d'API

## Sécurité

- Token JWT stocké dans localStorage
- Validation côté client et serveur
- Intercepteur HTTP pour l'autorisation automatique
- Protection des routes sensibles

## Personnalisation

### Ajouter de nouveaux endpoints
1. Ajouter la méthode dans `ApiService`
2. Utiliser le service dans vos composants
3. L'URL sera automatiquement construite selon l'environnement

### Ajouter de nouvelles variables d'environnement
1. Ajouter la propriété dans les fichiers d'environnement
2. Ajouter la méthode getter dans `ConfigService`
3. Utiliser le service dans vos composants

### Personnaliser les styles
Les composants utilisent des styles inline pour faciliter la personnalisation. Modifier les propriétés CSS selon vos besoins. 