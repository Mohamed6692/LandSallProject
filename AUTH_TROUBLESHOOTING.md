# Dépannage de l'authentification - Problème de reconnexion

## Problème identifié

Le problème était que lors de la déconnexion suivie d'une tentative de reconnexion, le système d'authentification ne fonctionnait pas correctement, alors qu'il fonctionnait après un enregistrement.

## Causes identifiées

1. **Gestion incomplète de l'état après déconnexion** : Les données d'authentification n'étaient pas complètement nettoyées
2. **Pas de gestion d'erreur dans le login** : Les erreurs de connexion n'étaient pas correctement gérées
3. **Formulaire non réinitialisé** : Le formulaire de login conservait des valeurs précédentes
4. **Pas de vérification de l'état au démarrage** : L'état d'authentification n'était pas vérifié au chargement de la page

## Solutions implémentées

### 1. Amélioration du service d'authentification (`auth.service.ts`)

- **Méthode `clearAuthData()`** : Nettoie complètement toutes les données d'authentification
- **Gestion d'erreur améliorée** : Ajout de `catchError` pour gérer les erreurs de connexion
- **Parsing sécurisé** : Vérification des données JSON stockées dans localStorage
- **Nettoyage avant login** : Suppression des données précédentes avant une nouvelle connexion
- **Méthode `refreshAuthState()`** : Pour rafraîchir l'état d'authentification

### 2. Amélioration du composant login (`login.component.ts`)

- **Initialisation du formulaire** : Réinitialisation complète du formulaire au démarrage
- **Vérification de l'état connecté** : Redirection automatique si déjà connecté
- **Gestion d'erreur améliorée** : Meilleure extraction des messages d'erreur
- **Conservation de l'email** : Après inscription, l'email est conservé pour faciliter la connexion

### 3. Amélioration de l'intercepteur HTTP (`auth.interceptor.ts`)

- **Gestion automatique des erreurs 401** : Déconnexion automatique en cas de token expiré
- **Redirection automatique** : Redirection vers la page de login en cas d'erreur d'authentification

### 4. Amélioration de la navbar (`navbar.component.ts`)

- **Rafraîchissement de l'état** : Vérification de l'état d'authentification au démarrage
- **Logs de débogage** : Ajout de logs pour tracer le processus de déconnexion

### 5. Ajout d'un bouton de test dans le dashboard

- **Bouton de test** : Pour faciliter les tests de déconnexion/reconnexion
- **Interface de test** : Section dédiée aux tests dans le dashboard

## Comment tester

### Test 1 : Déconnexion et reconnexion

1. Connectez-vous à l'application
2. Allez sur le dashboard
3. Cliquez sur "Déconnexion" dans la navbar
4. Vérifiez que vous êtes redirigé vers la page de login
5. Entrez vos identifiants et connectez-vous
6. Vérifiez que vous accédez au dashboard

### Test 2 : Test depuis le dashboard

1. Connectez-vous à l'application
2. Allez sur le dashboard
3. Cliquez sur "Tester la déconnexion" dans la section de test
4. Vérifiez que vous êtes redirigé vers la page de login
5. Entrez vos identifiants et connectez-vous
6. Vérifiez que vous accédez au dashboard

### Test 3 : Test avec token expiré

1. Connectez-vous à l'application
2. Modifiez manuellement le token dans localStorage (dans les outils de développement)
3. Essayez d'accéder à une page protégée
4. Vérifiez que vous êtes automatiquement déconnecté et redirigé

## Vérifications à faire

### Dans la console du navigateur

1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Console"
3. Effectuez les tests ci-dessus
4. Vérifiez qu'il n'y a pas d'erreurs JavaScript
5. Vérifiez les logs de débogage ajoutés

### Dans l'onglet Application/Storage

1. Allez dans l'onglet "Application" (Chrome) ou "Storage" (Firefox)
2. Vérifiez le localStorage
3. Après déconnexion, vérifiez que `token` et `user` sont supprimés
4. Après connexion, vérifiez que les nouvelles valeurs sont correctement stockées

## Points d'attention

### Backend

Assurez-vous que votre backend Spring Boot :
- Retourne les bonnes réponses d'erreur (401 pour token invalide)
- Gère correctement les tokens JWT
- Retourne les bonnes structures de données

### Configuration

Vérifiez que l'URL de l'API dans `environment.ts` correspond à votre backend :
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8081/api' // Ajustez le port si nécessaire
};
```

## Dépannage supplémentaire

Si le problème persiste :

1. **Vérifiez les logs du backend** : Assurez-vous que les requêtes arrivent correctement
2. **Vérifiez les requêtes réseau** : Dans l'onglet "Network" des outils de développement
3. **Testez avec Postman** : Vérifiez que l'API fonctionne correctement
4. **Vérifiez CORS** : Assurez-vous que le backend autorise les requêtes depuis le frontend

## Commandes utiles

```bash
# Démarrer le frontend
npm start

# Démarrer le backend (dans un autre terminal)
# ./mvnw spring-boot:run (ou votre commande de démarrage)

# Vérifier les dépendances
npm install

# Nettoyer le cache
npm cache clean --force
``` 