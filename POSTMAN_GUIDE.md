# 📬 Guide Postman - API GSB

Guide complet pour tester l'API GSB avec Postman.

---

## 📥 Configuration initiale

### 1. Créer une Collection

1. Ouvrir Postman
2. Cliquer sur "New" → "Collection"
3. Nommer : "GSB API"

### 2. Créer un Environment

1. Cliquer sur "Environments" → "Create Environment"
2. Nommer : "GSB Local"
3. Ajouter les variables :

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000` | `http://localhost:5000` |
| `token` | (vide) | (vide) |

4. Sauvegarder et sélectionner cet environment

---

## 🔓 Routes publiques (sans authentification)

### 1️⃣ Créer un utilisateur

**Méthode :** `POST`  
**URL :** `{{base_url}}/api/users`

**Headers :**
```
Content-Type: application/json
```

**Body (raw - JSON) :**
```json
{
  "name": "Alice Martin",
  "email": "alice.martin@example.com",
  "password": "motdepasse123",
  "role": "user"
}
```

**Réponse attendue (201) :**
```json
{
  "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
  "name": "Alice Martin",
  "email": "alice.martin@example.com",
  "role": "user",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2️⃣ Créer un admin

**Méthode :** `POST`  
**URL :** `{{base_url}}/api/users`

**Body (raw - JSON) :**
```json
{
  "name": "Bob Admin",
  "email": "bob.admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

---

### 3️⃣ Se connecter (Login)

**Méthode :** `POST`  
**URL :** `{{base_url}}/api/auth/login`

**Headers :**
```
Content-Type: application/json
```

**Body (raw - JSON) :**
```json
{
  "email": "alice.martin@example.com",
  "password": "motdepasse123"
}
```

**Réponse attendue (200) :**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjhhOWM3..."
}
```

**⚡ Script de test automatique (onglet "Tests") :**
```javascript
// Sauvegarder automatiquement le token dans l'environment
if (pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.token);
    console.log("Token sauvegardé :", jsonData.token);
}
```

---

### 4️⃣ Google OAuth (navigateur)

**URL à ouvrir dans un navigateur :**
```
http://localhost:5000/auth/google
```

Cela redirige vers Google pour l'authentification.

---

## 🔒 Routes protégées (nécessitent un JWT)

### Configuration du Header Authorization

Pour toutes les requêtes ci-dessous, ajouter le header :

**Headers :**
```
Authorization: Bearer {{token}}
```

Le `{{token}}` sera automatiquement remplacé par la valeur sauvegardée lors du login.

---

### 5️⃣ Récupérer tous les utilisateurs

**Méthode :** `GET`  
**URL :** `{{base_url}}/api/users`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Réponse attendue (200) :**
```json
[
  {
    "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
    "name": "Alice Martin",
    "email": "alice.martin@example.com",
    "role": "user",
    "type_sso": "local",
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "65f8a9c7d4e5f6g7h8i9j0k2",
    "name": "Bob Admin",
    "email": "bob.admin@example.com",
    "role": "admin",
    "type_sso": "local",
    "createdAt": "2024-01-15T10:31:00.000Z"
  }
]
```

---

### 6️⃣ Filtrer un utilisateur par email

**Méthode :** `GET`  
**URL :** `{{base_url}}/api/users?email=alice.martin@example.com`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Réponse attendue (200) :**
```json
[
  {
    "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
    "name": "Alice Martin",
    "email": "alice.martin@example.com",
    "role": "user",
    "type_sso": "local",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

### 7️⃣ Mettre à jour un utilisateur

**Méthode :** `PUT`  
**URL :** `{{base_url}}/api/users?email=alice.martin@example.com`

**Headers :**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw - JSON) :**
```json
{
  "name": "Alice Dupont",
  "newEmail": "alice.dupont@example.com",
  "password": "nouveauMotDePasse",
  "role": "admin"
}
```

**Réponse attendue (200) :**
```json
{
  "_id": "65f8a9c7d4e5f6g7h8i9j0k1",
  "name": "Alice Dupont",
  "email": "alice.dupont@example.com",
  "role": "admin",
  "type_sso": "local",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 8️⃣ Supprimer un utilisateur

**Méthode :** `DELETE`  
**URL :** `{{base_url}}/api/users?email=alice.martin@example.com`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Réponse attendue (200) :**
```json
{
  "message": "User deleted"
}
```

---

## 💰 Routes des factures

### 9️⃣ Créer une facture (avec upload)

**Méthode :** `POST`  
**URL :** `{{base_url}}/api/bills`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Body (form-data) :**

| Key | Type | Value |
|-----|------|-------|
| `metadata` | Text | `{"date":"2024-01-15","amount":45.50,"description":"Déjeuner client","status":"pending","type":"repas"}` |
| `proof` | File | Sélectionner une image (.jpg, .png, .gif) |

**Réponse attendue (201) :**
```json
{
  "_id": "65f8b1d8e5f6g7h8i9j0k2",
  "date": "2024-01-15",
  "amount": 45.50,
  "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
  "description": "Déjeuner client",
  "status": "pending",
  "type": "repas",
  "user": "65f8a9c7d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

---

### 🔟 Récupérer les factures

**Méthode :** `GET`  
**URL :** `{{base_url}}/api/bills`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Logique :**
- Si l'utilisateur est **admin** → retourne toutes les factures
- Si l'utilisateur est **user** → retourne uniquement ses factures

**Réponse attendue (200) :**
```json
[
  {
    "_id": "65f8b1d8e5f6g7h8i9j0k2",
    "date": "2024-01-15",
    "amount": 45.50,
    "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
    "description": "Déjeuner client",
    "status": "pending",
    "type": "repas",
    "user": "65f8a9c7d4e5f6g7h8i9j0k1",
    "createdAt": "2024-01-15T14:20:00.000Z"
  }
]
```

---

### 1️⃣1️⃣ Récupérer une facture par ID

**Méthode :** `GET`  
**URL :** `{{base_url}}/api/bills/65f8b1d8e5f6g7h8i9j0k2`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Réponse attendue (200) :**
```json
{
  "_id": "65f8b1d8e5f6g7h8i9j0k2",
  "date": "2024-01-15",
  "amount": 45.50,
  "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
  "description": "Déjeuner client",
  "status": "pending",
  "type": "repas",
  "user": "65f8a9c7d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

---

### 1️⃣2️⃣ Mettre à jour une facture (admin)

**Méthode :** `PUT`  
**URL :** `{{base_url}}/api/bills/65f8b1d8e5f6g7h8i9j0k2`

**Headers :**
```
Authorization: Bearer {{token}}
Content-Type: application/json
```

**Body (raw - JSON) :**
```json
{
  "status": "approved",
  "amount": 50.00,
  "description": "Déjeuner client - Mis à jour"
}
```

**Réponse attendue (200) :**
```json
{
  "_id": "65f8b1d8e5f6g7h8i9j0k2",
  "date": "2024-01-15",
  "amount": 50.00,
  "proof": "https://gsb-bucket.s3.amazonaws.com/proof_12345.jpg",
  "description": "Déjeuner client - Mis à jour",
  "status": "approved",
  "type": "repas",
  "user": "65f8a9c7d4e5f6g7h8i9j0k1",
  "createdAt": "2024-01-15T14:20:00.000Z"
}
```

---

### 1️⃣3️⃣ Supprimer une facture

**Méthode :** `DELETE`  
**URL :** `{{base_url}}/api/bills/65f8b1d8e5f6g7h8i9j0k2`

**Headers :**
```
Authorization: Bearer {{token}}
```

**Réponse attendue (200) :**
```json
{
  "message": "Bill deleted"
}
```

---

## 🔄 Scénario complet de test

### Scénario : Utilisateur crée et admin valide une facture

1. **Créer un utilisateur normal**
   - POST `/api/users` avec `role: "user"`

2. **Créer un admin**
   - POST `/api/users` avec `role: "admin"`

3. **Se connecter en tant qu'utilisateur**
   - POST `/api/auth/login` avec email de l'utilisateur
   - Sauvegarder le token dans `{{token}}`

4. **Créer une facture**
   - POST `/api/bills` avec metadata et image
   - Noter l'ID de la facture créée

5. **Vérifier ses factures**
   - GET `/api/bills`
   - Devrait retourner uniquement la facture créée (status: "pending")

6. **Se connecter en tant qu'admin**
   - POST `/api/auth/login` avec email de l'admin
   - Remplacer `{{token}}` par le nouveau token

7. **Voir toutes les factures (admin)**
   - GET `/api/bills`
   - Devrait retourner toutes les factures de tous les utilisateurs

8. **Valider la facture**
   - PUT `/api/bills/:id` avec `{ "status": "approved" }`

9. **Se reconnecter en tant qu'utilisateur**
   - POST `/api/auth/login` avec email de l'utilisateur

10. **Vérifier le statut**
    - GET `/api/bills`
    - La facture devrait avoir status: "approved"

---

## ❌ Codes d'erreur

| Code | Signification | Cause probable |
|------|---------------|----------------|
| 400 | Bad Request | Données manquantes ou invalides |
| 401 | Unauthorized | Token manquant, invalide ou expiré |
| 403 | Forbidden | Permissions insuffisantes (non-admin) |
| 404 | Not Found | Ressource introuvable |
| 500 | Internal Server Error | Erreur serveur (vérifier les logs) |

---

## 🛠️ Scripts utiles

### Script de pré-requête (Pre-request Script)

Pour logger les détails de la requête :
```javascript
console.log("Requête vers :", pm.request.url.toString());
console.log("Token utilisé :", pm.environment.get("token") ? "✓" : "✗");
```

### Script de test (Tests)

Pour vérifier automatiquement les réponses :
```javascript
// Vérifier le status code
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Vérifier le format JSON
pm.test("Response is JSON", function () {
    pm.response.to.be.json;
});

// Vérifier la présence d'un champ
pm.test("Response has token", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('token');
});
```

---

## 📦 Exporter/Importer la collection

### Exporter
1. Cliquer sur "..." à côté de votre collection
2. "Export"
3. Choisir "Collection v2.1"
4. Sauvegarder le fichier JSON

### Importer
1. Cliquer sur "Import"
2. Sélectionner le fichier JSON
3. La collection est importée avec toutes les requêtes

---

## 🎯 Bonnes pratiques

1. **Utiliser des variables d'environnement** pour `base_url` et `token`
2. **Organiser les requêtes par dossiers** (Auth, Users, Bills)
3. **Sauvegarder automatiquement le token** avec un script de test
4. **Nommer clairement les requêtes** (ex: "1. Login User", "2. Create Bill")
5. **Ajouter des descriptions** pour expliquer chaque requête
6. **Tester les cas d'erreur** (token invalide, données manquantes, etc.)
7. **Créer des environnements séparés** (Local, Staging, Production)

---

## 📞 Aide

En cas de problème :
1. ✅ Vérifier que le serveur backend est démarré
2. ✅ Vérifier les variables d'environnement Postman
3. ✅ Vérifier le format du token (Bearer + espace + token)
4. ✅ Consulter les logs du serveur backend
5. ✅ Tester d'abord les routes publiques (login)
6. ✅ Vérifier la date d'expiration du JWT (24h)

---

**✨ Happy Testing !**

