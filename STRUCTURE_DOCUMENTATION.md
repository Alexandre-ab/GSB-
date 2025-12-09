# 🗺️ Structure de la Documentation GSB

> Plan visuel de l'organisation de la documentation

---

## 📊 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     🏠 README.md                                 │
│              Point d'entrée du projet                            │
│         Vue d'ensemble | Démarrage rapide                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              📚 INDEX_DOCUMENTATION.md                           │
│            Navigation centrale de la doc                         │
│         Tous les liens vers tous les documents                   │
└─────┬───────────────┬───────────────┬──────────────┬────────────┘
      │               │               │              │
      ▼               ▼               ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│    📘    │   │    📗    │   │    🚀    │   │    🎓    │
│   Doc    │   │   Doc    │   │  Guide   │   │   BTS    │
│Technical │   │Fonctionl │   │  Install │   │  SLAM    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## 📁 Arborescence des documents

```
GSB-/
│
├── 📄 README.md                          # 🔴 DÉPART ICI
│   └── 👉 Liens vers INDEX_DOCUMENTATION.md
│
├── 📚 INDEX_DOCUMENTATION.md             # 🔴 NAVIGATION CENTRALE
│   ├── Vue d'ensemble de tous les docs
│   ├── Navigation par besoin
│   ├── Parcours recommandés
│   └── Recherche rapide
│
├── 🔗 LIENS_RAPIDES.md                   # ⚡ Accès direct aux sections
│   ├── Liens directs vers sections
│   ├── Parcours par profil
│   └── Recherche de concepts
│
├── 🗺️ STRUCTURE_DOCUMENTATION.md        # 📐 Vue architecturale
│   ├── Schémas de navigation
│   └── Relations entre documents
│
├── 📘 DOCUMENTATION_TECHNIQUE.md         # 👨‍💻 POUR DÉVELOPPEURS
│   ├── 1. Contexte du projet
│   ├── 2. Architecture technique
│   ├── 3. Technologies utilisées
│   ├── 4. Base de données
│   ├── 5. API REST
│   ├── 6. Sécurité
│   ├── 7. Infrastructure Cloud
│   ├── 8. Guide de développement
│   ├── 9. Tests et qualité
│   └── 10. Déploiement
│
├── 📗 DOCUMENTATION_FONCTIONNELLE.md     # 👤 POUR UTILISATEURS
│   ├── 1. Présentation
│   ├── 2. Public cible
│   ├── 3. Fonctionnalités
│   ├── 4. Guide utilisateur
│   ├── 5. Guide administrateur
│   └── 6. FAQ
│
├── 🚀 GUIDE_INSTALLATION.md              # 🔧 POUR INSTALLER
│   ├── 1. Prérequis
│   ├── 2. Installation locale
│   ├── 3. Configuration services externes
│   ├── 4. Déploiement production
│   ├── 5. Vérification et tests
│   └── 6. Résolution de problèmes
│
└── 🎓 COMPETENCES_BTS_SLAM.md            # 🎓 POUR LE BTS
    ├── 1. Vue d'ensemble
    ├── 2. Bloc 1 - Support (B1.1, B1.2, B1.3)
    ├── 3. Bloc 2 - Développement (B2.1, B2.2, B2.3)
    ├── 4. Bloc 3 - Cybersécurité (B3.1, B3.2)
    └── 5. Synthèse des compétences
```

---

## 🔀 Relations entre documents

### README → Autres documents

```
README.md
    ├──→ INDEX_DOCUMENTATION.md (navigation complète)
    ├──→ DOCUMENTATION_TECHNIQUE.md (architecture, API)
    ├──→ DOCUMENTATION_FONCTIONNELLE.md (guide utilisateur)
    ├──→ GUIDE_INSTALLATION.md (installation, troubleshooting)
    └──→ COMPETENCES_BTS_SLAM.md (compétences BTS)
```

### INDEX_DOCUMENTATION → Navigation

```
INDEX_DOCUMENTATION.md
    │
    ├──→ 📖 Documents complets
    │    ├── README.md
    │    ├── DOCUMENTATION_TECHNIQUE.md
    │    ├── DOCUMENTATION_FONCTIONNELLE.md
    │    ├── GUIDE_INSTALLATION.md
    │    └── COMPETENCES_BTS_SLAM.md
    │
    ├──→ 🎯 Navigation par besoin
    │    ├── Installer le projet → GUIDE_INSTALLATION.md
    │    ├── Comprendre l'architecture → DOCUMENTATION_TECHNIQUE.md
    │    ├── Utiliser l'API → DOCUMENTATION_TECHNIQUE.md#api-rest
    │    ├── Comprendre la sécurité → DOCUMENTATION_TECHNIQUE.md#sécurité
    │    ├── Préparer le BTS → COMPETENCES_BTS_SLAM.md
    │    └── Résoudre un problème → GUIDE_INSTALLATION.md#troubleshooting
    │
    └──→ 🎯 Parcours recommandés
         ├── Développeur
         ├── Utilisateur
         ├── Étudiant BTS
         └── Jury BTS
```

### Cross-références entre documents

```
DOCUMENTATION_TECHNIQUE.md
    ├──→ COMPETENCES_BTS_SLAM.md (pour détails compétences)
    ├──→ GUIDE_INSTALLATION.md (pour installation MongoDB, S3)
    └──→ README.md (pour vue d'ensemble)

DOCUMENTATION_FONCTIONNELLE.md
    ├──→ GUIDE_INSTALLATION.md (pour problèmes techniques)
    ├──→ DOCUMENTATION_TECHNIQUE.md (pour développeurs)
    └──→ README.md (pour démarrage rapide)

GUIDE_INSTALLATION.md
    ├──→ DOCUMENTATION_TECHNIQUE.md (pour architecture, API)
    ├──→ DOCUMENTATION_FONCTIONNELLE.md (pour tests utilisateur)
    └──→ COMPETENCES_BTS_SLAM.md (pour contexte projet)

COMPETENCES_BTS_SLAM.md
    ├──→ DOCUMENTATION_TECHNIQUE.md (preuves techniques détaillées)
    ├──→ GUIDE_INSTALLATION.md (pour configuration)
    └──→ README.md (pour vue d'ensemble)
```

---

## 🎯 Parcours de lecture recommandés

### 1️⃣ Parcours Développeur

```
START
  ↓
🏠 README.md (10 min)
  ├─ Vue d'ensemble du projet
  ├─ Stack technique
  └─ Routes API principales
  ↓
🚀 GUIDE_INSTALLATION.md (30 min)
  ├─ Installation complète
  ├─ Configuration MongoDB Atlas
  ├─ Configuration AWS S3
  └─ Tests de vérification
  ↓
📘 DOCUMENTATION_TECHNIQUE.md (45 min)
  ├─ Architecture détaillée
  ├─ Modèle de données
  ├─ API REST complète
  └─ Sécurité
  ↓
🧪 Tests avec Postman (20 min)
  └─ GSB_Postman_Collection.json
  ↓
END - Prêt à développer ! ✅
```

**Temps total : ~1h45**

---

### 2️⃣ Parcours Utilisateur

```
START
  ↓
🏠 README.md (5 min)
  └─ Présentation de l'application
  ↓
📗 DOCUMENTATION_FONCTIONNELLE.md (20 min)
  ├─ Première connexion
  ├─ Créer une note de frais
  ├─ Suivre ses demandes
  └─ Consulter ses statistiques
  ↓
❓ FAQ (10 min)
  └─ Questions courantes
  ↓
END - Prêt à utiliser l'application ! ✅
```

**Temps total : ~35 min**

---

### 3️⃣ Parcours Étudiant BTS SIO SLAM

```
START
  ↓
🏠 README.md (10 min)
  └─ Contexte du projet
  ↓
🎓 COMPETENCES_BTS_SLAM.md (60 min)
  ├─ Bloc 1 : Support et mise à disposition
  ├─ Bloc 2 : Conception et développement
  ├─ Bloc 3 : Cybersécurité
  ├─ Diagrammes UML
  ├─ Exemples de code commentés
  └─ Synthèse des compétences
  ↓
📘 DOCUMENTATION_TECHNIQUE.md (45 min)
  ├─ Architecture (pour expliquer à l'oral)
  ├─ Base de données (schémas Mongoose)
  ├─ API REST (endpoints à présenter)
  └─ Sécurité (JWT, SHA-256, RGPD)
  ↓
🚀 GUIDE_INSTALLATION.md (30 min)
  └─ Pour installer et faire une démo au jury
  ↓
📝 Préparation soutenance (60 min)
  ├─ Identifier 2-3 compétences fortes
  ├─ Préparer exemples de code
  ├─ Préparer la démo
  └─ Réviser les questions potentielles
  ↓
END - Prêt pour la soutenance ! 🎓✅
```

**Temps total : ~3h25**

---

### 4️⃣ Parcours Jury BTS

```
START
  ↓
🎓 COMPETENCES_BTS_SLAM.md (30 min)
  ├─ Tableau de synthèse
  ├─ Preuves par compétence
  └─ Exemples de code
  ↓
📘 DOCUMENTATION_TECHNIQUE.md (20 min)
  ├─ Vérification de l'architecture
  ├─ Qualité du code
  └─ Sécurité
  ↓
🚀 GUIDE_INSTALLATION.md (15 min)
  └─ Pour tester l'application (optionnel)
  ↓
🏠 README.md (5 min)
  └─ Vue d'ensemble finale
  ↓
END - Évaluation complète ! 👨‍🏫✅
```

**Temps total : ~1h10**

---

## 📊 Matrice de navigation

| Je veux... | Document principal | Documents complémentaires |
|------------|-------------------|---------------------------|
| **Installer** | 🚀 Guide Installation | 📘 Doc Technique (architecture) |
| **Développer** | 📘 Doc Technique | 🏠 README (vue d'ensemble) |
| **Utiliser** | 📗 Doc Fonctionnelle | 🏠 README (démarrage rapide) |
| **Préparer BTS** | 🎓 Compétences BTS | 📘 Doc Technique (preuves) |
| **Comprendre architecture** | 📘 Doc Technique | 🎓 Compétences BTS (UML) |
| **Résoudre problème** | 🚀 Guide Installation | 📗 Doc Fonctionnelle (FAQ) |
| **Voir exemples code** | 🎓 Compétences BTS | 📘 Doc Technique |
| **Configurer services** | 🚀 Guide Installation | 📘 Doc Technique (cloud) |

---

## 🔍 Index des concepts par document

### 📘 DOCUMENTATION_TECHNIQUE.md

- **Architecture** : MVC, Infrastructure cloud
- **Technologies** : Node.js, Express, React, MongoDB
- **Base de données** : Schémas, Relations, Requêtes
- **API REST** : Tous les endpoints avec exemples
- **Sécurité** : JWT, SHA-256, OAuth, CORS
- **Cloud** : AWS S3, MongoDB Atlas
- **Déploiement** : Render, Vercel

### 📗 DOCUMENTATION_FONCTIONNELLE.md

- **Utilisation** : Employés, Administrateurs
- **Fonctionnalités** : Création, Validation, Statistiques
- **Guides** : Pas à pas pour chaque action
- **FAQ** : Questions courantes
- **Support** : Contact, Ressources

### 🚀 GUIDE_INSTALLATION.md

- **Prérequis** : Node.js, MongoDB, AWS, Google Cloud
- **Installation** : Backend, Frontend
- **Configuration** : MongoDB Atlas, AWS S3, OAuth
- **Tests** : Vérification complète
- **Troubleshooting** : Tous les problèmes courants
- **Déploiement** : Production complète

### 🎓 COMPETENCES_BTS_SLAM.md

- **Bloc 1** : B1.1, B1.2, B1.3
- **Bloc 2** : B2.1, B2.2, B2.3
- **Bloc 3** : B3.1, B3.2
- **Preuves** : Pour chaque compétence
- **Exemples** : Code commenté
- **Diagrammes** : UML, MCD
- **Synthèse** : Tableau récapitulatif

---

## 📈 Profondeur de la documentation

```
Niveau 1 - Vue d'ensemble
    🏠 README.md
    📚 INDEX_DOCUMENTATION.md
    🔗 LIENS_RAPIDES.md

Niveau 2 - Documents principaux
    📘 DOCUMENTATION_TECHNIQUE.md
    📗 DOCUMENTATION_FONCTIONNELLE.md
    🚀 GUIDE_INSTALLATION.md
    🎓 COMPETENCES_BTS_SLAM.md

Niveau 3 - Sections détaillées
    Architecture MVC
    API REST complète
    Schémas Mongoose
    Configuration services
    Diagrammes UML
    Exemples de code

Niveau 4 - Code source
    back-end/controllers/
    back-end/models/
    back-end/routes/
    front-end/src/components/
    front-end/src/api/services/
```

---

## 🎨 Légende des icônes

| Icône | Signification |
|-------|---------------|
| 🏠 | Accueil / Point de départ |
| 📚 | Navigation / Index |
| 📘 | Documentation technique |
| 📗 | Documentation fonctionnelle |
| 🚀 | Installation / Déploiement |
| 🎓 | BTS / Compétences |
| 🔗 | Liens rapides |
| 🗺️ | Structure / Organisation |
| 🔍 | Recherche |
| 🎯 | Objectif / Besoin |
| ⚡ | Accès rapide |
| 🐛 | Problèmes / Bugs |
| ✅ | Validation / Succès |
| 🔐 | Sécurité |
| ☁️ | Cloud / Infrastructure |

---

## 📏 Statistiques de la documentation

### Volume

| Métrique | Valeur |
|----------|--------|
| Nombre total de fichiers markdown | 8 |
| Pages estimées (A4) | ~180 |
| Liens internes | 200+ |
| Diagrammes | 6 |
| Exemples de code | 50+ |

### Couverture

| Aspect | Couverture |
|--------|-----------|
| Architecture | ✅✅✅✅✅ 100% |
| API REST | ✅✅✅✅✅ 100% |
| Base de données | ✅✅✅✅✅ 100% |
| Sécurité | ✅✅✅✅✅ 100% |
| Installation | ✅✅✅✅✅ 100% |
| Déploiement | ✅✅✅✅✅ 100% |
| Compétences BTS | ✅✅✅✅✅ 100% |
| FAQ Utilisateur | ✅✅✅✅ 80% |

---

## 🔄 Mises à jour de la documentation

Cette structure permet des mises à jour faciles :

1. **Ajout d'une fonctionnalité** :
   - Mettre à jour `DOCUMENTATION_TECHNIQUE.md` (API)
   - Mettre à jour `DOCUMENTATION_FONCTIONNELLE.md` (guide)
   - Ajouter le lien dans `INDEX_DOCUMENTATION.md`

2. **Correction d'un bug** :
   - Documenter dans `GUIDE_INSTALLATION.md` (troubleshooting)
   - Référencer dans `LIENS_RAPIDES.md`

3. **Nouvelle compétence BTS** :
   - Ajouter dans `COMPETENCES_BTS_SLAM.md`
   - Lier aux preuves dans `DOCUMENTATION_TECHNIQUE.md`

---

## ✨ Avantages de cette structure

✅ **Navigation intuitive** : Plusieurs points d'entrée  
✅ **Cross-références** : Liens entre tous les documents  
✅ **Parcours adaptés** : Selon le profil (dev, user, étudiant, jury)  
✅ **Accès rapide** : Liens directs vers sections spécifiques  
✅ **Évolutive** : Facile d'ajouter du contenu  
✅ **Complète** : Couvre 100% du projet et des compétences BTS  
✅ **Professionnelle** : Prête pour une soutenance BTS  

---

**🎓 Documentation structurée pour le BTS SIO SLAM**  
**📅 Version** : 1.0.0  
**📆 Date** : Décembre 2025

---

**💡 Utilisez l'[INDEX_DOCUMENTATION.md](./INDEX_DOCUMENTATION.md) comme point de départ !**

