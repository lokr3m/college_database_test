require('dotenv').config();
const db = require('./config');          // college_db
const bankDb = require('./bank_config'); // bank

async function sendPendingPaymentsToBankDb() {
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
        const { rows } = await bankDb.query(
          `INSERT INTO incoming_payments
             (source_system, source_payment_id, instructor_id, amount, currency, iban, description)
           VALUES
             ('college', $1, $2, $3, $4, $5, $6)
           ON CONFLICT (source_system, source_payment_id) DO NOTHING
           RETURNING id`,
          [p.id, p.instructor_id, p.amount, p.currency, p.iban, p.description]
        );

        const bankIncomingId = rows[0]?.id ?? null;

        await db.query(
          `UPDATE payments_outbox
           SET status = 'sent',
               sent_at = CURRENT_TIMESTAMP,
               bank_tx_id = $1,
               error_text = NULL
           WHERE id = $2`,
          [bankIncomingId ? `bankdb:${bankIncomingId}` : `bankdb:duplicate:${p.id}`, p.id]
        );

        console.log(`Payment ${p.id} SENT to bank DB. bank_tx_id=${bankIncomingId}`);
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
  } finally {
    await bankDb.end();
    await db.end();
  }
}

sendPendingPaymentsToBankDb();