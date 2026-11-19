# GitHub TP1 — Consultation des tickets

Application de suivi des tickets de support réalisée avec Vue 3, Vite, Axios et JSON Server.

## Prérequis et installation

Prérequis : Node.js et npm.

```sh
npm install
```

## Lancement

Dans un premier terminal, démarrez l’API :

```sh
npx json-server db.json --port 3000
```

Dans un second terminal, démarrez Vue :

```sh
npm run dev
```

Ouvrez l’adresse locale affichée par Vite. La page `/tickets` consulte l’endpoint
`http://localhost:3000/tickets`. Pour configurer une autre adresse, définissez `VITE_API_URL`
dans un fichier `.env.local` local et non versionné.

## Fonctionnalités

- Affichage des tickets avec leur titre, description, demandeur, priorité, statut et date.
- Chargement asynchrone avec Axios, état « Chargement… » et message en cas d’erreur API.
- Recherche réactive par titre et filtres combinables par statut et priorité.
- Nombre de résultats visibles et message lorsque la liste filtrée est vide.
- Badges visuels et accessibles pour les priorités et les statuts.

Les tickets de démonstration sont stockés dans `db.json`. Les fichiers `captures/` contiennent les
cinq captures demandées : réponse GET, liste, recherche, filtres combinés et erreur API.

## Questions

- **Quelle différence entre une API REST et `db.json` ?** L’API REST est l’interface HTTP qui
  expose des ressources et des opérations (GET, POST, PUT, PATCH, DELETE). `db.json` est le
  fichier de données utilisé par JSON Server pour simuler cette API ; le fichier seul ne fournit
  pas les routes ni le protocole HTTP.
- **Pourquoi utiliser `onMounted()` ?** Le hook lance le chargement après l’insertion du composant
  dans la page. L’appel asynchrone remplit ensuite l’état réactif.
- **Quel est le rôle d’Axios ?** Axios envoie les requêtes HTTP vers JSON Server, traite les
  réponses JSON et expose les erreurs.
- **Quelle différence entre `ref()` et `computed()` ?** `ref()` conserve une valeur réactive
  modifiable, par exemple les données ou les filtres. `computed()` calcule une valeur dérivée des
  valeurs réactives, ici la liste filtrée.

## Identité et difficultés

- Identité : 13524506
- Difficultés rencontrées : connecter l’application à l’API JSON Server et gérer les états
  asynchrones (chargement et erreurs), puis combiner correctement la recherche par titre avec les
  filtres de statut et de priorité. La configuration de l’URL de l’API via `VITE_API_URL` permet
  également de tester l’application avec une autre adresse sans modifier le code.
