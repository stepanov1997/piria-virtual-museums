const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/database')
const {TokenExpiredError} = require("jsonwebtoken");

const secretKey = 'my-secret-key';

function retrieveClientsFromDatabase() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM main.'CLIENT'", [], (err, rows) => {
            if (err) {
                console.error(err.message);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

router.post('/authenticatePayment', async (req, res) => {
    // Simulate payment processing logic
    const {cardHolderFirstname, cardHolderSurname, cardNumber, cardType, cardExpiration, pin} = req.body;

    // Perform necessary validation and processing
    if (cardHolderFirstname && cardHolderSurname && cardNumber && cardType && cardExpiration && pin) {
        const payload = {cardHolderFirstname, cardHolderSurname, cardNumber, cardType, cardExpiration, pin}
        const clients = await retrieveClientsFromDatabase()
        if(!clients) {
            res.status(400).json({message: 'Data is wrong.'});
            return
        }

        const client = clients.find(e => {
            return e.name === cardHolderFirstname
                && e.surname === cardHolderSurname
                && e.cardNumber === cardNumber
                && e.cardType === cardType
                && e.cardExpire === cardExpiration
                && e.pin === pin
        })
        if (!!client) {
            const token = jwt.sign({id:client.id}, secretKey, {expiresIn: '1m'});

            // Payment successful
            res.status(200).json({
                message: 'Payment authentication successful',
                jwtPaymentToken: token
            });
        } else {
            res.status(400).json({message: 'Payment authentication failed'});
        }
    } else {
        // Payment failed
        res.status(400).json({message: 'Payment authentication failed'});
    }
});

function sendAmount(senderAccountId, receiverAccountId, amount) {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.get('SELECT balance FROM CLIENT WHERE id = ?', [senderAccountId], (err, senderAccount) => {
                if (err) {
                    console.error(err.message);
                    db.run('ROLLBACK', () => {
                        reject(new Error("Error while executing query"));
                    });
                    return;
                }

                if (!senderAccount) {
                    console.error('Sender account not found');
                    db.run('ROLLBACK', () => {
                        reject(new Error("Sender account not found"));
                    });
                    return;
                }

                if (senderAccount.balance < amount) {
                    console.error('Insufficient balance');
                    db.run('ROLLBACK', () => {
                        reject(new Error("Insufficient balance"));
                    });
                    return;
                }

                db.run('UPDATE CLIENT SET balance = balance - ? WHERE id = ?', [amount, senderAccountId], (err) => {
                    if (err) {
                        console.error(err.message);
                        db.run('ROLLBACK', () => {
                            reject(new Error(err.message));
                        });
                        return;
                    }

                    db.run('UPDATE CLIENT SET balance = balance + ? WHERE id = ?', [amount, receiverAccountId], (err) => {
                        if (err) {
                            console.error(err.message);
                            db.run('ROLLBACK', () => {
                                reject(new Error(err.message));
                            });
                            return;
                        }

                        db.run('COMMIT', (err) => {
                            if (err) {
                                console.error(err.message);
                                db.run('ROLLBACK', () => {
                                    reject(new Error(err.message));
                                });
                                return;
                            }

                            console.log(`Successfully sent ${amount} units from account ${senderAccountId} to account ${receiverAccountId}`);
                            resolve();
                        });
                    });
                });
            });
        });
    });
}


router.post('/payment', async (req, res) => {
    // Simulate payment processing logic
    const {receiverCardNumber, amount} = req.body;

    try {
        // Payment successful
        const paymentToken = exportTokenFromRequest(req);
        const decoded = await jwt.verify(paymentToken, secretKey);
        console.log('Decoded token:', decoded);

        const clients = await retrieveClientsFromDatabase()
        const receiverAccountId = clients.find(e => e.cardNumber === receiverCardNumber).id
        if(!receiverAccountId) {
            // Payment failed
            res.status(400).json({message: 'Receiver card is not valid.'});
        }
        const errorMessage = await sendAmount(decoded.id, receiverAccountId, amount)
        if(!errorMessage) {
            res.status(200).json({message: 'Payment successful.'});
            return
        }
        // Payment failed
        res.status(400).json({message: errorMessage});
    } catch (error) {
        // Payment failed
        if(error instanceof TokenExpiredError) {
            res.status(400).json({message: 'Token expired.'});
        }
        console.error('Invalid token:', error.message);
        res.status(400).json({message: 'Payment failed'});
    }
});

function exportTokenFromRequest(req) {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) {
        return undefined
    }
    const [authType, token] = authorizationHeader.split(' ');
    if (authType.toLowerCase() !== 'bearer' || !token) {
        throw new Error("Invalid token");
    }
    return token;
}

module.exports = router;
