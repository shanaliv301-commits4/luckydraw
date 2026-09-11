github.com/shanaliv301-commits4/luckydraw`** 2. Top-right par **`Add file`** ▾ button click karein aur **`Create new file`** chunein. 3. File name wale box mein type karein: `api/verify-payment.js` *(Jab aap `api/` likhenge to GitHub automatically `api` naam ka folder bana dega).* 4. Neeche code area mein yeh **clean code** paste karein: ```javascript import {
    createClient
}

from '@supabase/supabase-js';
const supabase=createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export default async function handler(req, res) {
    if (req.method !=='POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
}

try {
    const {
        wallet_address,
        tx_hash,
        network,
        quantity,
        draw_code
    }

    =req.body;

    if ( !wallet_address || !tx_hash) {
        return res.status(400).json({
            error: 'Missing wallet_address or tx_hash'
        });
}

// 1. Active draw record fetch karein const { data: drawData } = await supabase .from('draws') .select('id, ticket_price_usdt') .eq('draw_code', draw_code || 'LD-2025-14') .single(); const drawId = drawData ? drawData.id : 1; const ticketPrice = drawData ? drawData.ticket_price_usdt : 5.0; const totalPaid = Number(quantity || 1) * ticketPrice; const ticketNumber = 'LD-' + Math.floor(100000 + Math.random() * 900000); // 2. Ticket save aur lock karein const { data: ticket, error } = await supabase .from('tickets') .insert([ { ticket_number: ticketNumber, draw_id: drawId, wallet_address: wallet_address.trim(), network: network || 'TRC20', tx_hash: tx_hash.trim(), quantity: quantity || 1, total_paid_usdt: totalPaid, is_verified: true, is_winner: false } ]) .select() .single(); if (error) { return res.status(400).json({ error: error.message }); } return res.status(200).json({ success: true, message: 'Ticket successfully verified and stored in database!', ticket }); } catch (err) { return res.status(500).json({ error: err.message || 'Server error' }); } }
