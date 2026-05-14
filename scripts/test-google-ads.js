require('dotenv').config();
const { GoogleAdsApi } = require('google-ads-api');

async function main() {
  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  });

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_MCC_CUSTOMER_ID.replace(/-/g, ''),
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN,
    login_customer_id: process.env.GOOGLE_ADS_MCC_CUSTOMER_ID.replace(/-/g, ''),
  });

  // Listar contas acessíveis via MCC
  const results = await customer.query(`
    SELECT
      customer_client.id,
      customer_client.descriptive_name,
      customer_client.manager,
      customer_client.status
    FROM customer_client
    WHERE customer_client.status = 'ENABLED'
  `);

  console.log('Conexao com Google Ads OK!\n');
  console.log('Contas encontradas:');
  for (const row of results) {
    const cc = row.customer_client;
    console.log(`  - ${cc.descriptive_name} (ID: ${cc.id}) ${cc.manager ? '[MCC]' : ''}`);
  }
}

main().catch((err) => {
  console.error('Erro:', err.message || err);
  process.exit(1);
});
