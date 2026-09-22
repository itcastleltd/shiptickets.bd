const fs = require('fs');
const files = ['.next\\server\\app\\index.html', '.next\\server\\app\\saint-martin-ship\\keari-sindbad.html', '.next\\server\\app\\saint-martin-ship\\karnafuly-express.html'];
files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/i);
  const canonical = html.match(/<link[^>]*canonical[^>]*>/gi);
  console.log(f + ':');
  console.log('  title:', title ? title[1] : 'NOT FOUND');
  console.log('  canonical:', canonical && canonical.length ? canonical[0].trim().substring(0, 120) : 'NOT FOUND');
  // Check for duplicate ShipTickets.bd in title
  const titleText = title ? title[1] : '';
  const matches = titleText.match(/ShipTickets\.bd/g);
  console.log('  "ShipTickets.bd" in title count:', matches ? matches.length : 0);
});
