# Cross Stadium Team Builder

Web app statica pubblicata con GitHub Pages. La libreria condivisa di Pokémon e squadre usa il progetto Firebase `cross-stadium-team-builder`, Cloud Firestore e Firebase Authentication anonima.

## Uso

- Seleziona uno slot e configura il Pokémon. Usa **Salva questo Pokémon** per dargli un nome e scegliere l'autore.
- Apri **Libreria** per aggiungere un Pokémon allo slot selezionato oppure, su desktop, trascinalo su uno slot preciso.
- Usa **Nuova squadra** per partire dai rental iniziali. Usa **Salva squadra online** per conservarne una copia condivisa, o **Esporta PDF** per scaricarla.
- Nella scheda **Squadre** della libreria puoi caricare una squadra salvata. Modificarla non modifica la copia online: salvarla crea una nuova copia.

L'autore è un'etichetta scelta fra GZKPT, Maxter e Cato. L'accesso anonimo non verifica l'identità di chi la seleziona. Le regole Firestore consentono la lettura e la creazione di record dopo l'accesso anonimo e impediscono modifiche e cancellazioni dalla web app. Le regole usate sono in `firestore.rules`.
