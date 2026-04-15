require('dotenv').config();
const axios = require('axios');
const db = require('./config');

// Мок-банк: используем postman-echo как "банк API"
const BANK_API_URL = process.env.BANK_API_URL || 'https://postman-echo.com/post';

async function sendPendingPayments() {
  try {
    const { rows: payments } = await db.query(
      `SELECT id, instructor_id, amount, currency, iban, description
       FROM payments_outbox
       WHERE status = 'pending'
       ORDER BY id
       LIMIT 10`
    );

    if (payments.length === 0) {
      console.log('No pending payments.');
      return;
    }

    for (const p of payments) {
      try {
        const payload = {
          payment_id: p.id,
          instructor_id: p.instructor_id,
          amount: p.amount,
          currency: p.currency,
          iban: p.iban,
          description: p.description
        };

        const resp = await axios.post(BANK_API_URL, payload, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        });

        const bankTxId =
          resp?.data?.headers?.['x-forwarded-port']
            ? `echo-${p.id}-${Date.now()}`
            : `bank-${p.id}-${Date.now()}`;

        await db.query(
          `UPDATE payments_outbox
           SET status = 'sent',
               sent_at = CURRENT_TIMESTAMP,
               bank_tx_id = $1,
               error_text = NULL
           WHERE id = $2`,
          [bankTxId, p.id]
        );

        console.log(`Payment ${p.id} SENT. tx=${bankTxId}`);
      } catch (err) {
        await db.query(
          `UPDATE payments_outbox
           SET status = 'failed',
               error_text = $1
           WHERE id = $2`,
          [err.message, p.id]
        );
        console.error(`Payment ${p.id} FAILED: ${err.message}`);
      }
    }
  } catch (err) {
    console.error('Sender crashed:', err.message);
  } finally {
    await db.end();
  }
}

sendPendingPayments();