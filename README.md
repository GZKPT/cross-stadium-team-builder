# Cross Stadium Team Builder

Web app statica pubblicata con GitHub Pages. La libreria condivisa di Pokémon e squadre usa il progetto Firebase `cross-stadium-team-builder`, Cloud Firestore e Firebase Authentication anonima.

## Uso

- Seleziona uno slot e configura il Pokémon. Usa **Salva questo Pokémon** per dargli un nome e scegliere l'autore.
- Apri **Libreria** per aggiungere un Pokémon allo slot selezionato oppure, su desktop, trascinalo su uno slot preciso.
- Usa **Nuova squadra** per partire dai rental iniziali. Usa **Salva squadra online** per conservarne una copia condivisa, o **Esporta PDF** per scaricarla.
- Nella scheda **Squadre** della libreria puoi caricare una squadra salvata. Modificarla non modifica la copia online: salvarla crea una nuova copia.
- Apri **Mostra analisi** sotto i sei slot per vedere il riepilogo grafico delle debolezze e resistenze difensive e della copertura delle mosse d’attacco selezionate; ogni fila di tacche segue i sei slot della squadra. Le tabelle con i moltiplicatori completi si possono aprire sotto ciascun grafico. L’analisi usa i 18 tipi e la tabella moderna adottata da Cross Stadium, incluse le interazioni introdotte dopo la prima generazione; i moltiplicatori offensivi considerano le quattro mosse impostate per ogni Pokémon.
- Le icone colorate dei tipi compaiono sugli slot Pokémon, nell’editor, accanto alle mosse e nelle schede della libreria.

L'autore è un'etichetta scelta fra GZKPT, Maxter e Cato. L'accesso anonimo non verifica l'identità di chi la seleziona. Le regole Firestore consentono la lettura e la creazione di record dopo l'accesso anonimo e impediscono modifiche e cancellazioni dalla web app. Le regole usate sono in `firestore.rules`.

I tipi dei Pokémon e la tabella di efficacia in `type-analysis-data.js` sono derivati dai dati di [Pokémon Showdown](https://github.com/smogon/pokemon-showdown), distribuiti con licenza MIT.
