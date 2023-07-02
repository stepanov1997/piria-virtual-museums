const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database/database')
const {TokenExpiredError} = require("jsonwebtoken");

const secretKey = 'my-secret-key';

router.post('/authenticatePayment', async (req, res) => {
    // Simulate payment processing logic

    try {
        const {cardHolderFirstName, cardHolderSurname, cardNumber, cardType, cardExpiration, pin} = req.body;

        // Perform necessary validation and processing
        if (cardHolderFirstName && cardHolderSurname && cardNumber && cardType && cardExpiration && pin) {

            if (!cardType in ["MASTERCARD", "VISA", "AMERICAN EXPRESS"]) {
                res.status(200).json({status: 400, message: 'Card type is not ok.'});
                return
            }

            try {
                if (!validateCardExpiration(cardExpiration)) {
                    res.status(200).json({status: 400, message: 'Card expired.'});
                    return
                }
            } catch (ex) {
                res.status(200).json({status: 400, message: 'Card expiration date format is not ok. Use MM/YY format.'});
                return
            }

            if (!/^\d{4}$/.test(pin)) {
                res.status(200).json({status: 400, message: 'Pin format is not ok. Use four numbers.'});
                return
            }

            if(!checkCardLength(cardNumber, cardType)) {
                res.status(200).json({status: 400, message: 'Card number length is not ok.'});
            }

            const payload = {
                cardHolderFirstName, cardHolderSurname, cardNumber, cardType, cardExpiration, pin
            }
            const clients = await retrieveClientsFromDatabase()
            if (!clients) {
                res.status(200).json({status: 400, message: 'Data is wrong.'});
                return
            }

            const client = clients.find(e => {
                return e.name === cardHolderFirstName
                    && e.surname === cardHolderSurname
                    && e.cardNumber === cardNumber
                    && e.cardType === cardType
                    && e.cardExpire === cardExpiration
                    && e.pin === pin
            })

            if (!client) {
                res.status(200).json({status: 400, message: 'Payment authentication failed'});
                return
            }

            const token = jwt.sign({id: client.id}, secretKey, {expiresIn: '1m'});

            // Payment successful
            res.status(200).json({
                status: 200,
                message: 'Payment authentication successful',
                jwtPaymentToken: token
            });

        } else {
            // Payment failed
            res.status(200).json({status: 400, message: 'Payment authentication failed'});
        }
    } catch (e) {
        res.status(200).json({status: 400, message: 'Payment authentication failed'});
    }
});

router.post('/payment', async (req, res) => {
    try {
        const {receiverCardNumber, amount} = req.body;

        // Payment successful
        const paymentToken = exportTokenFromRequest(req);
        const decoded = await jwt.verify(paymentToken, secretKey);
        console.log('Decoded token:', decoded);

        const clients = await retrieveClientsFromDatabase()
        const receiverAccountId = clients.find(e => e.cardNumber === receiverCardNumber).id

        if (!receiverAccountId) {
            // Payment failed
            res.status(200).json({status: 400, message: 'Receiver card is not valid.'});
            return
        }

        const errorMessage = await sendAmount(decoded.id, receiverAccountId, amount)

        if (errorMessage) {
            // Payment failed
            res.status(200).json({status: 400, message: errorMessage});
            return
        }

        res.status(200).json({status: 200, message: 'Payment successful.'});

    } catch (error) {

        // Payment failed
        if (error instanceof TokenExpiredError) {
            res.status(200).json({status: 400, message: 'Token expired.'});
            return
        }

        res.status(200).json({status: 400, message: 'Payment failed'});
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

function validateCardExpiration(expirationDate) {
    const currentDate = new Date();
    const [enteredMonth, enteredYear] = expirationDate.split('/').map(Number);
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    return (
        enteredYear > currentYear ||
        (enteredYear === currentYear && enteredMonth >= currentMonth)
    );
}

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

function checkCardLength(cardNumber, cardType) {
    const cardLengths = {
        VISA: [13, 16],
        MASTERCARD: [16],
        AMERICAN_EXPRESS: [15],
    };

    return cardLengths[cardType]?.includes(cardNumber.length) || false;
}

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

module.exports = router;
