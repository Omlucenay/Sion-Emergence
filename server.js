const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ── Config email (SMTP O2switch) ────────────────────────
// Remplis les valeurs ci-dessous avec tes identifiants
// SMTP O2switch : Hébergement → Comptes email → SMTP
const transporter = nodemailer.createTransport({
  host: 'mail.sion-emergence.fr',   // ← ton host SMTP O2switch
  port: 465,
  secure: true,
  auth: {
    user: 'contact@sion-emergence.fr',   // ← ton adresse email
    pass: process.env.SMTP_PASS          // ← mot de passe dans .env
  }
});

// ── Labels lisibles pour les postes ────────────────────
const POSTES = {
  eje:        'Éducatrice de jeunes enfants',
  professeur: 'Professeur / Enseignant',
  autre:      'Autre profil'
};

// ── Route candidature ───────────────────────────────────
app.post('/api/candidature', async (req, res) => {
  const { prenom, nom, naissance, email, telephone, poste, autrePoste, message } = req.body;

  // Validation minimale
  if (!prenom || !nom || !email || !telephone || !poste) {
    return res.status(400).json({ error: 'Champs obligatoires manquants.' });
  }

  const posteLabel = poste === 'autre'
    ? `Autre profil : ${autrePoste || 'non précisé'}`
    : (POSTES[poste] || poste);

  const dateNaissance = naissance
    ? new Date(naissance).toLocaleDateString('fr-FR')
    : 'Non renseignée';

  // Email reçu par l'équipe Sion
  const mailEquipe = {
    from: '"Sion Émergence" <contact@sion-emergence.fr>',
    to:   'contact@sion-emergence.fr',       // ← adresse qui reçoit les candidatures
    replyTo: email,
    subject: `Candidature — ${prenom} ${nom} (${posteLabel})`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1B2826">
        <div style="background:#2F5D50;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600">
            Nouvelle candidature
          </h1>
          <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:14px">
            Reçue via sion-emergence.fr
          </p>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #E5DED0;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;width:38%">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Prénom</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;font-size:16px;color:#1B2826">${prenom}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Nom</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;font-size:16px;color:#1B2826">${nom}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Date de naissance</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;font-size:16px;color:#1B2826">${dateNaissance}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Email</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;font-size:16px">
                <a href="mailto:${email}" style="color:#2F5D50">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Téléphone</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0;font-size:16px">
                <a href="tel:${telephone}" style="color:#2F5D50">${telephone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Poste souhaité</span>
              </td>
              <td style="padding:10px 0;border-bottom:1px solid #F2ECE0">
                <span style="background:#E6EEE9;color:#2F5D50;padding:4px 12px;border-radius:999px;font-size:14px;font-weight:600">${posteLabel}</span>
              </td>
            </tr>
            ${message ? `
            <tr>
              <td colspan="2" style="padding:20px 0 0">
                <span style="font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#A8B8B2">Message</span>
                <p style="margin:10px 0 0;font-size:15px;line-height:1.7;color:#2F3E3A;font-style:italic">"${message}"</p>
              </td>
            </tr>` : ''}
          </table>
          <div style="margin-top:28px;padding-top:20px;border-top:1px solid #E5DED0;text-align:center">
            <a href="mailto:${email}?subject=Suite de votre candidature — Sion Émergence"
               style="display:inline-block;background:#E8725A;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600">
              Répondre à ${prenom}
            </a>
          </div>
        </div>
        <p style="text-align:center;font-size:11px;color:#A8B8B2;margin-top:20px">
          Sion Émergence · sion-emergence.fr · Martinique
        </p>
      </div>
    `
  };

  // Email de confirmation envoyé au candidat
  const mailCandidat = {
    from: '"Sion Émergence" <contact@sion-emergence.fr>',
    to:   email,
    subject: `${prenom}, on a bien reçu ta candidature`,
    html: `
      <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1B2826">
        <div style="background:#2F5D50;padding:28px 32px;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:22px;font-weight:600">
            Candidature reçue
          </h1>
          <p style="color:rgba(255,255,255,.75);margin:6px 0 0;font-size:14px">
            Sion Émergence · Martinique
          </p>
        </div>
        <div style="background:#fff;padding:36px 32px;border:1px solid #E5DED0;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:17px;line-height:1.7;color:#2F3E3A;margin:0 0 16px">
            Bonjour <strong>${prenom}</strong>,
          </p>
          <p style="font-size:16px;line-height:1.7;color:#2F3E3A;margin:0 0 16px">
            On a bien reçu ta candidature pour le poste de <strong style="color:#2F5D50">${posteLabel}</strong>.
          </p>
          <p style="font-size:16px;line-height:1.7;color:#2F3E3A;margin:0 0 24px">
            On prend le temps de lire chaque dossier sérieusement. On reviendra vers toi très bientôt pour la suite.
          </p>
          <p style="font-size:15px;line-height:1.7;color:#657570;font-style:italic;margin:0 0 32px">
            En attendant, suis ce qu'on construit sur Instagram : 
            <a href="https://www.instagram.com/sion.emergence/" style="color:#2F5D50">@sion.emergence</a>
          </p>
          <p style="font-size:16px;line-height:1.5;color:#1B2826;margin:0">
            À très bientôt,<br/>
            <strong>L'équipe Sion Émergence</strong>
          </p>
        </div>
        <p style="text-align:center;font-size:11px;color:#A8B8B2;margin-top:20px">
          Sion Émergence · sion-emergence.fr · Martinique
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailEquipe);
    await transporter.sendMail(mailCandidat);
    res.json({ ok: true });
  } catch (err) {
    console.error('Erreur envoi email candidature :', err);
    res.status(500).json({ error: 'Erreur envoi email.' });
  }
});

// ── Toutes les autres routes → index.html (SPA) ─────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sion Émergence · serveur démarré sur le port ${PORT}`);
});
